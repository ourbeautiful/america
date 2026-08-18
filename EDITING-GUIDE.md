# Editing News Posts on GitHub

This is the fast, no-setup way to update the Current News page. It works
today, before the `/admin` editor (see `CMS-SETUP.md`) is fully connected.

You'll need to be added as a collaborator on the repo first: someone with
admin access can do this under **Settings > Collaborators** on
https://github.com/ourbeautiful/america.

## Edit an existing post

1. **Go to the content/news folder on GitHub.**
   Open https://github.com/ourbeautiful/america, click into `content`,
   then `news`. You'll see one file per post, named something like
   `2026-01-01-oba-is-live.md`.

2. **Open the post you want to change.**
   Click its file name, then click the pencil icon in the top right of
   the file view to start editing. If you don't see a pencil icon, you
   likely need to be added as a collaborator first.

3. **Edit the text between the two `---` lines carefully.**
   The top of the file has a block between two `---` lines with
   `title`, `date_label`, and `date`. Only change the text after each
   colon, don't rename the fields or remove the `---` lines themselves.
   Below that block is the post body, which you can edit freely.

   ```
   ---
   title: "Your headline here"
   date_label: "Short tag shown above the title"
   date: 2026-03-01T09:00:00.000Z
   ---
   The body text of the post goes here.
   ```

4. **Preview before committing.**
   GitHub's editor has a "Preview" tab next to "Edit" near the top of
   the editing box. Use it to double check the `---` block still looks
   intact (no stray `---` lines or missing colons) before saving.

5. **Commit your change.**
   Scroll to the bottom, add a short commit message like "Update launch
   post," and click **Commit changes** with "Commit directly to the
   main branch" selected. That's the save button, there's no separate
   publish step.

6. **Check the live site in a minute or two.**
   Committing kicks off the GitHub Action automatically. Visit
   https://america.ourbeautiful.org/news.html after a minute or two and
   your change should be live. You can watch progress under the repo's
   **Actions** tab if you want to confirm it's running.

## Add a brand new post

In the `content/news` folder, click **Add file > Create new file**.
Name it `YYYY-MM-DD-a-short-slug.md`, matching today's date and a few
words about the post, for example `2026-03-01-spring-cleanup-day.md`.

Paste in the same `---` block structure shown above, fill in your own
`title`, `date_label`, and `date`, write the post body underneath, then
commit the same way as above.

## If something looks wrong on the site

The most common cause is a broken `---` block, that's the one part of
the file that has to stay exactly structured. Open the file again, check
that:

* There are exactly two `---` lines, one right before `title:` and one
  right after `date:`.
* Every field still has a colon and a value after it.
* Quotes around `title` and `date_label` are still there if the text
  contains a colon, comma, or apostrophe.

If you're not sure what went wrong, you can always click the file's
**History** button on GitHub to see the previous version and copy it
back.
