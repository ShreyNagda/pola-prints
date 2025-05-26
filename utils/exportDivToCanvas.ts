// utils/exportDivToCanvas.ts
import html2canvas from "html2canvas";

/**
 * Converts a DOM element (like a styled Polaroid) into a canvas.
 * @param element The HTML element to render (e.g., use ref.current).
 * @returns A Promise that resolves with the canvas element.
 */
export async function exportDivToCanvas(
  element: HTMLElement
): Promise<HTMLCanvasElement> {
  if (!element) {
    throw new Error("No element provided to exportDivToCanvas.");
  }

  const canvas = await html2canvas(element, {
    backgroundColor: null, // Preserves transparency if needed
    useCORS: true, // Enables loading external images if cross-origin
    scale: 2, // Improves output quality
  });

  return canvas;
}
