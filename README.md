# Division C — Toastmasters District 95

Website for District 95, Division C.  
Live at: [division-c.toastmasters-95.org](https://division-c.toastmasters-95.org)

## Setup

Hosted on GitHub Pages with a custom subdomain.

**DNS record (managed by toastmasters-95.org domain owner):**
```
CNAME  division-c  →  <your-github-username>.github.io
```

**GitHub Pages settings:**
- Source: root of `main` branch
- Custom domain: `division-c.toastmasters-95.org`
- Enforce HTTPS: ✅

## Editing the site

All content is in `index.html`. Things to update:

- **Club names & locations** — search for `Club name here` and replace with real clubs
- **Contact email** — replace `division-c@toastmasters-95.org` with the real address
- **Hero tagline** — currently "Find your voice." — feel free to change
- **Nav links** — add more pages (e.g. contest, events) as needed

## Structure

```
/
├── index.html      ← main page
├── CNAME           ← custom domain for GitHub Pages
└── README.md
```
