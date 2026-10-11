export const productIcons = ['auto', 'jar', 'bottle', 'tomato', 'carrot', 'pepper', 'fruit', 'grains', 'leaf', 'fish', 'bread', 'cheese', 'bag', 'bowl'] as const;
export type ProductIconId = typeof productIcons[number];
export const iconLabels: Record<ProductIconId, string> = {
  auto: 'Automático', jar: 'Bote', bottle: 'Botella', tomato: 'Tomate', carrot: 'Zanahoria', pepper: 'Pimiento', fruit: 'Fruta', grains: 'Cereales', leaf: 'Hierbas', fish: 'Pescado', bread: 'Pan', cheese: 'Queso', bag: 'Bolsa', bowl: 'Caldo',
};
export function resolveProductIcon(product: { name: string; unit: string; icon?: ProductIconId }): Exclude<ProductIconId, 'auto'> {
  if (product.icon && product.icon !== 'auto' && productIcons.includes(product.icon)) return product.icon;
  const name = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/tomat/.test(name)) return 'tomato';
  if (/zanahoria|carrot|pastanaga/.test(name)) return 'carrot';
  if (/pimiento|pepper|pebre/.test(name)) return 'pepper';
  if (/caldo|brou|broth|soup|sopa/.test(name)) return 'bowl';
  if (/queso|cheese|formatge/.test(name)) return 'cheese';
  if (/pescado|fish|peix|atun|tonyina|tuna|sardin/.test(name)) return 'fish';
  if (/mermelada|marmalade|jam\b|melmelada|fruta|fruit/.test(name)) return 'fruit';
  if (/hierba|herb|herbes|menta|mint|roman[iy]|rosemary/.test(name)) return 'leaf';
  if (/garbanzo|cigro|chickpea|arroz|rice|arros|cereal|grain|lenteja|llentia|lentil/.test(name)) return 'grains';
  if (/\bpan\b|\bpa\b|bread/.test(name)) return 'bread';
  if (product.unit === 'botellas') return 'bottle';
  if (product.unit === 'bolsas') return 'bag';
  return 'jar';
}
