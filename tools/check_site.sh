#!/usr/bin/env bash
# tools/check_site.sh — the site's own checks. Run from anywhere: bash tools/check_site.sh
#   1. docs/assets/tokens.css and system.css are byte-for-byte the repo's tokens (Pages serves only docs/).
#   2. Every href and src in the pages, every href or src site.js sets, and every href, src or srcset written inside
#      site.js's templates resolves to a file under docs/ (and to an id inside a tag, outside comments), or is mailto:
#      or data:. So does every address in a page's srcset and every url() in the site's stylesheets. site.js runs on
#      every page, so the paths it sets must be root-relative. No ".." or "." path segments.
#   3. The configuration block opens site.js, line by line: its keys in order, its values single-quoted, nothing
#      after a value but a comment. The four doors into the app (demo, free, trial, Civium) are https on
#      app.civiumcre.com, and each Start address names its own plan; SIGN_IN_URL is the same host or empty;
#      APP_ORIGIN is exactly https://app.civiumcre.com; PRICING_URL is a path to a page under docs/; TALK_MAIL is a
#      mailto: address; SCHEDULER_URL is empty or one https address.
#   4. No color literal outside site.css's single token block: no hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(),
#      oklch(), color(), color-mix() or device-cmyk() in any page, stylesheet, script or XML (any case); and no named
#      or system color in a site.css value, a <style> element, a style attribute, a presentation attribute or a
#      script string. Images are not scanned.
#   5. Exactly one <h1> per page.
#   6. No host other than civiumcre.com in any text file under docs/ (the SVG and sitemap namespace names excepted),
#      and no protocol-relative URL. One exception: the scheduler's address, on SCHEDULER_URL's own line of site.js.
#   7. The buttons. Every [data-cta] is a link to /start/. Pricing has one Start free, one Start the trial and one
#      Start Civium (data-go), Book a call and the team line (data-book custom, team), and the billing toggle with
#      Monthly pressed. Every [data-book] link carries TALK_MAIL, the same address the configuration holds.
#   8. The Get started window is built once: site.js makes one <dialog>, no page holds the window's markup, and only
#      docs/start/index.html is the window's own page ([data-gs-page]).
#   9. Frames. No page and no template in site.js holds a frame, an object or an embed. site.js makes at most one
#      frame, and its address is CONFIG.SCHEDULER_URL.
#  10. site.js asks the network for nothing and listens to nobody: no fetch(, XMLHttpRequest, sendBeacon, WebSocket,
#      EventSource, import( or form submit, and no message listener. Its one postMessage tells CONFIG.APP_ORIGIN, and
#      only that origin, that the framed window closed. (What it loads are the site's own pictures, rule 2, and the
#      one frame, rule 9.)
#  11. The visit script (docs/assets/visits.js) is on every page, after site.js, and keeps its promises: it posts to
#      one address (COLLECT_URL, exactly https://app.civiumcre.com/api/site/collect) with one fetch( that omits
#      credentials, and reaches the network no other way; it sets and reads no cookie; it reads nothing a person types
#      (no .value, no key or input listener, no form, no clipboard); and no other script on the site reaches the network.
# Exits 1 on any failure. Uses bash 3.2, grep, sed, awk and cmp only.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS="$ROOT/docs"
JS="$DOCS/assets/site.js"
CSS="$DOCS/assets/site.css"
fail=0
bad() { printf 'FAIL  %s\n' "$*"; fail=$((fail + 1)); }
ok() { printf 'ok    %s\n' "$*"; }
rel() { printf '%s' "${1#$ROOT/}"; }
pages() { find "$DOCS" -name '*.html' | sort; }

# 1. The token copies.
check_copy() {
  if cmp -s "$1" "$2"; then ok "$(rel "$1") is byte-for-byte $(rel "$2")"; else bad "$(rel "$1") differs from $(rel "$2")"; fi
}
check_copy "$DOCS/assets/tokens.css" "$ROOT/design-system/tokens.css"
check_copy "$DOCS/assets/system.css" "$ROOT/.claude/skills/civium-design/tokens/system.css"

# 2. Links and sources.
resolve() {  # $1 the page a relative URL is read from, $2 the URL; prints the target file under docs/, or nothing
  local path="${2%%#*}" target
  path="${path%%\?*}"
  case "/$path/" in */../*|*/./*) return ;; esac
  if [ -z "$path" ]; then target="$1"
  elif [ "${path#/}" != "$path" ]; then target="$DOCS$path"
  else target="$(dirname "$1")/$path"; fi
  [ -d "$target" ] && target="${target%/}/index.html"
  [ -f "$target" ] && printf '%s' "$target"
}
strip_html_comments() {  # the file with <!-- … --> removed, across lines; line numbers kept
  awk '{ s = $0; out = ""
         while (length(s)) {
           if (inc) { i = index(s, "-->"); if (i) { s = substr(s, i + 3); inc = 0 } else s = "" }
           else { i = index(s, "<!--"); if (i) { out = out substr(s, 1, i - 1); s = substr(s, i + 4); inc = 1 } else { out = out s; s = "" } }
         }
         print out }' "$1"
}
links=0
check_url() {  # $1 where it appears, $2 the URL, $3 the page a relative URL is read from
  links=$((links + 1))
  case "$2" in
    mailto:?*|data:*) return ;;
    http:*|https:*|HTTP:*|HTTPS:*|//*) bad "$(rel "$1"): outbound link $2"; return ;;
  esac
  local target frag
  target="$(resolve "$3" "$2")"
  if [ -z "$target" ]; then bad "$(rel "$1"): $2 does not resolve to a file under docs/"; return; fi
  case "$2" in
    *#*) frag="${2#*#}"
         strip_html_comments "$target" | grep -q -E "<[^>]*[[:space:]]id=\"$frag\"" \
           || bad "$(rel "$1"): $2 — no tag with id=\"$frag\" in $(rel "$target")" ;;
  esac
}
fail_before=$fail
while IFS= read -r page; do
  while IFS= read -r url; do check_url "$page" "$url" "$page"; done \
    < <(grep -o -E '(href|src)="[^"]*"' "$page" | sed -E 's/^(href|src)="(.*)"$/\2/')
  while IFS= read -r url; do [ -n "$url" ] && check_url "$page" "$url" "$page"; done \
    < <(grep -o -E 'srcset="[^"]*"' "$page" | sed -E 's/^srcset="(.*)"$/\1/' | tr ',' '\n' | awk '{ print $1 }')
  grep -q -E "(href|src|srcset)='" "$page" && bad "$(rel "$page"): a single-quoted href, src or srcset (write them double-quoted)"
done < <(pages)
# The templates inside site.js: the same attributes, written as markup. Each must be a path from /.
while IFS= read -r url; do
  case "$url" in
    '') ;;
    *'${'*) bad "site.js writes an href, src or srcset that cannot be checked: $url" ;;
    /*) check_url "$JS" "$url" "$DOCS/index.html" ;;
    *) bad "site.js writes a relative or outbound href, src or srcset in a template: $url" ;;
  esac
done < <({ grep -o -E '(href|src)="[^"]*"' "$JS" | sed -E 's/^(href|src)="(.*)"$/\2/'
           grep -o -E 'srcset="[^"]*"' "$JS" | sed -E 's/^srcset="(.*)"$/\1/' | tr ',' '\n' | awk '{ print $1 }'; })
# The stylesheets: every url() is a file beside them.
while IFS= read -r sheet; do
  case "$sheet" in "$DOCS/assets/tokens.css"|"$DOCS/assets/system.css") continue ;; esac
  while IFS= read -r url; do
    links=$((links + 1))
    case "$url" in data:*) continue ;; esac
    [ -n "$(resolve "$sheet" "$url")" ] || bad "$(rel "$sheet"): url($url) does not resolve to a file under docs/"
  done < <(grep -o -E 'url\([^)]*\)' "$sheet" | sed -E "s/^url\([[:space:]]*[\"']?//; s/[\"']?[[:space:]]*\)\$//")
done < <(find "$DOCS" -name '*.css' | sort)
q="(\"[^\"]*\"|'[^']*'|\`[^\`]*\`)"
while IFS= read -r lit; do
  url="${lit:1:${#lit}-2}"
  case "$url" in
    mailto:?*|data:*) links=$((links + 1)) ;;
    *'${'*) bad "site.js sets an href or src that cannot be checked: $lit" ;;
    /*) check_url "$JS" "$url" "$DOCS/index.html" ;;
    *) bad "site.js sets a relative or outbound href or src: $url (site.js runs on every page; use a path from /)" ;;
  esac
done < <(grep -o -E "\.(href|src)[[:space:]]*=[[:space:]]*$q|setAttribute\([[:space:]]*['\"](href|src)['\"][[:space:]]*,[[:space:]]*$q" "$JS" \
         | grep -o -E "$q\$")
[ "$fail" -eq "$fail_before" ] && ok "$links href, src, srcset and url() values resolve under docs/ (pages, site.js and the stylesheets; files, #ids, mailto:, data:)"

# 3. The configuration block: the first thirteen lines, key by key; after a value, only a comment.
end='[[:space:]]*(//.*)?$'
n=0; cfg_ok=1
while IFS= read -r pattern; do
  n=$((n + 1))
  sed -n "${n}p" "$JS" | grep -q -E "$pattern" || { bad "site.js line $n is not the configuration block's /$pattern/"; cfg_ok=0; }
done <<BLOCK
^const CONFIG = \{\$
^  CTA_LABEL: '[^']+',$end
^  DEMO_URL: '[^']*',$end
^  FREE_URL: '[^']*',$end
^  TRIAL_URL: '[^']*',$end
^  CIVIUM_URL: '[^']*',$end
^  SIGN_IN_URL: '[^']*',$end
^  SIGN_IN_LABEL: '[^']+',$end
^  PRICING_URL: '[^']*',$end
^  APP_ORIGIN: '[^']*',$end
^  SCHEDULER_URL: '[^']*',$end
^  TALK_MAIL: '[^']*'$end
^\};\$
BLOCK
[ "$cfg_ok" -eq 1 ] && ok "site.js opens with the configuration block, its keys in order, values single-quoted"
config_value() { sed -n "${1}p" "$JS" | sed -E "s/^[^']*'([^']*)'.*/\1/"; }   # $1 the block's line number
sched=""; talk=""
if [ "$cfg_ok" -eq 1 ]; then
  app='^https://app\.civiumcre\.com'
  val="$(config_value 3)"
  if printf '%s' "$val" | grep -q -E "$app/[^[:space:]]*\$"; then ok "DEMO_URL is $val"
  else bad "DEMO_URL must be https on app.civiumcre.com, not '$val'"; fi
  for trio in 4:FREE_URL:free 5:TRIAL_URL:trial 6:CIVIUM_URL:civium; do
    line="${trio%%:*}"; rest="${trio#*:}"; key="${rest%%:*}"; plan="${rest#*:}"; val="$(config_value "$line")"
    if printf '%s' "$val" | grep -q -E "$app/[^[:space:]]*[?&]plan=$plan\$"; then ok "$key is $val"
    else bad "$key must be https on app.civiumcre.com and end in plan=$plan, not '$val'"; fi
  done
  val="$(config_value 7)"
  if [ -z "$val" ]; then ok "SIGN_IN_URL is empty (the sign-in links are not rendered)"
  elif printf '%s' "$val" | grep -q -E "$app(/[^[:space:]]*)?\$"; then ok "SIGN_IN_URL is $val"
  else bad "SIGN_IN_URL must be empty or https on app.civiumcre.com, not '$val'"; fi
  val="$(config_value 9)"
  if [ "${val#/}" != "$val" ] && [ "${val#//}" = "$val" ] && [ -n "$(resolve "$DOCS/index.html" "$val")" ]; then ok "PRICING_URL resolves: $val"
  else bad "PRICING_URL must be a path from / to a page under docs/, not '$val'"; fi
  val="$(config_value 10)"
  if [ "$val" = "https://app.civiumcre.com" ]; then ok "APP_ORIGIN is $val"
  else bad "APP_ORIGIN must be exactly https://app.civiumcre.com (an origin: no path, no slash), not '$val'"; fi
  sched="$(config_value 11)"
  if [ -z "$sched" ]; then ok "SCHEDULER_URL is empty (the booking buttons write to TALK_MAIL)"
  elif printf '%s' "$sched" | grep -q -E '^https://[a-z0-9]([a-z0-9.-]*[a-z0-9])?(/[^[:space:]@\\]*)?$'; then ok "SCHEDULER_URL is $sched (the one outside host the site names)"
  else bad "SCHEDULER_URL must be empty or one https address (lower-case host, no user, no port), not '$sched'"; fi
  talk="$(config_value 12)"
  if printf '%s' "$talk" | grep -q -E '^mailto:[^@[:space:]?]+@[^@[:space:]?]+\.[a-z]+$'; then ok "TALK_MAIL is $talk"
  else bad "TALK_MAIL must be a mailto: address, not '$talk'"; fi
fi

# 4. Color literals.
literal='#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|device-cmyk)[[:space:]]*\('
named='aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|canvas|canvastext|linktext|visitedtext|activetext|buttonface|buttontext|buttonborder|field|fieldtext|highlight|highlighttext|selecteditem|selecteditemtext|mark|marktext|graytext|accentcolor|accentcolortext'
begins="$(grep -c 'tokens:begin' "$CSS")"; ends="$(grep -c 'tokens:end' "$CSS")"
if [ "$begins" = 1 ] && [ "$ends" = 1 ]; then ok "site.css has one token block"
else bad "site.css must have exactly one tokens:begin and one tokens:end ($begins and $ends)"; begins=0; fi
css_text() {  # site.css with the token block blanked (only when there is exactly one), line numbers kept
  if [ "$begins" = 1 ]; then awk '/tokens:begin/{skip=1} { print (skip ? "" : $0) } /tokens:end/{skip=0}' "$CSS"; else cat "$CSS"; fi
}
declarations() {  # stdin: CSS; stdout: LINE<tab>value for each declaration, with comments, selectors and property names gone
  awk '{ s = $0; out = ""
         while (length(s)) {
           if (inc) { i = index(s, "*/"); if (i) { s = substr(s, i + 2); inc = 0 } else s = "" }
           else { i = index(s, "/*"); if (i) { out = out substr(s, 1, i - 1); s = substr(s, i + 2); inc = 1 } else { out = out s; s = "" } }
         }
         for (k = 1; k <= length(out); k++) {
           c = substr(out, k, 1)
           if (c == "{") buf = ""
           else if (c == ";" || c == "}") { if (buf ~ /[^ \t]/) print NR "\t" buf; buf = "" }
           else buf = buf c
         }
         buf = buf " " }' \
  | sed -E 's/var\(--[A-Za-z0-9_-]+\)//g; s/	[[:space:]]*[-A-Za-z]+[[:space:]]*:/	/; s/[-A-Za-z]+\(/(/g'
}
hits=""
add_hits() { [ -n "$1" ] && hits="$hits$1"$'\n'; }
while IFS= read -r f; do
  case "$f" in "$DOCS/assets/tokens.css"|"$DOCS/assets/system.css") continue ;; esac
  if [ "$f" = "$CSS" ]; then add_hits "$(css_text | grep -n -i -E "$literal" | sed "s|^|$(rel "$f"):|")"
  else add_hits "$(grep -n -i -E "$literal" "$f" | sed "s|^|$(rel "$f"):|")"; fi
done < <(find "$DOCS" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.xml' \) | sort)
# Named and system colors: site.css values, then each page's <style> elements, style attributes and presentation
# attributes, then the strings in site.js.
while IFS="$(printf '\t')" read -r ln val; do
  add_hits "$(rel "$CSS"):$ln: $(sed -n "${ln}p" "$CSS")"
done < <(css_text | declarations | grep -i -w -E "$named")
while IFS= read -r page; do
  while IFS="$(printf '\t')" read -r ln val; do
    add_hits "$(rel "$page"):$ln: $(sed -n "${ln}p" "$page")"
  done < <(awk '/<style/{on=1} { print (on ? $0 : "") } /<\/style>/{on=0}' "$page" | sed -E 's/<\/?style[^>]*>/{/g' | declarations \
           | grep -i -w -E "$named")
  add_hits "$(grep -n -o -i -E "[[:space:]]style=(\"[^\"]*\"|'[^']*')" "$page" \
    | sed -E 's/var\(--[A-Za-z0-9_-]+\)//g; s/[-A-Za-z]+[[:space:]]*:/ /g; s/[-A-Za-z]+\(/(/g' | grep -i -w -E "$named" | sed "s|^|$(rel "$page"):|")"
  add_hits "$(grep -n -o -i -E "[[:space:]](fill|stroke|color|bgcolor|stop-color|flood-color|lighting-color)=(\"[^\"]*\"|'[^']*')" "$page" \
    | grep -i -w -E "$named" | sed "s|^|$(rel "$page"):|")"
done < <(pages)
add_hits "$(sed -E 's#(^|[[:space:]])//.*$#\1#' "$JS" | grep -n -o -E "$q" | sed -E 's/[-A-Za-z]+\(/(/g' | grep -i -w -E "$named" | sed "s|^|$(rel "$JS"):|")"
if [ -z "$hits" ]; then ok "no color literal outside site.css's token block"; else bad "color literals outside the token block:"; printf '%s' "$hits"; fi

# 5. One h1 per page.
while IFS= read -r page; do
  n="$(grep -o -i -E '<h1[ >]' "$page" | wc -l | tr -d ' ')"
  if [ "$n" = 1 ]; then ok "$(rel "$page"): one h1"; else bad "$(rel "$page"): $n h1 elements"; fi
done < <(pages)

# 6. Hosts (text files only; images are skipped). The scheduler's address is let through on its own line of site.js,
#    whole and exactly as the configuration holds it, and nowhere else.
hosts="$(grep -r -I -i -n -o -E 'https?://[^"'"'"'` )<>]+' "$DOCS" \
  | grep -v -i -E ':https?://(www\.w3\.org/2000/svg|www\.sitemaps\.org/schemas/sitemap/0\.9)$' \
  | grep -v -i -E ':https://([a-z0-9-]+\.)*civiumcre\.com(/[^ ]*)?$' \
  | { if [ -n "$sched" ]; then grep -v -F -x "$JS:11:$sched"; else cat; fi; } | sed "s|^$ROOT/||")"
relhosts="$(grep -r -I -n -E "([\"'\`(=]|url\([[:space:]]*|^|[[:space:]])//[A-Za-z0-9]" "$DOCS" | sed "s|^$ROOT/||")"
if [ -z "$hosts$relhosts" ]; then ok "no host other than civiumcre.com under docs/${sched:+ (but the configured scheduler, on its line)}, no protocol-relative URL"
else bad "outside hosts or protocol-relative URLs:"; printf '%s\n' "$hosts" "$relhosts" | grep -v '^$'; fi

# 7. The buttons. Tags are read one per line: each <a ...> or <button ...> opening tag, comments removed.
tags() { strip_html_comments "$1" | grep -o -E '<(a|button)[[:space:]][^>]*>'; }   # $1 a page
fail_before=$fail
PRICING="$DOCS/pricing/index.html"
while IFS= read -r page; do
  while IFS= read -r tag; do
    case "$tag" in
      *'data-cta'*) case "$tag" in '<a '*'href="/start/"'*) ;; *) bad "$(rel "$page"): a [data-cta] that is not a link to /start/: $tag" ;; esac ;;
    esac
    case "$tag" in
      *'data-book="'*) case "$tag" in '<a '*"href=\"$talk\""*) ;; *) bad "$(rel "$page"): a [data-book] link without href=\"$talk\" (TALK_MAIL): $tag" ;; esac ;;
    esac
  done < <(tags "$page")
done < <(pages)
for want in 'data-go="free"' 'data-go="trial"' 'data-go="civium"' 'data-book="custom"' 'data-book="team"' \
            'data-billing="monthly" aria-pressed="true"' 'data-billing="yearly" aria-pressed="false"'; do
  n="$(tags "$PRICING" | grep -c -F "$want")"
  [ "$n" = 1 ] || bad "pricing: $n tags carry $want (exactly one)"
done
for key in DEMO_URL FREE_URL TRIAL_URL CIVIUM_URL SIGN_IN_URL PRICING_URL TALK_MAIL; do
  grep -q "CONFIG\.$key" "$JS" || bad "site.js never reads CONFIG.$key"
done
[ "$fail" -eq "$fail_before" ] && ok "the buttons: every [data-cta] links to /start/, Pricing has its three Start buttons, two booking links and the toggle, every [data-book] carries TALK_MAIL"

# 8. The window is built once.
fail_before=$fail
code="$(sed -E 's#(^|[[:space:]])//.*$#\1#' "$JS")"   # site.js without its // comments
n="$(printf '%s\n' "$code" | grep -c -E "createElement\([[:space:]]*['\"]dialog['\"]")"
[ "$n" = 1 ] || bad "site.js makes $n <dialog> elements (exactly one: the Get started window)"
copies="$(grep -n -E '<dialog|class="[^"]*gs-(card|side|main|panel|choose|book|row|btn|close|foot)' $(pages) | sed "s|^$ROOT/||")"
[ -z "$copies" ] || { bad "a page holds the Get started window's markup (site.js builds it; pages only link to /start/):"; printf '%s\n' "$copies"; }
own="$(grep -l 'data-gs-page' $(pages) | sed "s|^$ROOT/||" | tr '\n' ' ')"
[ "$own" = "docs/start/index.html " ] || bad "[data-gs-page] must be on docs/start/index.html alone, not: ${own:-no page}"
[ "$fail" -eq "$fail_before" ] && ok "the Get started window is built once, by site.js; /start/ is its own page"

# 9. Frames.
fail_before=$fail
framed="$(grep -r -I -i -n -E '<(iframe|frame|object|embed)[[:space:]>]' "$DOCS" | sed "s|^$ROOT/||")"
[ -z "$framed" ] || { bad "a frame, object or embed written as markup:"; printf '%s\n' "$framed"; }
n="$(printf '%s\n' "$code" | grep -c -E "createElement\([[:space:]]*['\"](iframe|frame|object|embed)['\"]")"
m="$(printf '%s\n' "$code" | grep -c -E '\.src[[:space:]]*=[[:space:]]*CONFIG\.SCHEDULER_URL[[:space:]]*;')"
if [ "$n" = 0 ] && [ "$m" = 0 ]; then :
elif [ "$n" = 1 ] && [ "$m" = 1 ]; then :
else bad "site.js makes $n frames and sets $m of them to CONFIG.SCHEDULER_URL (at most one frame, and that address)"; fi
[ "$fail" -eq "$fail_before" ] && ok "frames: none written as markup; site.js makes $n, for CONFIG.SCHEDULER_URL"

# 10. No network call, no listener, one postMessage.
fail_before=$fail
net="$(printf '%s\n' "$code" | grep -n -E "(^|[^A-Za-z0-9_\$.])(fetch|import|importScripts)[[:space:]]*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|RTCPeerConnection|serviceWorker|\.submit[[:space:]]*\(|['\"]message['\"]|onmessage")"
[ -z "$net" ] || { bad "site.js reaches for the network or listens for messages:"; printf '%s\n' "$net"; }
n="$(printf '%s\n' "$code" | grep -c 'postMessage')"
m="$(printf '%s\n' "$code" | grep -c -F "window.parent.postMessage({ civium: 'gs-close' }, CONFIG.APP_ORIGIN)")"
{ [ "$n" = 1 ] && [ "$m" = 1 ]; } || bad "site.js names postMessage on $n lines, $m of them the close told to CONFIG.APP_ORIGIN (exactly one, never '*')"
[ "$fail" -eq "$fail_before" ] && ok "site.js asks the network for nothing; its one postMessage tells CONFIG.APP_ORIGIN the framed window closed"

# 11. The visit script.
fail_before=$fail
VJS="$DOCS/assets/visits.js"
if [ ! -f "$VJS" ]; then bad "docs/assets/visits.js is missing"
else
  vcode="$(sed -E 's#(^|[[:space:]])//.*$#\1#' "$VJS")"   # visits.js without its // comments
  while IFS= read -r page; do
    n="$(strip_html_comments "$page" | grep -c -F '<script src="/assets/visits.js"></script>')"
    after="$(strip_html_comments "$page" | grep -n -F -e '<script src="/assets/site.js"></script>' -e '<script src="/assets/visits.js"></script>' | sed -E 's/^[0-9]+:<script src="\/assets\/([a-z]+)\.js"><\/script>$/\1/' | tr '\n' ' ')"
    [ "$n" = 1 ] || bad "$(rel "$page") loads visits.js $n times (exactly once)"
    [ "$after" = "site visits " ] || bad "$(rel "$page") does not load site.js and then visits.js"
  done < <(pages)
  n="$(printf '%s\n' "$vcode" | grep -c -E "fetch[[:space:]]*\(")"     # every fetch(, whatever stands before it
  m="$(printf '%s\n' "$vcode" | grep -c -F "fetch(COLLECT_URL, { method: 'POST', body, keepalive: true, credentials: 'omit', mode: 'no-cors',")"
  { [ "$n" = 1 ] && [ "$m" = 1 ]; } || bad "visits.js calls fetch( on $n lines, $m of them the one post to COLLECT_URL without credentials (exactly one)"
  [ "$(grep -c -x "  const COLLECT_URL = 'https://app.civiumcre.com/api/site/collect';" "$VJS")" = 1 ] \
    || bad "visits.js's COLLECT_URL is not exactly https://app.civiumcre.com/api/site/collect"
  [ "$(printf '%s\n' "$vcode" | grep -c 'COLLECT_URL')" = 2 ] || bad "visits.js names COLLECT_URL other than where it is set and where it is posted to"
  vnet="$(printf '%s\n' "$vcode" | grep -n -E "(^|[^A-Za-z0-9_\$.])(import|importScripts)[[:space:]]*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|RTCPeerConnection|serviceWorker|\.submit[[:space:]]*\(|postMessage|['\"]message['\"]|onmessage|new Image|\.src[[:space:]]*=|setAttribute[[:space:]]*\(|createElement|insertAdjacent|document\.write|\.action[[:space:]]*=|window\.open|location\.(assign|replace)[[:space:]]*\(|location(\.href)?[[:space:]]*=[^=]")"
  [ -z "$vnet" ] || { bad "visits.js reaches the network another way:"; printf '%s\n' "$vnet"; }
  # the one address the script sets: the app's sign-up link, given this visit's id in its hash
  n="$(printf '%s\n' "$vcode" | grep -c -E "\.href[[:space:]]*=[^=]")"
  m="$(printf '%s\n' "$vcode" | grep -c -F "if (u.origin === APP_ORIGIN && u.pathname === '/signup' && !u.hash) { u.hash = 'sv=' + session; a.href = u.toString(); }")"
  { [ "$n" = 1 ] && [ "$m" = 1 ]; } || bad "visits.js sets an href on $n lines, $m of them the sign-up link's visit id (exactly one)"
  vread="$(printf '%s\n' "$vcode" | grep -n -i -E "cookie|\.value|['\"](keydown|keyup|keypress|input|change|beforeinput|paste|copy|cut|submit)['\"]|clipboard|FormData|innerHTML|outerHTML|innerText|getSelection|eval[[:space:]]*\(|new Function")"
  [ -z "$vread" ] || { bad "visits.js reads what it promised not to:"; printf '%s\n' "$vread"; }
fi
others="$(find "$DOCS" -name '*.js' ! -name 'visits.js' -print0 | xargs -0 grep -n -E "fetch[[:space:]]*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource" | sed "s|^$ROOT/||")"
[ -z "$others" ] || { bad "a script other than visits.js reaches the network:"; printf '%s\n' "$others"; }
# every script a page runs is a file under docs/assets/ that these rules read: no page holds a script of its own
inline="$(while IFS= read -r page; do strip_html_comments "$page" | grep -n -i -E "<script" | grep -v -E '<script src="/assets/[a-z]+\.js"></script>' | sed "s|^|$(rel "$page"):|"; done < <(pages))"
[ -z "$inline" ] || { bad "a page holds a script of its own (every script is a file under docs/assets/):"; printf '%s\n' "$inline"; }
[ "$fail" -eq "$fail_before" ] && ok "visits.js: on every page after site.js; one post to COLLECT_URL without credentials; no cookie, nothing typed read"

if [ "$fail" -eq 0 ]; then echo "check_site: green"; else echo "check_site: RED"; fi
exit $(( fail > 0 ))
