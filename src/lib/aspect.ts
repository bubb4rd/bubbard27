/** Width / height of a CSS aspect-ratio string such as "16/9" or "1"; falls back to 16:9. */
export function aspectRatio(aspect: string) {
  const [w, h = 1] = aspect.split("/").map(Number);
  return w > 0 && h > 0 ? w / h : 16 / 9;
}
