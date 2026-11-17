/**
 * Next.js 14 meneruskan segmen dinamis apa adanya (masih ter-encode), jadi
 * slug yang mengandung spasi dari admin datang sebagai "knife%20material".
 * Decode sekali sebelum dibandingkan dengan data API / data statis.
 */
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
