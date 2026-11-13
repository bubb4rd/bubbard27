#!/usr/bin/env bash
# Encodes a screen recording, GIF or video into the site's clip format:
#   <dest>.mp4      H.264, silent, short side <= 1080 (or --max), at most 30 fps, metadata up front (fast start)
#   <dest>-av1.mp4  AV1 at the same size, offered first to browsers that can play it; about half the bytes
#   <dest>-720.mp4  phone rendition (short side 720), only when <dest>.mp4 is larger
#   <dest>.jpg      first-frame poster
#
# /media is served with a one-year immutable cache (netlify.toml): never overwrite a published file,
# encode a changed clip to a new <dest>.
#
# Usage:
#   scripts/encode-clip.sh [--max <px>] <input> <dest without extension>
#   scripts/encode-clip.sh --small-only <existing clip.mp4>   # add just the phone rendition
#   scripts/encode-clip.sh --av1-only <existing clip.mp4>     # add just the AV1 rendition
#
# Then list it in src/data/projects.ts as
#   { type: "video", src: "<dest>.mp4", av1: "<dest>-av1.mp4", small: "<dest>-720.mp4", poster: "<dest>.jpg", ... }
set -euo pipefail

usage() {
  echo "usage: $0 [--max <px>] <input> <dest>  |  $0 --small-only <clip.mp4>  |  $0 --av1-only <clip.mp4>" >&2
  exit 1
}

max=1080
mode=full
case ${1:-} in
  --small-only | --av1-only)
    [[ $# -eq 2 ]] || usage
    mode=${1#--}
    input=$2
    dest=${input%.mp4}
    ;;
  *)
    if [[ ${1:-} == --max ]]; then
      [[ $# -eq 4 ]] || usage
      max=$2
      shift 2
    fi
    [[ $# -eq 2 ]] || usage
    input=$1
    dest=$2
    ;;
esac

# Scale filter: short side to at most $1 px, never upscaled, even dimensions (yuv420p needs them).
fit() {
  local even="trunc(min($1,%s)/2)*2"
  printf "scale='if(gt(iw,ih),-2,$even)':'if(gt(iw,ih),$even,-2)'" iw ih
}

# h264 <out> <short side> <crf>
h264() {
  ffmpeg -hide_banner -loglevel error -y -i "$input" -vf "$(fit "$2")" -fpsmax 30 \
    -c:v libx264 -preset slow -crf "$3" -profile:v high -pix_fmt yuv420p \
    -an -movflags +faststart "$1"
}

# av1 <out> <short side> <h264 to beat>: SVT-AV1 at a quality that keeps UI text crisp. Kept only when it
# comes out smaller than the H.264 clip; an already lean or already compressed source often doesn't.
av1() {
  SVT_LOG=1 ffmpeg -hide_banner -loglevel error -y -i "$input" -vf "$(fit "$2")" -fpsmax 30 \
    -c:v libsvtav1 -preset 6 -crf 34 -pix_fmt yuv420p \
    -an -movflags +faststart "$1"
  if (( $(stat -f%z "$1") >= $(stat -f%z "$3") )); then
    rm "$1"
    echo "AV1 came out no smaller than $3; skipped"
  else
    echo "$1"
  fi
}

short_side() {
  local w h
  IFS=x read -r w h _ < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$1")
  echo $((w < h ? w : h))
}

if [[ $mode == av1-only ]]; then
  av1 "$dest-av1.mp4" "$(short_side "$input")" "$input"
  exit
fi

if [[ $mode == full ]]; then
  h264 "$dest.mp4" "$max" 23
  ffmpeg -hide_banner -loglevel error -y -i "$dest.mp4" -frames:v 1 -q:v 3 "$dest.jpg"
  echo "$dest.mp4, $dest.jpg"
  av1 "$dest-av1.mp4" "$max" "$dest.mp4"
fi

# The phone rendition comes from the source too, but only when the main clip is bigger than 720p.
[[ $mode == full ]] && sized=$dest.mp4 || sized=$input
if (( $(short_side "$sized") > 720 )); then
  h264 "$dest-720.mp4" 720 26
  echo "$dest-720.mp4"
else
  echo "already 720p or smaller; no phone rendition needed"
fi
