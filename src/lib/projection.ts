/**
 * Equirectangular projection helpers for the live world map.
 * Converts geographic coordinates to percentage offsets inside a
 * standard 2:1 equirectangular world map container.
 */
export function project(lat: number, lng: number): { x: number; y: number } {
  const x = (lng + 180) / 360
  const y = (90 - lat) / 180
  return { x: x * 100, y: y * 100 }
}
