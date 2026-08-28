# Alex Cheung Portfolio

Static portfolio and project case studies for [www.alexcheung.info](https://www.alexcheung.info/).

## Local preview

From the project root, start any static file server. For example:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

## Validation

Run the built-in checker before publishing:

```powershell
./scripts/check-site.ps1
```

It verifies required page metadata, heading structure, local links, image sources, and fragment targets. To also probe outbound URLs:

```powershell
./scripts/check-site.ps1 -CheckExternal
```

Some social networks block automated checks; those responses are reported as warnings rather than site failures.

## Structure

- `index.html` — portfolio landing page
- `project-*.html` — individual case studies
- `styles.css` — shared site styles
- `assets/projects/` — project screenshots and share images
- `assets/diagrams/` — architecture and workflow diagrams
- `images/` — additional screenshots
- `scripts/check-site.ps1` — dependency-free validation script

The site has no build step or runtime dependencies. Deploy the project root as a static website and preserve the existing paths.

## Deployment handoff

The production domain is hosted by Azure Static Web Apps. As verified on August 27, 2026, `www.alexcheung.info` resolves through this CNAME:

```text
ambitious-bush-09c6a450f.4.azurestaticapps.net
```

The source repository is `https://github.com/RubiksTwist/Resume.git`. Its default and production deployment branch is `api-feature-branch`.

The workflow at `.github/workflows/azure-static-web-apps-ambitious-bush-09c6a450f.yml` deploys the project root when that branch receives a push. It expects the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_BUSH_09C6A450F`. The workflow and secret already belong to the existing Azure resource; do not create a second Static Web App.
