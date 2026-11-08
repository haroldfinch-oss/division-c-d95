/* Home page (index.html): events calendar, upcoming events, privacy notice and the
   'Division at a glance' carousel. Loaded after assets/site.js and assets/events.js. */

// Events live in assets/events.js (loaded above); edit that file, not this one.
var LANG_NAMES = {
  EN: { en: 'English', de: 'Englisch' },
  DE: { en: 'German', de: 'Deutsch' }
};
var TBA = { en: 'Time to be announced', de: 'Uhrzeit folgt' };
// Keep only well-formed events so one typo can't break the whole calendar
EVENTS = (typeof EVENTS !== 'undefined' && Array.isArray(EVENTS) ? EVENTS : []).filter(function (e, i) {
  var ok = e && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && !isNaN(parseDate(e.date)) && e.name;
  if (!ok && window.console) console.warn('Skipped event #' + (i + 1) + ' in assets/events.js: it needs a date (YYYY-MM-DD) and a name.', e);
  return ok;
});
var MONTHS_FULL = {
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
};
var MONTHS_SHORT = {
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  de: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']
};
var WEEKDAYS_FULL = {
  en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
  de: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag']
};
var DOW_SHORT = {
  en: ['Mo','Tu','We','Th','Fr','Sa','Su'],
  de: ['Mo','Di','Mi','Do','Fr','Sa','So']
};
var TEXT = {
  noEventsDay: { en: 'No events on this day.', de: 'Keine Veranstaltungen an diesem Tag.' },
  noUpcoming: { en: 'No upcoming events at the moment — check back soon.', de: 'Zurzeit keine anstehenden Veranstaltungen — schau bald wieder vorbei.' },
  register: { en: 'Register', de: 'Anmelden' },
  event: { en: 'event', de: 'Veranstaltung' },
  events: { en: 'events', de: 'Veranstaltungen' },
  prevMonth: { en: 'Previous month', de: 'Vorheriger Monat' },
  nextMonth: { en: 'Next month', de: 'Nächster Monat' },
  pause: { en: 'Pause slideshow', de: 'Diashow anhalten' },
  play: { en: 'Play slideshow', de: 'Diashow abspielen' },
  slide: { en: 'Slide', de: 'Folie' }
};
function parseDate(s) {
  var p = s.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}
function pad(n) { return (n < 10 ? '0' : '') + n; }
function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function eventsOn(key) { return EVENTS.filter(function (e) { return e.date === key; }); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
}
// A field may be plain text or { en: '…', de: '…' }
function localised(v) {
  if (v === undefined || v === null) return '';
  return typeof v === 'object' ? (v[currentLang] || v.en || '') : String(v);
}
// 'DE/EN' → 'German/English' (or 'Deutsch/Englisch'); unknown codes are shown as written
function languageText(v) {
  if (typeof v !== 'string') return localised(v);
  return v.split('/').map(function (code) {
    var n = LANG_NAMES[code.trim().toUpperCase()];
    return n ? n[currentLang] : code.trim();
  }).join('/');
}
function timeText(e) {
  if (!e.start) return TBA[currentLang];
  return e.start + (e.end ? '–' + e.end : '');
}
// Joins the non-empty parts with " · "
function metaLine() {
  return [].slice.call(arguments).filter(Boolean).map(escapeHtml).join(' · ');
}
function formatLong(key) {
  var d = parseDate(key);
  if (currentLang === 'de') {
    return WEEKDAYS_FULL.de[d.getDay()] + ', ' + d.getDate() + '. ' + MONTHS_FULL.de[d.getMonth()] + ' ' + d.getFullYear();
  }
  return WEEKDAYS_FULL.en[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS_FULL.en[d.getMonth()] + ' ' + d.getFullYear();
}
// Normalises an event's registration link(s) into a single array,
// whether it was defined via registerUrl (single) or registerUrls (multiple).
function registerLinks(e) {
  if (e.registerUrls && e.registerUrls.length) return e.registerUrls;
  if (e.registerUrl) return [{ label: null, url: e.registerUrl }];
  return [];
}
// Renders one or more register buttons/links side by side for an event.
// Past events get none: their registration links have usually expired.
// opts: { groupClass, btnClass, suffix (optional text appended, e.g. ' →') }
function registerButtonsHtml(e, opts) {
  var links = registerLinks(e);
  if (!links.length || parseDate(e.date) < _today) return '';
  var html = '<div class="' + opts.groupClass + '">';
  links.forEach(function (l) {
    // Only web links become buttons, so a mistyped javascript: or data: link can never run
    if (!isWebLink(l.url)) { if (window.console) console.warn('Skipped a register link that is not http(s):', l.url); return; }
    var text = l.label ? localised(l.label) : TEXT.register[currentLang];
    if (opts.suffix) text += opts.suffix;
    html += '<a href="' + escapeHtml(l.url) + '" class="' + opts.btnClass + '" target="_blank" rel="noopener">' +
      escapeHtml(text) + '</a>';
  });
  html += '</div>';
  return html;
}
function isWebLink(url) {
  try { return /^https?:$/.test(new URL(url, location.href).protocol); } catch (e) { return false; }
}
var _today = new Date(); _today.setHours(0, 0, 0, 0);
var _sorted = EVENTS.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
var _upcoming = _sorted.filter(function (e) { return parseDate(e.date) >= _today; }).slice(0, 3);
var _init = _upcoming.length ? parseDate(_upcoming[0].date) : new Date();
var calYear = _init.getFullYear();
var calMonth = _init.getMonth();
var selectedKey = _upcoming.length ? _upcoming[0].date : dateKey(_today);
function renderCalendar() {
  document.getElementById('cal-title').textContent = MONTHS_FULL[currentLang][calMonth] + ' ' + calYear;
  document.getElementById('cal-prev').setAttribute('aria-label', TEXT.prevMonth[currentLang]);
  document.getElementById('cal-next').setAttribute('aria-label', TEXT.nextMonth[currentLang]);
  var html = '';
  DOW_SHORT[currentLang].forEach(function (d) {
    html += '<div class="cal-dow">' + d + '</div>';
  });
  var first = new Date(calYear, calMonth, 1);
  var offset = (first.getDay() + 6) % 7; // Monday-first
  for (var i = 0; i < offset; i++) html += '<div class="cal-day empty"></div>';
  var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  var todayKey = dateKey(_today);
  for (var day = 1; day <= daysInMonth; day++) {
    var key = calYear + '-' + pad(calMonth + 1) + '-' + pad(day);
    var n = eventsOn(key).length;
    var cls = 'cal-day';
    if (n) cls += ' event';
    if (key === selectedKey) cls += ' selected';
    if (key === todayKey) cls += ' today';
    // Screen readers hear the full date and the number of events, not just the day number
    var label = formatLong(key) + (n ? ', ' + n + ' ' + (n === 1 ? TEXT.event : TEXT.events)[currentLang] : '');
    html += '<button type="button" class="' + cls + '" data-date="' + key + '" aria-label="' + escapeHtml(label) + '"' +
      ' aria-pressed="' + (key === selectedKey) + '"' + (key === todayKey ? ' aria-current="date"' : '') + '>' + day + '</button>';
  }
  document.getElementById('cal-grid').innerHTML = html;
}
function renderDayEvents() {
  var box = document.getElementById('cal-day-events');
  var evs = eventsOn(selectedKey);
  var html = '<div class="cal-events-title">' + formatLong(selectedKey) + '</div>';
  if (!evs.length) {
    html += '<div class="cal-no-events">' + TEXT.noEventsDay[currentLang] + '</div>';
  } else {
    evs.forEach(function (e) {
      html += '<div class="cal-event-item"><strong>' + escapeHtml(e.name) + '</strong>' +
        metaLine(timeText(e), languageText(e.language), localised(e.location)) +
        registerButtonsHtml(e, { groupClass: 'cal-register-group', btnClass: 'cal-register', suffix: ' →' }) +
        '</div>';
    });
  }
  box.innerHTML = html;
}
function renderUpcoming() {
  var box = document.getElementById('event-list');
  if (!_upcoming.length) {
    box.innerHTML = '<div class="cal-no-events">' + TEXT.noUpcoming[currentLang] + '</div>';
    return;
  }
  var html = '';
  _upcoming.forEach(function (e) {
    var d = parseDate(e.date);
    html += '<div class="event-card" data-date="' + e.date + '">' +
      '<div class="event-date"><span class="day">' + d.getDate() + '</span>' +
      '<span class="month">' + MONTHS_SHORT[currentLang][d.getMonth()] + '</span></div>' +
      '<div class="event-details"><div class="event-name">' + escapeHtml(e.name) + '</div>' +
      '<div class="event-meta">' + metaLine(formatLong(e.date), timeText(e)) + '</div>' +
      '<div class="event-meta">' + metaLine(localised(e.location), languageText(e.language)) + '</div>' +
      registerButtonsHtml(e, { groupClass: 'event-register-group', btnClass: 'event-register-btn' }) +
      '</div></div>';
  });
  box.innerHTML = html;
}
function selectDate(key) {
  selectedKey = key;
  var d = parseDate(key);
  calYear = d.getFullYear();
  calMonth = d.getMonth();
  renderCalendar();
  renderDayEvents();
}
function shiftMonth(delta) {
  calMonth += delta;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
}
function renderAll() {
  renderCalendar();
  renderDayEvents();
  renderUpcoming();
}
// Tap a day in the calendar → show that day's events
document.getElementById('cal-grid').addEventListener('click', function (ev) {
  var btn = ev.target.closest('.cal-day');
  if (!btn || !btn.getAttribute('data-date')) return;
  var key = btn.getAttribute('data-date');
  selectDate(key);
  // The grid has been rebuilt, so put keyboard focus back on the chosen day
  var same = document.querySelector('#cal-grid [data-date="' + key + '"]');
  if (same) same.focus();
});
// Tap an event card → jump the calendar to that date
document.getElementById('event-list').addEventListener('click', function (ev) {
  if (ev.target.closest('a')) return; // a Register link opens its own page and leaves the calendar alone
  var card = ev.target.closest('.event-card');
  if (card && card.getAttribute('data-date')) selectDate(card.getAttribute('data-date'));
});
document.getElementById('cal-prev').addEventListener('click', function () { shiftMonth(-1); });
document.getElementById('cal-next').addEventListener('click', function () { shiftMonth(1); });
// Called by setLang() in assets/site.js on load and on every language switch
function onLangChange() {
  renderAll();
  if (typeof updateGlanceLabels === 'function') updateGlanceLabels();
  updateBannerPadding();
}
// Privacy notice banner — shows once, remembers dismissal
// While it is shown, keyboard focus is scrolled clear of it instead of behind it, and extra space
// below the footer lets the last links on the page scroll above it
function updateBannerPadding() {
  var banner = document.getElementById('privacy-banner');
  var shown = banner && banner.classList.contains('show');
  var space = shown ? (banner.offsetHeight + 30) + 'px' : '';
  document.documentElement.style.scrollPaddingBottom = space;
  document.body.style.paddingBottom = space;
}
document.getElementById('privacy-dismiss').addEventListener('click', function () { dismissPrivacyBanner(); });
function dismissPrivacyBanner() {
  document.getElementById('privacy-banner').classList.remove('show');
  try { localStorage.setItem('tm-privacy-ack', 'yes'); } catch (e) {}
  updateBannerPadding();
}
(function () {
  var acked = false;
  try { acked = !!localStorage.getItem('tm-privacy-ack'); } catch (e) {}
  if (!acked) {
    var banner = document.getElementById('privacy-banner');
    banner.classList.add('show');
    updateBannerPadding();
    window.addEventListener('resize', updateBannerPadding);
    // Something already on screen but under the banner is not scrolled by the browser, so nudge it up
    document.addEventListener('focusin', function (e) {
      if (!banner.classList.contains('show') || banner.contains(e.target)) return;
      var r = e.target.getBoundingClientRect(), top = banner.getBoundingClientRect().top;
      if (r.bottom > top) window.scrollBy(0, r.bottom - top + 16);
    });
  }
})();
// Division at a glance — auto-scrolling carousel
// Autoplay stops while the slides are hovered or focused, and the visitor can pause it with the button.
var updateGlanceLabels;
(function () {
  var track = document.getElementById('glance-track');
  if (!track) return;
  var slides = track.children;
  var count = slides.length;
  var dotsBox = document.getElementById('glance-dots');
  var toggle = document.getElementById('glance-toggle');
  var viewport = track.parentNode;
  var current = 0;
  var timer = null;
  var userPaused = false, hovering = false, focused = false;
  // Only build controls / autoplay if more than one slide
  if (count <= 1) return;
  // Build dots
  for (var i = 0; i < count; i++) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'glance-dot';
    (function (idx) {
      dot.addEventListener('click', function () { goTo(idx); resetTimer(); });
    })(i);
    dotsBox.appendChild(dot);
  }
  function goTo(idx) {
    current = idx;
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    var dots = dotsBox.children;
    for (var j = 0; j < count; j++) {
      dots[j].className = 'glance-dot' + (j === idx ? ' active' : '');
      if (j === idx) dots[j].setAttribute('aria-current', 'true'); else dots[j].removeAttribute('aria-current');
      // Slides that are off screen are taken out of the Tab order and hidden from screen readers
      slides[j].inert = j !== idx;
      slides[j].setAttribute('aria-hidden', j === idx ? 'false' : 'true');
    }
  }
  function next() { goTo((current + 1) % count); }
  function prev() { goTo((current - 1 + count) % count); }
  // No auto-advance for visitors who ask their device to reduce motion
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = reduceMotion || userPaused || hovering || focused || document.hidden ? null : setInterval(next, 6000);
  }
  updateGlanceLabels = function () {
    var dots = dotsBox.children;
    for (var j = 0; j < dots.length; j++) dots[j].setAttribute('aria-label', TEXT.slide[currentLang] + ' ' + (j + 1));
    toggle.textContent = (userPaused ? TEXT.play : TEXT.pause)[currentLang];
  };
  if (!reduceMotion) {
    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      userPaused = !userPaused;
      updateGlanceLabels();
      resetTimer();
    });
  }
  viewport.addEventListener('mouseenter', function () { hovering = true; resetTimer(); });
  viewport.addEventListener('mouseleave', function () { hovering = false; resetTimer(); });
  viewport.addEventListener('focusin', function () { focused = true; resetTimer(); });
  viewport.addEventListener('focusout', function (e) {
    if (!viewport.contains(e.relatedTarget)) { focused = false; resetTimer(); }
  });
  // Pause while the tab is in the background
  document.addEventListener('visibilitychange', resetTimer);
  // Swipe left/right on touch screens; vertical scrolling is left alone
  var startX = null, startY = null;
  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
    startX = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) next(); else prev(); resetTimer(); }
  }, { passive: true });
  goTo(0);
  updateGlanceLabels();
  resetTimer();
})();
