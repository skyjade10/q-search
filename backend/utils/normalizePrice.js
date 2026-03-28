export const normalizePrice = (priceStr) => {
  if (!priceStr) return null;

  return Number(priceStr.replace(/[^0-9.]/g, ""));
}