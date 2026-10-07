#!/usr/bin/env bash
# tools/check_site.sh — the site's own checks. Run from anywhere: bash tools/check_site.sh
#   1. docs/assets/tokens.css and system.css are byte-for-byte the repo's tokens (Pages serves only docs/).
#   2. Every href and src under docs/ resolves to a file (and its #id), or is mailto: or data:.
#   3. The configuration block opens site.js; its URLs are empty or https on civiumcre.com; its image is a file.
#   4. No hex, rgb or hsl color literal under docs/ outside the token block in site.css.
#   5. Exactly one <h1> per page.
#   6. No host other than civiumcre.com anywhere under docs/ (the SVG and sitemap namespace names excepted).
# Exits 1 on any failure. Uses bash 3.2, grep, sed, awk and cmp only.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS="$ROOT/docs"
JS="$DOCS/assets/site.js"
fail=0
bad() { printf 'FAIL  %s\n' "$*"; fail=1; }
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
while IFS= read -r page; do
  while IFS= read -r url; do
    links=$((links + 1))
    case "$url" in
      mailto:?*|data:*) continue ;;
      http:*|https:*|//*) bad "$(rel "$page"): outbound link $url"; continue ;;
    esac
    target="$(resolve "$page" "$url")"
    if [ -z "$target" ]; then bad "$(rel "$page"): $url does not resolve to a file"; continue; fi
    case "$url" in
      *#*) frag="${url#*#}"
           grep -q "id=\"$frag\"" "$target" || bad "$(rel "$page"): $url — no id=\"$frag\" in $(rel "$target")" ;;
    esac
  done < <(grep -o -E '(href|src)="[^"]*"' "$page" | sed -E 's/^(href|src)="(.*)"$/\2/')
done < <(find "$DOCS" -name '*.html' | sort)
[ "$fail" -eq 0 ] && ok "$links href/src values resolve (files, #ids, mailto:, data:)"

# 3. The configuration block.
first="$(grep -v -E '^[[:space:]]*$' "$JS" | head -1)"
if [ "$first" = "const CONFIG = {" ]; then ok "site.js opens with the configuration block"; else bad "site.js does not open with 'const CONFIG = {'"; fi
config_value() { sed -n -E "s/^[[:space:]]*$1:[[:space:]]*'([^']*)'.*/\1/p" "$JS" | head -1; }
for key in SIGN_IN_URL PROSPECT_DOOR_URL; do
  val="$(config_value "$key")"
  if [ -z "$val" ] && [ "$key" = SIGN_IN_URL ]; then ok "SIGN_IN_URL is empty (the Sign in link is not rendered)"
  elif [ -z "$val" ]; then ok "PROSPECT_DOOR_URL is empty (Try it free is a mailto: link; the modal is not offered)"
  elif printf '%s' "$val" | grep -q -E '^https://([a-z0-9-]+\.)*civiumcre\.com(/|$)'; then ok "$key is $val"
  else bad "$key must be empty or https on civiumcre.com, not $val"; fi
done
hero="$(config_value HERO_IMAGE)"
if [ -z "$hero" ]; then ok "HERO_IMAGE is empty (the dark fill shows)"
elif [ -n "$(resolve "$DOCS/index.html" "$hero")" ]; then ok "HERO_IMAGE resolves: $hero"
else bad "HERO_IMAGE does not resolve to a file under docs/: $hero"; fi

# 4. Color literals.
literal='#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\('
hits=""
while IFS= read -r f; do
  case "$f" in "$DOCS/assets/tokens.css"|"$DOCS/assets/system.css") continue ;; esac
  if [ "$f" = "$DOCS/assets/site.css" ]; then
    h="$(awk -v F="$(rel "$f")" '/tokens:begin/{skip=1} !skip{print F":"FNR": "$0} /tokens:end/{skip=0}' "$f" | grep -E "$literal")"
  else
    h="$(grep -n -E "$literal" "$f" | sed "s|^|$(rel "$f"):|")"
  fi
  [ -n "$h" ] && hits="$hits$h"$'\n'
done < <(find "$DOCS" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.xml' -o -name '*.svg' \) | sort)
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
if [ -z "$hosts" ]; then ok "no host other than civiumcre.com under docs/"; else bad "outside hosts:"; printf '%s\n' "$hosts"; fi

if [ "$fail" -eq 0 ]; then echo "check_site: green"; else echo "check_site: RED"; fi
exit "$fail"
