export const carAlt = (c: Record<string, unknown>) =>
  `${c.brand ?? ''} ${c.model ?? ''} ${c.year ?? ''} มือสอง เชียงใหม่`.trim();
