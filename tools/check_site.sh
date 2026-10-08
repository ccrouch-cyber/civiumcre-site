#!/usr/bin/env bash
# tools/check_site.sh — the site's own checks. Run from anywhere: bash tools/check_site.sh
#   1. docs/assets/tokens.css and system.css are byte-for-byte the repo's tokens (Pages serves only docs/).
#   2. Every href and src in the pages, and every href or src site.js sets, resolves to a file under docs/ (and to
#      an id inside a tag, outside comments), or is mailto: or data:. site.js runs on every page, so the paths it
#      sets must be root-relative. No ".." or "." path segments.
#   3. The configuration block opens site.js, line by line: its keys in order, its values single-quoted, nothing
#      after a value but a comment. Its URLs are empty or https on civiumcre.com; its image is a file under docs/.
#   4. No color literal outside site.css's single token block: no hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(),
#      oklch(), color(), color-mix() or device-cmyk() in any page, stylesheet, script or XML (any case); and no named
#      or system color in a site.css value, a <style> element, a style attribute, a presentation attribute or a
#      script string. Images are not scanned.
#   5. Exactly one <h1> per page.
#   6. No host other than civiumcre.com in any text file under docs/ (the SVG and sitemap namespace names excepted),
#      and no protocol-relative URL.
#   7. The door's post: exactly one fetch( call in site.js names PROSPECT_DOOR_URL; it carries credentials: 'omit'
#      and no other credentials, and no headers key; and site.js names no XMLHttpRequest, setRequestHeader,
#      onprogress or upload.addEventListener anywhere.
#   8. site.js makes exactly one fetch( call in all; PROSPECT_DOOR_URL has no trailing slash.
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
  grep -q -E "(href|src)='" "$page" && bad "$(rel "$page"): a single-quoted href or src (write them double-quoted)"
done < <(pages)
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
[ "$fail" -eq "$fail_before" ] && ok "$links href/src values resolve under docs/ (pages and site.js; files, #ids, mailto:, data:)"

# 3. The configuration block: the first nine lines, key by key; after a value, only a comment.
end='[[:space:]]*(//.*)?$'
n=0; cfg_ok=1
while IFS= read -r pattern; do
  n=$((n + 1))
  sed -n "${n}p" "$JS" | grep -q -E "$pattern" || { bad "site.js line $n is not the configuration block's /$pattern/"; cfg_ok=0; }
done <<BLOCK
^const CONFIG = \{\$
^  CTA_LABEL: '[^']+',$end
^  SIGN_IN_URL: '[^']*',$end
^  SIGN_IN_LABEL: '[^']+',$end
^  PROSPECT_DOOR_URL: '[^']*',$end
^  TRIAL_ON: (true|false),$end
^  PREVIEW_DAYS: [0-9]+, TRIAL_DAYS: [0-9]+,$end
^  HERO_IMAGE: '[^']*'$end
^\};\$
BLOCK
[ "$cfg_ok" -eq 1 ] && ok "site.js opens with the configuration block, its keys in order, values single-quoted"
config_value() { sed -n "${1}p" "$JS" | sed -E "s/^[^']*'([^']*)'.*/\1/"; }   # $1 the block's line number
if [ "$cfg_ok" -eq 1 ]; then
  for pair in 3:SIGN_IN_URL 5:PROSPECT_DOOR_URL; do
    key="${pair#*:}"; val="$(config_value "${pair%%:*}")"
    if [ -z "$val" ] && [ "$key" = SIGN_IN_URL ]; then ok "SIGN_IN_URL is empty (the sign-in link is not rendered)"
    elif [ -z "$val" ]; then ok "PROSPECT_DOOR_URL is empty (Try it free is a mailto: link; the modal is not offered)"
    elif printf '%s' "$val" | grep -q -E '^https://([a-z0-9-]+\.)*civiumcre\.com(/|$)'; then ok "$key is $val"
    else bad "$key must be empty or https on civiumcre.com, not $val"; fi
  done
  hero="$(config_value 8)"
  if [ -z "$hero" ]; then ok "HERO_IMAGE is empty (the dark fill shows)"
  elif [ "${hero#/}" != "$hero" ] && [ "${hero#//}" = "$hero" ] && [ -n "$(resolve "$DOCS/index.html" "$hero")" ]; then
    ok "HERO_IMAGE resolves: $hero"
  else bad "HERO_IMAGE must be a path from / to a file under docs/: $hero"; fi
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

# 6. Hosts (text files only; images are skipped).
hosts="$(grep -r -I -i -n -o -E 'https?://[^"'"'"'` )<>]+' "$DOCS" \
  | grep -v -i -E ':https?://(www\.w3\.org/2000/svg|www\.sitemaps\.org/schemas/sitemap/0\.9)$' \
  | grep -v -i -E ':https://([a-z0-9-]+\.)*civiumcre\.com(/[^ ]*)?$' | sed "s|^$ROOT/||")"
relhosts="$(grep -r -I -n -E "([\"'\`(=]|url\([[:space:]]*|^|[[:space:]])//[A-Za-z0-9]" "$DOCS" | sed "s|^$ROOT/||")"
if [ -z "$hosts$relhosts" ]; then ok "no host other than civiumcre.com under docs/, no protocol-relative URL"
else bad "outside hosts or protocol-relative URLs:"; printf '%s\n' "$hosts" "$relhosts" | grep -v '^$'; fi

# 7. The door's post. A header set by hand, or an upload-progress listener, makes the browser preflight the post, and
#    the door answers a preflight with a 405; credentials: 'include' hides the door's 202. A call is read from fetch(
#    to its closing parenthesis, with // comments removed.
fetch_calls() {  # stdout: each fetch( call in site.js, on one line
  sed -E 's#(^|[[:space:]])//.*$#\1#' "$JS" | awk '
    { src = src " " $0 }
    END {
      while (match(src, /[^A-Za-z0-9_$]fetch[ \t]*\(/)) {
        k = RSTART + RLENGTH - 1; depth = 0; call = ""
        for (; k <= length(src); k++) {
          c = substr(src, k, 1); call = call c
          if (c == "(") depth++
          else if (c == ")") { depth--; if (depth == 0) break }
        }
        print "fetch" call
        src = substr(src, RSTART + RLENGTH)
      }
    }'
}
fail_before=$fail
door="$(fetch_calls | grep -F 'PROSPECT_DOOR_URL')"
n="$(printf '%s' "$door" | awk 'END { print NR }')"
if [ "$n" -ne 1 ]; then bad "site.js: $n fetch( calls name PROSPECT_DOOR_URL (exactly one posts to the door)"
else
  omit="$(printf '%s\n' "$door" | grep -c -E "credentials[[:space:]]*:[[:space:]]*['\"]omit['\"]")"
  other="$(printf '%s\n' "$door" | sed -E "s/credentials[[:space:]]*:[[:space:]]*['\"]omit['\"]//g" | grep -c -w credentials)"
  [ "$omit" = 1 ] && [ "$other" = 0 ] \
    || bad "site.js: the door's fetch( call must carry credentials: 'omit' and no other credentials (credentials: 'include' hides the door's 202)"
  printf '%s\n' "$door" | grep -q -w headers \
    && bad "site.js: the door's fetch( call has a headers key (a header set by hand preflights into the door's 405)"
fi
traps="$(grep -n -E 'XMLHttpRequest|setRequestHeader|onprogress|upload\.addEventListener' "$JS")"
if [ -n "$traps" ]; then
  bad "site.js names XMLHttpRequest, setRequestHeader, onprogress or upload.addEventListener (the door's post is one fetch; a header set by hand or an upload-progress listener preflights into the door's 405):"
  printf '%s\n' "$traps"
fi
[ "$fail" -eq "$fail_before" ] && ok "site.js posts to the door in one fetch( call: credentials 'omit', no headers key, nothing that preflights"

# 8. Two more guards on the door's post: site.js makes exactly one fetch( call in all (a second one could reach the door
#    through a variable the check cannot see), and PROSPECT_DOOR_URL never ends in "/" (the door answers a trailing slash
#    with a 307, which a cross-origin post cannot follow into a 202).
fail_before=$fail
all_fetches="$(fetch_calls | awk 'END { print NR }')"
[ "$all_fetches" -eq 1 ] || bad "site.js makes $all_fetches fetch( calls in all (exactly one, the door's)"
door_url="$(sed -n '5p' "$JS" | sed -E "s/^[^']*'([^']*)'.*/\1/")"
case "$door_url" in */) bad "PROSPECT_DOOR_URL ends in a slash: $door_url (the door answers a trailing slash with a 307)" ;; esac
[ "$fail" -eq "$fail_before" ] && ok "site.js makes one fetch( call in all; PROSPECT_DOOR_URL has no trailing slash"

if [ "$fail" -eq 0 ]; then echo "check_site: green"; else echo "check_site: RED"; fi
exit $(( fail > 0 ))
