[CmdletBinding()]
param(
    [switch]$CheckExternal
)

$ErrorActionPreference = 'Stop'
$siteRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$htmlFiles = Get-ChildItem -LiteralPath $siteRoot -Filter '*.html' -File
$failures = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()
$externalUrls = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
$contentCache = @{}

function Get-PageContent {
    param([string]$Path)

    if (-not $contentCache.ContainsKey($Path)) {
        $contentCache[$Path] = Get-Content -Raw -LiteralPath $Path
    }
    return $contentCache[$Path]
}

foreach ($htmlFile in $htmlFiles) {
    $content = Get-PageContent -Path $htmlFile.FullName
    $pageName = $htmlFile.Name

    $requiredPatterns = [ordered]@{
        'document title' = '<title>[^<]+</title>'
        'meta description' = '<meta\s+name="description"\s+content="[^"]+">'
        'canonical URL' = '<link\s+rel="canonical"\s+href="https://[^"]+">'
        'favicon' = '<link\s+rel="icon"\s+href="[^"]+"'
        'Open Graph title' = '<meta\s+property="og:title"\s+content="[^"]+">'
        'Open Graph image' = '<meta\s+property="og:image"\s+content="https://[^"]+">'
    }

    foreach ($requirement in $requiredPatterns.GetEnumerator()) {
        if ($content -notmatch $requirement.Value) {
            $failures.Add("$pageName is missing $($requirement.Key).")
        }
    }

    $h1Count = [regex]::Matches($content, '<h1(?:\s[^>]*)?>', 'IgnoreCase').Count
    if ($h1Count -ne 1) {
        $failures.Add("$pageName must contain exactly one h1; found $h1Count.")
    }

    foreach ($imageTag in [regex]::Matches($content, '<img\b[^>]*>', 'IgnoreCase')) {
        if ($imageTag.Value -notmatch '\balt\s*=') {
            $failures.Add("$pageName contains an image without alt text: $($imageTag.Value)")
        }
    }

    foreach ($externalTab in [regex]::Matches($content, '<a\b[^>]*target="_blank"[^>]*>', 'IgnoreCase')) {
        if ($externalTab.Value -notmatch '\brel="[^"]*noopener') {
            $failures.Add("$pageName opens a new tab without rel=noopener: $($externalTab.Value)")
        }
    }

    $attributeMatches = [regex]::Matches(
        $content,
        '(?:href|src)\s*=\s*["''](?<url>[^"'']+)["'']',
        'IgnoreCase'
    )

    foreach ($attributeMatch in $attributeMatches) {
        $url = $attributeMatch.Groups['url'].Value
        if ($url -match '^(?:https?)://') {
            [void]$externalUrls.Add($url)
            continue
        }
        if ($url -match '^(?:mailto:|tel:|data:|javascript:)') {
            continue
        }

        $urlParts = $url -split '#', 2
        $pathPart = ($urlParts[0] -split '\?', 2)[0]
        $fragment = if ($urlParts.Count -eq 2) { $urlParts[1] } else { $null }
        $targetPath = if ([string]::IsNullOrWhiteSpace($pathPart)) {
            $htmlFile.FullName
        } else {
            Join-Path $siteRoot ([uri]::UnescapeDataString($pathPart.TrimStart('/')))
        }

        if (-not (Test-Path -LiteralPath $targetPath -PathType Leaf)) {
            $failures.Add("$pageName references missing local file: $url")
            continue
        }

        if ($fragment -and ([System.IO.Path]::GetExtension($targetPath) -ieq '.html')) {
            $targetContent = Get-PageContent -Path $targetPath
            $escapedFragment = [regex]::Escape([uri]::UnescapeDataString($fragment))
            if ($targetContent -notmatch "id=[`"']$escapedFragment[`"']") {
                $failures.Add("$pageName references missing fragment: $url")
            }
        }
    }
}

if ($CheckExternal) {
    foreach ($url in ($externalUrls | Sort-Object)) {
        $status = & curl.exe -L -sS --connect-timeout 10 --max-time 30 -o NUL -w '%{http_code}' $url
        $curlExitCode = $LASTEXITCODE
        $statusCode = 0
        [void][int]::TryParse(($status | Select-Object -Last 1), [ref]$statusCode)

        if ($curlExitCode -ne 0 -or $statusCode -eq 0) {
            $failures.Add("External URL could not be reached: $url")
        } elseif ($statusCode -ge 200 -and $statusCode -lt 400) {
            Write-Host "External $statusCode  $url"
        } elseif ($statusCode -in 403, 429, 999) {
            $warnings.Add("External URL blocked automated validation ($statusCode): $url")
        } else {
            $failures.Add("External URL returned HTTP $statusCode`: $url")
        }
    }
}

foreach ($warning in $warnings) {
    Write-Warning $warning
}

if ($failures.Count -gt 0) {
    foreach ($failure in $failures) {
        Write-Error $failure -ErrorAction Continue
    }
    exit 1
}

Write-Host "Validated $($htmlFiles.Count) HTML pages, $($externalUrls.Count) outbound URLs, and all referenced local files."
exit 0
