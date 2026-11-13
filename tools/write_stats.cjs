'use strict';
// tools/write_stats.cjs: turns the app's public stats into docs/assets/stats.js, the homepage's two live numbers.
// Run by .github/workflows/stats.yml:  node tools/write_stats.cjs stats.json docs/assets/stats.js
// The input is the app's answer (design_handoff_homepage/README.md, "Live numbers"):
//   { "minutes_avg": 14.2, "dollars_underwritten": 1234567890, "deals": 312, "as_of": "2026-11-12T21:00:00Z" }
// Anything that is not a positive number is written as null, and the homepage keeps "Not yet measured" for it.
// The output holds numbers and a date only: no URL and no color, so tools/check_site.sh stays green.
// Node only. The guard at the bottom keeps the file inert anywhere else.

function main() {
  const fs = module.require('fs');
  const [, , input, output] = process.argv;
  const data = JSON.parse(fs.readFileSync(input, 'utf8'));
  const num = v => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null);
  const minutes = num(data.minutes_avg);
  const dollars = num(data.dollars_underwritten);
  const deals = Number.isInteger(data.deals) && data.deals >= 0 ? data.deals : null;
  const asOf = typeof data.as_of === 'string' && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(data.as_of) ? data.as_of : '';

  const body = "// The homepage's two live numbers. .github/workflows/stats.yml rewrites this file from the app every hour;\n"
    + "// a null keeps the dash and \"Not yet measured\". Numbers only: no URLs, no colors (tools/check_site.sh).\n"
    + 'window.CIVIUM_STATS = { minutesAvg: ' + (minutes === null ? 'null' : Math.round(minutes * 10) / 10)
    + ', dollarsUnderwritten: ' + (dollars === null ? 'null' : Math.round(dollars))
    + ', deals: ' + (deals === null ? 'null' : deals)
    + ", asOf: '" + asOf + "' };\n";
  fs.writeFileSync(output, body);
  console.log(body);
}

const runByNode = typeof process === 'object' && !!(process.versions && process.versions.node)
  && typeof module === 'object' && typeof require === 'function' && require.main === module;
if (runByNode) main();
