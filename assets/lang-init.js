/* Runs in <head> before the page is shown. If German was chosen earlier, hide the page
   until site.js has translated it (see .lang-pending in site.css). */
(function () {
  try {
    if (localStorage.getItem('tm-lang') !== 'de') return;
    var root = document.documentElement;
    root.lang = 'de';
    root.classList.add('lang-pending');
    setTimeout(function () { root.classList.remove('lang-pending'); }, 3000); // never stay hidden
  } catch (e) {}
})();
