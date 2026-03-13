/**
 * Returns true if a product should be displayed as "Coming Soon"
 * (shown in the storefront but not available for purchase).
 *
 * Detection: checks WooCommerce POS "Available for POS" meta flag.
 * When the checkbox is unchecked, the plugin stores one of the keys below
 * with a value that indicates "not available".
 *
 * If your plugin uses a different key/value, add it to the arrays below.
 */
export function isComingSoon(product: {
  name?: string
  meta_data?: Array<{ key: string; value: unknown }>
}): boolean {
  const meta = product.meta_data ?? []

  // Keys that WooCommerce POS plugins use for visibility
  const posKeys = ['_pos_visibility', '_wc_pos_visibility', 'wcpos_visibility', 'pos_visibility']
  // Values that mean "not available / coming soon"
  const hiddenValues = ['hidden', 'private', 'draft', '0', 0, false, 'no', 'off']

  for (const key of posKeys) {
    const entry = meta.find(m => m.key === key)
    if (entry && hiddenValues.includes(entry.value as string | number | boolean)) return true
  }

  // Legacy: name-based detection kept for backward compatibility
  if (product.name?.toLowerCase().includes('sahara')) return true

  return false
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z]+;/gi, '')
    .trim()
}

export function getProductVolume(product: {
  attributes?: Array<{ name?: string; options?: string[] }>
  short_description?: string
  description?: string
}): string | null {
  const attrs = product.attributes ?? []
  const fromAttribute = attrs.find((attr) => /^(size|volume|ml)$/i.test((attr.name ?? '').trim()))?.options?.[0]?.trim()
  if (fromAttribute) return fromAttribute

  const combined = `${product.short_description ?? ''}\n${product.description ?? ''}`
  const lines = stripHtml(combined).split('\n').map((line) => line.trim()).filter(Boolean)

  for (const line of lines) {
    const match = line.match(/^(?:size|volume)\s*[:\-—]?\s*(.+)$/i)
    if (match?.[1]) {
      const value = match[1].trim()
      if (value) return value
    }
  }

  return null
}
