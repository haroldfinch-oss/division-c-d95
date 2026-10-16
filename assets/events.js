/* ══════════════════════════════════════════════════════════════════════
   DIVISION C EVENTS
   This is the only file you need to edit to add, change or remove events.
   The home page shows the next 3 upcoming events and marks every event
   in the calendar. Past events can stay here (they remain in the calendar)
   or be deleted.

   HOW TO ADD AN EVENT
   Copy the template below, paste it into the list, and fill it in.
   Keep the commas between events. The order doesn't matter, but keeping
   them in date order makes the list easier to read.

     {
       date: '2027-05-15',            // YYYY-MM-DD (required)
       start: '10:00', end: '16:00',  // 24-hour times; leave both out if not known yet
       name: 'Area C3 Speech Contest',// shown as written, in both languages
       location: 'Hannover',          // plain text, the same in both languages
       language: 'DE/EN',             // codes: 'EN', 'DE', 'DE/EN', 'EN/DE'
       registerUrl: 'https://…'       // optional: adds a "Register" button
     },

   OPTIONAL EXTRAS
   • Different location text per language:
       location: { en: 'Online (Zoom)', de: 'Online (Zoom)' }
   • More than one registration link (e.g. separate German and English
     sessions): use registerUrls instead of registerUrl. Buttons appear side
     by side in this order:
       registerUrls: [
         { label: { en: 'Register (Deutsch)', de: 'Anmelden (Deutsch)' }, url: 'https://…' },
         { label: { en: 'Register (English)', de: 'Anmelden (Englisch)' }, url: 'https://…' }
       ]

   If an event has a mistake (for example a wrongly typed date), it is
   skipped and the rest of the calendar still works. Open the browser's
   developer console to see which event was skipped and why.
   ══════════════════════════════════════════════════════════════════════ */

var EVENTS = [
  {
    date: '2026-06-20', start: '09:00', end: '18:00',
    name: 'Area C1+C2 Club Officer Training',
    location: 'Berlin',
    language: 'DE/EN'
  },
  {
    date: '2026-08-08', start: '10:00', end: '16:00',
    name: 'Area C4 Club Officer Training',
    location: 'Basislager Coworking, Leipzig',
    language: 'EN',
    registerUrl: 'https://forms.gle/njPS7H6gzFLDWwKi9'
  },
  {
    date: '2026-08-23', start: '10:00', end: '16:00',
    name: 'Area C3 Club Officer Training',
    location: 'Lernoase am Elm, Hinterm Hagen 26/27, Fallersleben',
    language: 'DE',
    registerUrl: 'https://forms.gle/1A7bd2PfPMVwBV4c6'
  },
  {
    date: '2026-08-30', start: '09:30', end: '15:30',
    name: 'Last Chance COT!',
    location: 'Online',
    language: 'EN/DE',
    registerUrls: [
      { label: { en: 'Register (Deutsch)', de: 'Anmelden (Deutsch)' }, url: 'https://us06web.zoom.us/meeting/register/dM-dUyCxRZCiXo6fOIGtqg' },
      { label: { en: 'Register (English)', de: 'Anmelden (Englisch)' }, url: 'https://us06web.zoom.us/meeting/register/bHgoNi0qRtOddLuxTtc65g' }
    ]
  },
  {
    date: '2026-11-28', start: '09:43', end: '18:29',
    name: 'Toastmasters Tag',
    location: 'CVJM Jugendgästehaus Berlin',
    language: 'DE/EN',
    registerUrl: 'https://toastmasters-tag.de/'
  },
  {
    date: '2027-01-23', start: '09:00', end: '18:00',
    name: 'Area C1+C2 Club Officer Training',
    location: 'Berlin',
    language: 'DE/EN'
  },
  {
    date: '2027-01-30',
    name: 'Area C4 Club Officer Training',
    location: 'Quartier22 Dresden',
    language: 'DE/EN'
  },
  {
    date: '2027-03-13', start: '09:00', end: '15:00',
    name: 'Area C1 Speech Contest',
    location: 'Berlin',
    language: 'DE/EN'
  },
  {
    date: '2027-03-20', start: '09:00', end: '18:00',
    name: 'Area C2 Speech Contest',
    location: 'Berlin',
    language: 'DE/EN'
  },
  {
    date: '2027-04-17', start: '09:00', end: '18:00',
    name: 'Division Conference',
    location: 'Dresden',
    language: 'DE/EN'
  }
];
