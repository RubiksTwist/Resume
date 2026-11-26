# Notes for agents working on this site

## How the pages are built

The site has no build step. Every page is a hand-edited HTML file that links `styles.css` and `app.js`.

- No page has a header. Each page ends with the section rail, a `nav` that `app.js` drives. The homepage is the only page without a back button at the top.
- The rail's nodes must match the section ids on the same page. When you add or remove a section, update the rail on that page.
- Bump the `?v=` number on `styles.css` and `app.js` in every page when you change either file, so that returning visitors do not get a cached copy.
- Run `scripts/check-site.ps1` before you publish.

## Parked content

`_parked/` holds content that is kept on disk and is not part of the site. Git ignores the folder, so nothing in it is committed or deployed.

- `_parked/labs/` holds the three lab pages (`securityLab.html`, `azure-challenge.html`, `capstone.html`) and the images that only those pages use.
- `_parked/old-design/` holds the previous design: the old pages, `site.css`, `shell.css`, the old `styles.css` and `app.js`, `visitor-counter.js`, and `scripts/apply-shell.py`.

Do not link to the lab pages, add a Labs section, or move parked files back unless Alex asks.

### Restore a lab page

The lab pages were written for the previous design, so a restored page needs new markup.

1. Move the page from `_parked/labs/` to the site root, and move its images from `_parked/labs/images/` to `images/`.
2. Rebuild the page on the layout of a current `project-*.html` page, with a back button, the section rail, and the closing footer.
3. Link to the page from `index.html`.
4. Run `scripts/check-site.ps1` and fix every broken link that the script reports.
