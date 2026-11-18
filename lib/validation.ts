// Letters (incl. accents), spaces, apostrophes, periods, commas and hyphens.
const TEXT_ONLY = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'.,-]*$/;

export function validateText(value: string, label: string): string | null {
  const v = value.trim();
  if (!v) return `Please enter your ${label}.`;
  if (/\d/.test(v)) return `Your ${label} can't contain numbers.`;
  if (v.length < 2) return `Your ${label} must be at least 2 characters.`;
  if (v.length > 60) return `Your ${label} is too long.`;
  if (!TEXT_ONLY.test(v)) return `Please use letters only for your ${label}.`;
  return null;
}
