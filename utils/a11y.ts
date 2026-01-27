export const carAlt = (c: Record<string, unknown>) => {
  const title = typeof c.title === 'string' ? c.title.trim() : '';
  if (title) return `${title} มือสอง เชียงใหม่`;

  const brandValue = typeof c.brand === 'string' ? c.brand : '';
  const vendorValue = typeof c.vendor === 'string' ? c.vendor : '';
  const brand = brandValue || vendorValue || '';
  const model = typeof c.model === 'string' ? c.model : '';
  const year = typeof c.year === 'string' || typeof c.year === 'number' ? String(c.year) : '';

  return `${brand} ${model} ${year} มือสอง เชียงใหม่`.trim();
};
