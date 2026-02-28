export const hasValue = v => v != null && String(v).trim() !== '';

export const metafieldsToList = raw => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.edges)) return raw.edges.map(e => e?.node).filter(Boolean);
  return [];
};

export const metaobjectToDisplayValue = ref => {
  if (!ref) return null;
  const fields = Array.isArray(ref.fields) ? ref.fields : [];
  const byKey = key => fields.find(f => f?.key === key)?.value;
  return byKey('label') || byKey('name') || byKey('title') || byKey('value') || ref.handle || null;
};

export const metafieldToDisplayValue = m => {
  if (!m) return null;

  const rawValue = m.value;
  const rawType = m.type ? String(m.type) : '';

  const looksLikeMetaobjectGid = v =>
    typeof v === 'string' && /^gid:\/\/shopify\/Metaobject\//.test(v.trim());

  // If it's a list of references, join them (preferred for list.metaobject_reference).
  const refs = Array.isArray(m.references?.edges)
    ? m.references.edges.map(e => e?.node).filter(Boolean)
    : [];

  if (refs.length > 0) {
    const values = refs
      .map(r => {
        if (r?.__typename === 'Metaobject') return metaobjectToDisplayValue(r);
        return null;
      })
      .filter(Boolean);

    if (values.length > 0) return values.join(', ');
  }

  // Normalize list values stored as JSON arrays (common for list.* types).
  if (typeof rawValue === 'string') {
    const trimmed = rawValue.trim();
    const looksLikeJsonArray = trimmed.startsWith('[') && trimmed.endsWith(']');

    if (looksLikeJsonArray && (rawType.startsWith('list.') || rawType === '')) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          // Storefront often returns list.metaobject_reference as raw GIDs without `references`.
          // Treat that as "missing" so Admin fallback can resolve labels.
          if (
            rawType === 'list.metaobject_reference' &&
            arr.every(v => looksLikeMetaobjectGid(v))
          ) {
            return null;
          }

          const values = arr.map(v => (v == null ? '' : String(v).trim())).filter(Boolean);
          if (values.length > 0) return values.join(', ');
        }
      } catch {
        // ignore JSON parse errors and fall back to raw handling
      }
    }

    // Normalize numbers like "150000.0" -> "150000".
    if (rawType.startsWith('number_') && /^\d+\.0+$/.test(trimmed)) {
      return trimmed.replace(/\.0+$/, '');
    }
  }

  // If it's a metaobject reference, prefer a human-readable label.
  const ref = m.reference;
  if (ref && ref.__typename === 'Metaobject') {
    return metaobjectToDisplayValue(ref) || m.value || null;
  }

  // Storefront sometimes returns a single metaobject_reference as a raw GID without `reference`.
  if (rawType === 'metaobject_reference' && looksLikeMetaobjectGid(rawValue)) {
    return null;
  }

  return rawValue ?? null;
};

export const specFromMetafields = raw => {
  const list = metafieldsToList(raw);
  return list
    .filter(
      m =>
        m &&
        (m.namespace === 'spec' || m.namespace === 'custom' || m.namespace === 'shopify') &&
        typeof m.key === 'string'
    )
    .reduce((acc, m) => {
      acc[m.key] = metafieldToDisplayValue(m);

      const flattenMetaobjectFields = ref => {
        if (!ref || ref.__typename !== 'Metaobject') return;
        const fields = Array.isArray(ref.fields) ? ref.fields : [];
        for (const f of fields) {
          const k = f?.key;
          const v = f?.value;
          if (typeof k !== 'string' || !hasValue(v)) continue;
          if (hasValue(acc[k])) continue;
          acc[k] = String(v).trim();
        }
      };

      if (m.reference) {
        flattenMetaobjectFields(m.reference);
      } else if (Array.isArray(m.references?.edges)) {
        const refs = m.references.edges.map(e => e?.node).filter(Boolean);
        if (refs.length === 1) flattenMetaobjectFields(refs[0]);
      }

      return acc;
    }, {});
};
