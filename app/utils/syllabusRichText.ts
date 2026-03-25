/**
 * რიჩტექსტი ცარიელია თუ ტეგების მოცილების შემდეგ არაფერი რჩება
 * (TinyMCE: <p></p>, <p><br></p> და ა.შ.)
 */
function normalizeRichTextToPlain(html: string): string {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isEffectivelyEmptyRichText(html: string): boolean {
  return normalizeRichTextToPlain(html).length === 0;
}
