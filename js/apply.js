(function () {
  var form = document.getElementById('applyForm');
  if (!form) return;

  var MAX_WORDS = 400;
  var textarea = document.getElementById('applyReason');
  var counter = document.getElementById('wordCount');
  var status = document.getElementById('applyStatus');
  var fallbackLink = document.getElementById('applyFallbackLink');
  var recipient = 'ourbeautifulamerica1@gmail.com';

  function countWords(text) {
    var trimmed = text.trim();
    return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  }

  function updateCounter() {
    var count = countWords(textarea.value);
    counter.textContent = count + ' / ' + MAX_WORDS + ' words';
    counter.classList.toggle('word-count-over', count > MAX_WORDS);
  }

  if (textarea && counter) {
    textarea.addEventListener('input', updateCounter);
    updateCounter();
  }

  function showStatus(message) {
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
  }

  function buildMailto() {
    var name = form.applyName.value.trim();
    var age = form.applyAge.value.trim();
    var email = form.applyEmail.value.trim();
    var city = form.applyCity.value.trim();
    var state = form.applyState.value;
    var reason = textarea.value.trim();

    var subject = 'Chapter Application: ' + name + (city ? ' (' + city + (state ? ', ' + state : '') + ')' : '');

    var body =
      'New Our Beautiful America chapter application\n\n' +
      'Name: ' + name + '\n' +
      'Age: ' + age + '\n' +
      'Email: ' + email + '\n' +
      'City: ' + city + '\n' +
      'State: ' + state + '\n\n' +
      "Why I want to start a chapter:\n" + reason;

    return 'mailto:' + recipient +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (countWords(textarea.value) > MAX_WORDS) {
      showStatus('Please shorten your answer to ' + MAX_WORDS + ' words or fewer, then send again.');
      textarea.focus();
      return;
    }

    var mailtoUrl = buildMailto();

    // Keep the always-visible fallback link in sync, in case the visitor's
    // browser has no mail app registered and the automatic open below does
    // nothing.
    if (fallbackLink) { fallbackLink.href = mailtoUrl; }

    showStatus('Opening your email app with your application ready to send. If nothing opens in a few seconds, use the "email us directly" link below and it will already have your answers filled in.');

    // A temporary link + click() opens mail apps more reliably across
    // browsers than setting window.location directly.
    var link = document.createElement('a');
    link.href = mailtoUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
})();
