#!/usr/bin/env bash
# Encodes a screen recording, GIF or video into the site's clip format:
#   <dest>.mp4      H.264, silent, short side <= 1080, metadata up front (fast start)
#   <dest>-720.mp4  phone rendition (short side 720), only when the source is larger
#   <dest>.jpg      first-frame poster
#
# Usage:
#   scripts/encode-clip.sh <input> <dest without extension>
#   scripts/encode-clip.sh --small-only <existing clip.mp4>   # add just the phone rendition
#
# Then list it in src/data/projects.ts as
#   { type: "video", src: "<dest>.mp4", small: "<dest>-720.mp4", poster: "<dest>.jpg", ... }
set -euo pipefail

usage() {
  echo "usage: $0 <input> <dest>  |  $0 --small-only <clip.mp4>" >&2
  exit 1
}

if [[ ${1:-} == --small-only ]]; then
  [[ $# -eq 2 ]] || usage
  input=$2
  dest=${input%.mp4}
  full=false
else
  [[ $# -eq 2 ]] || usage
  input=$1
  dest=$2
  full=true
fi

# Scale filter: short side to at most $1 px, never upscaled, even dimensions (yuv420p needs them).
fit() {
  local even="trunc(min($1,%s)/2)*2"
  printf "scale='if(gt(iw,ih),-2,$even)':'if(gt(iw,ih),$even,-2)'" iw ih
}

# encode <out> <short side> <crf>
encode() {
  ffmpeg -hide_banner -loglevel error -y -i "$input" -vf "$(fit "$2")" \
    -c:v libx264 -preset slow -crf "$3" -profile:v high -pix_fmt yuv420p \
    -an -movflags +faststart "$1"
}

if $full; then
  encode "$dest.mp4" 1080 23
  ffmpeg -hide_banner -loglevel error -y -i "$dest.mp4" -frames:v 1 -q:v 3 "$dest.jpg"
  echo "$dest.mp4, $dest.jpg"
fi

IFS=x read -r w h _ < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$input")
if (( (w < h ? w : h) > 720 )); then
  encode "$dest-720.mp4" 720 26
  echo "$dest-720.mp4"
else
  echo "${w}x${h} is already 720p or smaller; no phone rendition needed"
fi
