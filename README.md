# Our Beautiful America

Public site: https://america.ourbeautiful.org
Repository: https://github.com/ourbeautiful/america

This is the same site you already had, reorganized so it can be hosted
directly from this GitHub repository, with a content editor (Decap CMS)
wired up for non-technical team members. No page content, styling, or
behavior was changed in the conversion, only the file layout and the
build/deploy setup.

## What is in this repo

```
index.html               Home page
news.html                Current News page
apply.html               Start a Chapter application form (opens the visitor's email app, no server involved)
chapters/                One page per chapter (currently: Barnegat)
css/styles.css           All site styling
js/main.js               Site behavior (nav, share menu, donate modal + suggested amounts, chapter search)
js/content.js            Loads CMS-managed news/chapter content (see below)
js/apply.js              Word counter and mailto submission for apply.html
assets/images/           Logos, favicons, and uploaded media
content/news/            One markdown file per news post (edited via /admin)
content/chapters/        One markdown file per chapter listing (edited via /admin)
admin/                   The Decap CMS editor (config.yml + index.html)
scripts/build.py         Turns the markdown in /content into the JSON the site reads
.github/workflows/       GitHub Actions: builds content and deploys to Pages
CNAME                    Tells GitHub Pages the custom domain is america.ourbeautiful.org
```

## How the site is hosted

This repo deploys itself with GitHub Actions, no separate build server
needed:

1. Someone pushes to `main` (either by editing files directly, opening a
   pull request, or through the CMS at `/admin`).
2. The `Build and deploy to GitHub Pages` workflow runs automatically. It
   regenerates `content/news/manifest.json` and
   `content/chapters/manifest.json` from the markdown files, then publishes
   the whole site to GitHub Pages.
3. The live site updates at https://america.ourbeautiful.org within a
   couple of minutes.

### One-time repository setup

1. In the repo, go to **Settings > Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Under **Custom domain**, enter `america.ourbeautiful.org` and save.
   (The `CNAME` file in this repo already records that domain, so GitHub
   Pages will keep it set even if the site is redeployed.)
4. Check **Enforce HTTPS** once GitHub finishes issuing the certificate
   (can take up to a day after the DNS step below).

### DNS setup (done by whoever manages the ourbeautiful.org domain)

Add a `CNAME` record:

* Host: `america`
* Value: `ourbeautiful.github.io`
  (replace `ourbeautiful` with the GitHub org/user name if different)

GitHub's own docs on custom domains, if needed:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Editing content without touching code

Two kinds of content are editable through the CMS at `/admin` on the live
site (https://america.ourbeautiful.org/admin/):

* **News Posts**, shown on the Current News page
* **Chapters**, which power the "Find a chapter" search box on the home page

Everything else (page text, images, the donate modal, contact details) is
still plain HTML in `index.html`, `news.html`, and the files in
`chapters/`. Edit those directly, or ask for a CMS collection to be added
for them later.

Setting up who can log into `/admin` and publish changes is a short,
one-time step: see [`CMS-SETUP.md`](./CMS-SETUP.md).

## Working locally

No build tools are required to preview the site. From the repo folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser. If you have added or edited
anything in `content/news/` or `content/chapters/`, run this first so the
page picks up the changes:

```
python3 scripts/build.py
```

## Git workflow for the team

* `main` is the live branch. Anything merged into it deploys automatically.
* For hand-edited changes (not made through the CMS), create a new branch,
  make the change, and open a pull request into `main`. That gives the
  team a chance to review before it goes live.
* Changes made through `/admin` are committed straight to `main` by
  default (this keeps things simple for non-technical editors). If your
  team wants a review step for CMS edits too, that can be switched on by
  changing `publish_mode` in `admin/config.yml` to `editorial_workflow`,
  which adds a draft/review/publish flow inside the CMS itself.
