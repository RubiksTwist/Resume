param(
    [string]$ProjectData = "data/projects.json",
    [int]$WaitMilliseconds = 3500,
    [string]$Viewport = "1440,1000"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dataPath = Join-Path $root $ProjectData

if (-not (Test-Path $dataPath)) {
    throw "Project data file not found: $dataPath"
}

$projects = Get-Content -Raw $dataPath | ConvertFrom-Json
$captureProjects = $projects | Where-Object { $_.captureUrl -and $_.screenshot }

if (-not $captureProjects) {
    Write-Host "No projects with captureUrl were found."
    exit 0
}

Write-Host "Ensuring Playwright Chromium is available..."
npx -y playwright@latest install chromium

foreach ($project in $captureProjects) {
    $outputPath = Join-Path $root $project.screenshot
    $outputDir = Split-Path -Parent $outputPath

    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
    }

    Write-Host "Capturing $($project.name): $($project.captureUrl)"
    npx -y playwright@latest screenshot `
        --browser chromium `
        --viewport-size $Viewport `
        --timeout 60000 `
        --wait-for-timeout $WaitMilliseconds `
        $project.captureUrl `
        $outputPath
}

Write-Host "Screenshot refresh complete."
