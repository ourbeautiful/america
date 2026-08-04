# Setting up the content editor (/admin)

The site itself stays hosted on GitHub Pages. Netlify is not used to host
any pages, it is only used for one thing: letting `/admin` sign editors in
with their GitHub account, using a free proxy Netlify provides for exactly
this case. This is the standard way to run Decap CMS (formerly Netlify
CMS) on a site that is not itself hosted on Netlify.

You do this once. After it is set up, editors just log into
`https://america.ourbeautiful.org/admin/` with GitHub and start writing.

## 1. Create a free Netlify site connected to this repo

1. Go to https://app.netlify.com and sign up or log in (a free account is
   enough).
2. Click **Add new site > Import an existing project**, choose GitHub,
   and select the `ourbeautiful/america` repository.
3. When asked for build settings, you can leave them at the defaults, or
   set:
   * Build command: (leave blank)
   * Publish directory: `.`
   It does not matter if this Netlify deployment is ever visited. Its
   only job is providing the GitHub sign-in proxy.
4. Finish the import. Netlify will assign a random address such as
   `https://chipper-narwhal-12345.netlify.app`. Copy that address, it is
   needed in step 3 below.

## 2. Enable GitHub as an identity provider on that Netlify site

1. In the Netlify site you just created, go to **Site configuration >
   Identity** (or, on older Netlify UIs, **Site settings > Access
   control > OAuth**).
2. Under **Git Gateway** / **OAuth**, click **Install provider**, choose
   **GitHub**, and follow the prompt. Netlify handles creating and
   storing the GitHub OAuth credentials, no separate GitHub OAuth app
   needs to be registered by hand.

## 3. Point the CMS config at that Netlify site

1. Open `admin/config.yml` in this repo.
2. Replace this line:
   ```
   base_url: https://REPLACE-WITH-YOUR-NETLIFY-SITE.netlify.app
   ```
   with the actual address from step 1, for example:
   ```
   base_url: https://chipper-narwhal-12345.netlify.app
   ```
3. Commit and push that change to `main`. The GitHub Action will
   redeploy the site automatically.

## 4. Give your team access

Editors need to be collaborators on the `ourbeautiful/america` GitHub
repository (**Settings > Collaborators** in the repo), since sign-in
happens through GitHub. Anyone with write access to the repo can log into
`/admin` and publish content.

## 5. Try it

Go to `https://america.ourbeautiful.org/admin/`, click **Login with
GitHub**, and authorize the app. You should see the **News Posts** and
**Chapters** collections. Editing and publishing a post there commits a
markdown file to `content/news/` in this repo, which triggers the same
GitHub Action that runs for any other push, so the change goes live
automatically.

## Notes

* If your team would rather not involve Netlify at all, the alternative
  is self-hosting a small GitHub OAuth proxy (a few well-documented open
  source options exist, such as the one in the Decap CMS docs:
  https://decapcms.org/docs/github-backend/). That trades one extra
  free Netlify account for running your own proxy service, generally not
  worth it for a small non-profit team.
* The CMS only ever writes to `content/news/` and `content/chapters/`.
  It cannot edit `index.html`, `css/styles.css`, or anything else in the
  repo, so there is no risk of an editor accidentally breaking the page
  layout while writing a news post.
