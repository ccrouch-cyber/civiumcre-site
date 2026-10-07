#!/usr/bin/env bash
# tools/check_site.sh — the site's own checks. Run from anywhere: bash tools/check_site.sh
#   1. docs/assets/tokens.css and system.css are byte-for-byte the repo's tokens (Pages serves only docs/).
#   2. Every href and src under docs/, and every href site.js sets, resolves to a file (and its #id),
#      or is mailto: or data:.
#   3. The configuration block opens site.js, key by key; its URLs are empty or https on civiumcre.com; its image
#      is a file under docs/.
#   4. No color literal under docs/ outside the token block in site.css: no hex, rgb(), hsl(), color-mix(), lab(),
#      lch(), oklab(), oklch() or hwb(), and no named color in a site.css value or a style attribute.
#   5. Exactly one <h1> per page.
#   6. No host other than civiumcre.com anywhere under docs/ (the SVG and sitemap namespace names excepted), and no
#      protocol-relative URL.
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

# 1. The token copies.
check_copy() {
  if cmp -s "$1" "$2"; then ok "$(rel "$1") is byte-for-byte $(rel "$2")"; else bad "$(rel "$1") differs from $(rel "$2")"; fi
}
check_copy "$DOCS/assets/tokens.css" "$ROOT/design-system/tokens.css"
check_copy "$DOCS/assets/system.css" "$ROOT/.claude/skills/civium-design/tokens/system.css"

# 2. Links and sources.
resolve() {  # $1 the file the URL appears in, $2 the URL; prints the target file, or nothing
  local path="${2%%#*}" target
  path="${path%%\?*}"
  if [ -z "$path" ]; then target="$1"
  elif [ "${path#/}" != "$path" ]; then target="$DOCS$path"
  else target="$(dirname "$1")/$path"; fi
  [ -d "$target" ] && target="${target%/}/index.html"
  [ -f "$target" ] && printf '%s' "$target"
}
links=0
check_url() {  # $1 where it appears, $2 the URL, $3 the page a relative URL resolves from
  links=$((links + 1))
  case "$2" in
    mailto:?*|data:*) return ;;
    http:*|https:*|//*) bad "$(rel "$1"): outbound link $2"; return ;;
  esac
  local target frag
  target="$(resolve "$3" "$2")"
  if [ -z "$target" ]; then bad "$(rel "$1"): $2 does not resolve to a file"; return; fi
  case "$2" in
    *#*) frag="${2#*#}"
         grep -q "id=\"$frag\"" "$target" || bad "$(rel "$1"): $2 — no id=\"$frag\" in $(rel "$target")" ;;
  esac
}
fail_before=$fail
while IFS= read -r page; do
  while IFS= read -r url; do check_url "$page" "$url" "$page"; done \
    < <(grep -o -E '(href|src)="[^"]*"' "$page" | sed -E 's/^(href|src)="(.*)"$/\2/')
done < <(find "$DOCS" -name '*.html' | sort)
while IFS= read -r url; do check_url "$JS" "$url" "$DOCS/index.html"; done \
  < <(grep -o -E "\.href = '[^']*'" "$JS" | sed -E "s/^\.href = '(.*)'$/\1/")
[ "$fail" -eq "$fail_before" ] && ok "$links href/src values resolve (pages and site.js; files, #ids, mailto:, data:)"

# 3. The configuration block: the first eight lines, key by key.
n=0; cfg_ok=1
while IFS= read -r pattern; do
  n=$((n + 1))
  sed -n "${n}p" "$JS" | grep -q -E "$pattern" || { bad "site.js line $n is not the configuration block's /$pattern/"; cfg_ok=0; }
done <<'BLOCK'
^const CONFIG = \{$
^  CTA_LABEL: '[^']+',
^  SIGN_IN_URL: '[^']*',
^  PROSPECT_DOOR_URL: '[^']*',
^  TRIAL_ON: (true|false),
^  PREVIEW_DAYS: [0-9]+, TRIAL_DAYS: [0-9]+,
^  HERO_IMAGE: '[^']*'
^\};$
BLOCK
[ "$cfg_ok" -eq 1 ] && ok "site.js opens with the configuration block, its keys in order, values single-quoted"
config_value() { sed -n -E "s/^[[:space:]]*$1:[[:space:]]*'([^']*)'.*/\1/p" "$JS" | head -1; }
for key in SIGN_IN_URL PROSPECT_DOOR_URL; do
  grep -q -E "^  $key: '[^']*'," "$JS" || { bad "$key is not a single-quoted string"; continue; }
  val="$(config_value "$key")"
  if [ -z "$val" ] && [ "$key" = SIGN_IN_URL ]; then ok "SIGN_IN_URL is empty (the Sign in link is not rendered)"
  elif [ -z "$val" ]; then ok "PROSPECT_DOOR_URL is empty (Try it free is a mailto: link; the modal is not offered)"
  elif printf '%s' "$val" | grep -q -E '^https://([a-z0-9-]+\.)*civiumcre\.com(/|$)'; then ok "$key is $val"
  else bad "$key must be empty or https on civiumcre.com, not $val"; fi
done
hero="$(config_value HERO_IMAGE)"
if [ -z "$hero" ]; then ok "HERO_IMAGE is empty (the dark fill shows)"
elif [ -n "$(resolve "$DOCS/index.html" "$hero")" ] && [ "${hero#*//}" = "$hero" ]; then ok "HERO_IMAGE resolves: $hero"
else bad "HERO_IMAGE must be a file under docs/: $hero"; fi

# 4. Color literals.
literal='#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|color-mix\(|\boklab\(|\boklch\(|\blab\(|\blch\(|\bhwb\('
named='aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen'
outside_tokens() { awk -v F="$(rel "$1")" '/tokens:begin/{skip=1} !skip{print F":"FNR": "$0} /tokens:end/{skip=0}' "$1"; }
hits=""
while IFS= read -r f; do
  case "$f" in "$DOCS/assets/tokens.css"|"$DOCS/assets/system.css") continue ;; esac
  if [ "$f" = "$CSS" ]; then
    h="$(outside_tokens "$f" | grep -E "$literal")"
  else
    h="$(grep -n -E "$literal" "$f" | sed "s|^|$(rel "$f"):|")"
  fi
  [ -n "$h" ] && hits="$hits$h"$'\n'
done < <(find "$DOCS" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.xml' -o -name '*.svg' \) | sort)
# Named colors: in site.css values (comments, selectors, property names and var(--…) names removed) and in any
# style attribute.
css_values() {
  awk -v F="$(rel "$1")" '/tokens:begin/{skip=1}
    !skip { s = $0; gsub(/\/\*.*\*\//, "", s); gsub(/var\(--[A-Za-z0-9-]+\)/, "", s)
            if (index(s, "{")) sub(/^[^{]*\{/, "", s)
            gsub(/[a-z-]+[ \t]*:/, "", s); print F":"FNR": "s }
    /tokens:end/{skip=0}' "$1"
}
h="$(css_values "$CSS" | grep -i -w -E "$named")"
[ -n "$h" ] && hits="$hits$h"$'\n'
while IFS= read -r page; do
  h="$(grep -n -o -E 'style="[^"]*"' "$page" | grep -i -w -E "$named" | sed "s|^|$(rel "$page"):|")"
  [ -n "$h" ] && hits="$hits$h"$'\n'
done < <(find "$DOCS" -name '*.html' | sort)
if [ -z "$hits" ]; then ok "no color literal outside site.css's token block"; else bad "color literals outside the token block:"; printf '%s' "$hits"; fi

# 5. One h1 per page.
while IFS= read -r page; do
  n="$(grep -o -E '<h1[ >]' "$page" | wc -l | tr -d ' ')"
  if [ "$n" = 1 ]; then ok "$(rel "$page"): one h1"; else bad "$(rel "$page"): $n h1 elements"; fi
done < <(find "$DOCS" -name '*.html' | sort)

# 6. Hosts.
hosts="$(grep -r -n -o -E 'https?://[^"'"'"' )<>]+' "$DOCS" \
  | grep -v -E ':https?://(www\.w3\.org/2000/svg|www\.sitemaps\.org/schemas/sitemap/0\.9)$' \
  | grep -v -E ':https://([a-z0-9-]+\.)*civiumcre\.com(/[^ ]*)?$' | sed "s|^$ROOT/||")"
relhosts="$(grep -r -n -E "[\"'(=]//[A-Za-z0-9]" "$DOCS" | sed "s|^$ROOT/||")"
if [ -z "$hosts$relhosts" ]; then ok "no host other than civiumcre.com under docs/, no protocol-relative URL"
else bad "outside hosts or protocol-relative URLs:"; printf '%s\n' "$hosts" "$relhosts" | grep -v '^$'; fi

if [ "$fail" -eq 0 ]; then echo "check_site: green"; else echo "check_site: RED"; fi
exit $(( fail > 0 ))
