export const brightenColor = (hex: string, percent: number) => {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Convert RGB to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Increase lightness (ensure it doesn't exceed 1)
  l = Math.min(1, l + percent / 100);

  // Convert HSL back to RGB
  let r1, g1, b1;
  if (s === 0) {
    r1 = g1 = b1 = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r1 = hueToRgb(p, q, h + 1 / 3);
    g1 = hueToRgb(p, q, h);
    b1 = hueToRgb(p, q, h - 1 / 3);
  }

  // Convert RGB to hex
  r1 = Math.round(r1 * 255)
    .toString(16)
    .padStart(2, "0");
  g1 = Math.round(g1 * 255)
    .toString(16)
    .padStart(2, "0");
  b1 = Math.round(b1 * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${r1}${g1}${b1}`;
};

// Helper function for HSL to RGB conversion
const hueToRgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

  return p;
};
