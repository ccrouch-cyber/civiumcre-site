// The homepage's two live numbers. .github/workflows/stats.yml rewrites this file from the app every hour;
// a null keeps the dash and "Not yet measured". Numbers only: no URLs, no colors (tools/check_site.sh).
window.CIVIUM_STATS = { minutesAvg: null, dollarsUnderwritten: null, deals: null, asOf: '' };
