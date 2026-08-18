(function(){

  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  var pageUrl = window.location.href;
  var pageTitle = document.title;
  var shareText = "Our Beautiful America: a youth-led movement for nature, civics, and community.";

  var shareBtn = document.getElementById('shareBtn');
  var shareMenu = document.getElementById('shareMenu');
  var shareEmail = document.getElementById('shareEmail');
  var shareX = document.getElementById('shareX');
  var copyLinkBtn = document.getElementById('copyLinkBtn');

  if(shareEmail){ shareEmail.href = 'mailto:?subject=' + encodeURIComponent(pageTitle) + '&body=' + encodeURIComponent(shareText + ' ' + pageUrl); }
  if(shareX){ shareX.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(pageUrl); }

  function openShareMenu(){
    shareMenu.classList.add('is-open');
    shareBtn.setAttribute('aria-expanded','true');
  }

  function closeShareMenu(){
    if(!shareMenu) return;
    shareMenu.classList.remove('is-open');
    shareBtn.setAttribute('aria-expanded','false');
  }

  if(shareBtn && shareMenu){
    shareBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if(navigator.share){
        navigator.share({title:pageTitle, text:shareText, url:pageUrl}).catch(function(){});
        return;
      }
      if(shareMenu.classList.contains('is-open')){
        closeShareMenu();
      } else {
        openShareMenu();
      }
    });
    shareMenu.addEventListener('click', function(e){
      e.stopPropagation();
    });
    document.addEventListener('click', function(){
      closeShareMenu();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeShareMenu();
    });
  }

  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand('copy'); }catch(err){}
    document.body.removeChild(ta);
  }

  function copyText(text, btn, doneLabel){
    var original = btn.textContent;
    function done(){
      btn.textContent = doneLabel;
      setTimeout(function(){ btn.textContent = original; }, 1800);
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(function(){ fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  if(copyLinkBtn){
    copyLinkBtn.addEventListener('click', function(){
      copyText(pageUrl, copyLinkBtn, 'Copied!');
    });
  }

  var copyVenmoBtn = document.getElementById('copyVenmoBtn');
  if(copyVenmoBtn){
    copyVenmoBtn.addEventListener('click', function(){
      copyText('@OurBeautifulAmerica', copyVenmoBtn, 'Copied!');
    });
  }

  var copyEmailBtn = document.getElementById('copyEmailBtn');
  if(copyEmailBtn){
    copyEmailBtn.addEventListener('click', function(){
      copyText('ourbeautifulamerica1@gmail.com', copyEmailBtn, 'Copied!');
    });
  }

  var donateModal = document.getElementById('donateModal');
  var donateBtn = document.getElementById('donateBtn');
  var footerDonateBtn = document.getElementById('footerDonateBtn');
  var lastFocused = null;

  function openDonateModal(){
    if(!donateModal) return;
    lastFocused = document.activeElement;
    donateModal.hidden = false;
    var closeBtn = donateModal.querySelector('.modal-close');
    if(closeBtn) closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeDonateModal(){
    if(!donateModal) return;
    donateModal.hidden = true;
    document.body.style.overflow = '';
    if(lastFocused) lastFocused.focus();
  }

  [donateBtn, footerDonateBtn].forEach(function(btn){
    if(btn) btn.addEventListener('click', openDonateModal);
  });

  // Suggested donation amounts: each button opens Venmo with the amount
  // pre-filled and updates the impact line under the buttons.
  // NOTE: Venmo's pay-link format (venmo.com/<handle>?txn=pay&amount=..&note=..)
  // is a widely used but unofficial deep link. Test it on both desktop and
  // mobile after this goes live, since Venmo can change this behavior.
  var amountButtons = document.querySelectorAll('.amount-btn');
  var amountImpact = document.getElementById('amountImpact');
  if(amountButtons.length){
    amountButtons.forEach(function(btn){
      var amount = btn.getAttribute('data-amount');
      var note = 'Donation to Our Beautiful America';
      btn.href = 'https://venmo.com/OurBeautifulAmerica?txn=pay&amount=' + encodeURIComponent(amount) + '&note=' + encodeURIComponent(note);
      btn.target = '_blank';
      btn.rel = 'noopener';
      btn.addEventListener('click', function(){
        amountButtons.forEach(function(b){ b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        if(amountImpact){ amountImpact.textContent = btn.getAttribute('data-impact') || ''; }
      });
    });
  }

  if(donateModal){
    donateModal.querySelectorAll('[data-close]').forEach(function(el){
      el.addEventListener('click', closeDonateModal);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && !donateModal.hidden) closeDonateModal();
    });
  }

  // Default/fallback chapter list, used until (or unless) content.js
  // successfully loads the CMS-managed list from content/chapters/manifest.json.
  var chapters = [
    { name: 'Our Beautiful Barnegat', city: 'Barnegat, NJ', url: 'https://barnegat.ourbeautiful.org/' }
  ];

  var chapterInput = document.getElementById('chapterSearchInput');
  var chapterResults = document.getElementById('chapterResults');

  if(chapterInput && chapterResults){

    // If content.js is present and its fetch resolves with data, swap in
    // the CMS-managed chapter list before the visitor finishes typing.
    if(window.OBA_CHAPTERS_READY && typeof window.OBA_CHAPTERS_READY.then === 'function'){
      window.OBA_CHAPTERS_READY.then(function(loaded){
        if(loaded && loaded.length){ chapters = loaded; }
      });
    }

    function renderResults(matches, query){
      chapterResults.innerHTML = '';

      if(query.trim() === ''){
        chapterResults.hidden = true;
        return;
      }

      if(matches.length === 0){
        var empty = document.createElement('div');
        empty.className = 'chapter-result chapter-result-empty';
        empty.innerHTML = 'No chapters here yet. <a href="apply.html">Be the first, start one.</a>';
        chapterResults.appendChild(empty);
        chapterResults.hidden = false;
        return;
      }

      matches.forEach(function(chapter){
        var link = document.createElement('a');
        link.className = 'chapter-result';
        link.href = chapter.url;
        // Chapters with their own site (a full https:// URL, e.g. a
        // subdomain like barnegat.ourbeautiful.org) open in a new tab so
        // the visitor doesn't lose their place on the main OBA site.
        // Chapters that don't have their own site yet use a relative
        // link (e.g. chapters/name.html) and open in the same tab.
        if(isExternalUrl(chapter.url)){
          link.target = '_blank';
          link.rel = 'noopener';
        }
        link.innerHTML = '<span class="chapter-result-name">' + chapter.name + '</span><span class="chapter-result-city">' + chapter.city + '</span>';
        chapterResults.appendChild(link);
      });
      chapterResults.hidden = false;
    }

    function isExternalUrl(url){
      return /^https?:\/\//i.test(url);
    }

    function search(query){
      var q = query.trim().toLowerCase();
      if(q === '') return [];
      return chapters.filter(function(chapter){
        return chapter.name.toLowerCase().indexOf(q) !== -1 || chapter.city.toLowerCase().indexOf(q) !== -1;
      });
    }

    chapterInput.addEventListener('input', function(){
      renderResults(search(chapterInput.value), chapterInput.value);
    });

    chapterInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        var matches = search(chapterInput.value);
        if(matches.length === 1){
          if(isExternalUrl(matches[0].url)){
            window.open(matches[0].url, '_blank', 'noopener');
          } else {
            window.location.href = matches[0].url;
          }
        }
      }
    });

    chapterInput.addEventListener('focus', function(){
      if(chapterInput.value.trim() !== ''){
        renderResults(search(chapterInput.value), chapterInput.value);
      }
    });

    document.addEventListener('click', function(e){
      if(!chapterResults.contains(e.target) && e.target !== chapterInput){
        chapterResults.hidden = true;
      }
    });
  }

})();
