/* Shared behaviour for every page: EN/DE language switch and the mobile menu.
   Load at the end of <body>. A page can define onLangChange() to re-render
   its own dynamic content whenever the language changes. */

// localStorage can throw (private mode, blocked site data), so every access is guarded.
var currentLang = 'en';
try { currentLang = localStorage.getItem('tm-lang') || 'en'; } catch (e) {}

function setLang(lang) {
  currentLang = lang;
  try { localStorage.setItem('tm-lang', lang); } catch (e) {}
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(function (el) {
    var text = lang === 'de' ? el.getAttribute('data-de') : el.getAttribute('data-en');
    if (text !== null) el.innerHTML = text;
  });
  var btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'de' ? 'EN' : 'DE';
  if (typeof onLangChange === 'function') onLangChange();
}

function setNavOpen(isOpen) {
  var links = document.getElementById('nav-links');
  var toggle = document.getElementById('nav-toggle');
  if (!links || !toggle) return;
  links.classList.toggle('open', isOpen);
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function toggleNav() {
  setNavOpen(!document.getElementById('nav-links').classList.contains('open'));
}

// Close the mobile menu after tapping a link
document.querySelectorAll('.nav-links a').forEach(function (a) {
  a.addEventListener('click', function () { setNavOpen(false); });
});

// Runs after any inline page scripts that follow this file, so onLangChange is defined by then.
document.addEventListener('DOMContentLoaded', function () { setLang(currentLang); });
