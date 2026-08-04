(function () {
  /*
   * Loads content that non-technical editors manage through the /admin
   * (Decap CMS) panel: news posts and the chapter directory.
   *
   * This is progressive enhancement only. If a fetch fails (offline,
   * opened from a local file, manifest not built yet), the static HTML
   * that already exists in index.html / news.html is left exactly as is.
   */

  function escapeHtml(value) {
    var div = document.createElement('div');
    div.textContent = value == null ? '' : value;
    return div.innerHTML;
  }

  // ---- News list (news.html) -------------------------------------------
  var newsList = document.getElementById('newsList');
  if (newsList) {
    fetch('content/news/manifest.json', { cache: 'no-store' })
      .then(function (res) { if (!res.ok) throw new Error('manifest missing'); return res.json(); })
      .then(function (posts) {
        if (!Array.isArray(posts) || posts.length === 0) return;

        newsList.innerHTML = '';
        posts.forEach(function (post) {
          var article = document.createElement('article');
          article.className = 'post reveal is-visible';
          article.innerHTML =
            '<span class="post-date">' + escapeHtml(post.date_label || '') + '</span>' +
            '<h2>' + escapeHtml(post.title || '') + '</h2>' +
            '<p>' + escapeHtml(post.body || '') + '</p>';
          newsList.appendChild(article);
        });
      })
      .catch(function () { /* keep the static markup already in the page */ });
  }

  // ---- Chapter directory (used by the search box on index.html) --------
  window.OBA_CHAPTERS_READY = fetch('content/chapters/manifest.json', { cache: 'no-store' })
    .then(function (res) { if (!res.ok) throw new Error('manifest missing'); return res.json(); })
    .then(function (chapters) {
      if (!Array.isArray(chapters) || chapters.length === 0) return null;
      window.OBA_CHAPTERS = chapters.map(function (chapter) {
        return { name: chapter.name, city: chapter.city, url: chapter.url };
      });
      return window.OBA_CHAPTERS;
    })
    .catch(function () { return null; });
})();
