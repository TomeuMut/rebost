import { productIcons, type ProductIconId } from './product-icons.ts';
export type Unit = 'botes' | 'botellas' | 'bolsas' | 'unidades';
export type Category = 'Conservas' | 'Fermentados' | 'Secos' | 'Otros';
export type Location = string;
export interface Zone { id: string; name: string; system?: 'Despensa' | 'Nevera' | 'Congelador' }
export interface Product { id: string; name: string; category: Category; unit: Unit; icon?: ProductIconId; createdAt: string }
export interface Batch { id: string; productId: string; label: string; defaultLabel?: boolean; location: Location; date: string; notes: string; createdAt: string }
export interface Movement { id: string; batchId: string; delta: number; type: 'entrada' | 'consumo' | 'ajuste'; note: string; systemNote?: 'batchAdded'; createdAt: string }
export interface Pantry { version: 2; zones: Zone[]; products: Product[]; batches: Batch[]; movements: Movement[]; demo: boolean }
export const categories: Category[] = ['Conservas', 'Fermentados', 'Secos', 'Otros'];
export const units: Unit[] = ['botes', 'botellas', 'bolsas', 'unidades'];
export const locations: Location[] = ['Despensa', 'Nevera', 'Congelador'];
export const emptyPantry = (): Pantry => ({ version: 2, products: [], batches: [], movements: [], demo: false, zones: locations.map(name => ({ id: name, name, system: name as Zone['system'] })) });
type LegacyPantry = Omit<Pantry, 'version' | 'zones'> & { version: 1 };
export function migratePantry(state: Pantry | LegacyPantry): Pantry {
  if (state.version === 2) return state;
  const zones = emptyPantry().zones;
  for (const batch of state.batches) if (!zones.some(zone => zone.id === batch.location)) zones.push({ id: batch.location, name: batch.location });
  return { ...state, version: 2, zones, movements: state.movements.map(movement => movement.type === 'entrada' && movement.note === 'Lote añadido' && state.movements.findLast(item => item.batchId === movement.batchId)?.id === movement.id ? { ...movement, systemNote: 'batchAdded' as const } : movement) };
}
export function addZone(state: Pantry, input: string): Pantry {
  const name = input.trim();
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  if (!name || name.length > 80) throw new Error('Indica un nombre de zona de entre 1 y 80 caracteres.');
  if (state.zones.some(zone => normalize(zone.name) === normalize(name))) throw new Error('Ya existe una zona con ese nombre.');
  return { ...state, zones: [...state.zones, { id: crypto.randomUUID(), name }] };
}
export const stock = (state: Pantry, batchId: string): number => state.movements.filter(m => m.batchId === batchId).reduce((sum, m) => sum + m.delta, 0);
export const productStock = (state: Pantry, productId: string): number => state.batches.filter(b => b.productId === productId).reduce((sum, b) => sum + stock(state, b.id), 0);
function clean(value: string, max: number): string { return value.trim().slice(0, max); }
function quantity(value: number, allowZero = false): void { if (!Number.isSafeInteger(value) || value < (allowZero ? 0 : 1) || value > 1_000_000) throw new Error('Introduce una cantidad entera entre ' + (allowZero ? '0' : '1') + ' y 1.000.000.'); }
const timestamp = () => new Date().toISOString();
export function addProduct(state: Pantry, input: { name: string; category: Category; unit: Unit; icon?: ProductIconId }): Pantry {
  const name = clean(input.name, 80);
  if (!name) throw new Error('El producto necesita un nombre.');
  if (!categories.includes(input.category) || !units.includes(input.unit)) throw new Error('Revisa la categoría y la unidad.');
  if (state.products.some(p => p.name.toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))) throw new Error('Ya tienes un producto con ese nombre. Añade un lote al existente.');
  if (input.icon && !productIcons.includes(input.icon)) throw new Error('Elige un icono válido.');
  return { ...state, products: [...state.products, { id: crypto.randomUUID(), name, category: input.category, unit: input.unit, icon: input.icon || 'auto', createdAt: timestamp() }] };
}
export function setProductIcon(state: Pantry, productId: string, icon: ProductIconId): Pantry {
  if (!state.products.some(product => product.id === productId)) throw new Error('El producto ya no existe.');
  if (!productIcons.includes(icon)) throw new Error('Elige un icono válido.');
  return { ...state, products: state.products.map(product => product.id === productId ? { ...product, icon } : product) };
}
export function addBatch(state: Pantry, productId: string, input: { label: string; location: Location; date: string; notes: string; quantity: number }): Pantry {
  if (!state.products.some(p => p.id === productId)) throw new Error('El producto ya no existe.');
  quantity(input.quantity);
  if (!state.zones.some(zone => zone.id === input.location)) throw new Error('Elige una ubicación válida.');
  if (input.date && (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date)) || new Date(input.date).toISOString().slice(0, 10) !== input.date)) throw new Error('Revisa la fecha de elaboración.');
  const batch: Batch = { id: crypto.randomUUID(), productId, label: clean(input.label, 80) || 'Lote ' + (state.batches.filter(b => b.productId === productId).length + 1), defaultLabel: !clean(input.label, 80), location: input.location, date: input.date, notes: clean(input.notes, 400), createdAt: timestamp() };
  const movement: Movement = { id: crypto.randomUUID(), batchId: batch.id, delta: input.quantity, type: 'entrada', note: 'Lote añadido', systemNote: 'batchAdded', createdAt: timestamp() };
  return { ...state, batches: [...state.batches, batch], movements: [movement, ...state.movements] };
}
export function moveStock(state: Pantry, batchId: string, type: 'entrada' | 'consumo' | 'ajuste', amount: number, note: string): Pantry {
  if (!state.batches.some(b => b.id === batchId)) throw new Error('El lote ya no existe.');
  if (!['entrada', 'consumo', 'ajuste'].includes(type)) throw new Error('Movimiento no válido.');
  quantity(amount, type === 'ajuste');
  const current = stock(state, batchId);
  const delta = type === 'ajuste' ? amount - current : type === 'consumo' ? -amount : amount;
  if (delta === 0) throw new Error('La cantidad ya coincide. No hace falta corregirla.');
  if (!Number.isSafeInteger(current + delta) || current + delta < 0 || current + delta > 1_000_000) throw new Error(type === 'consumo' ? 'No hay suficientes existencias en este lote.' : 'El lote no puede superar 1.000.000 de unidades.');
  if (type === 'ajuste' && !clean(note, 180)) throw new Error('Indica el motivo de la corrección.');
  return { ...state, movements: [{ id: crypto.randomUUID(), batchId, delta, type, note: clean(note, 180), createdAt: timestamp() }, ...state.movements] };
}
export function demoPantry(): Pantry {
  let state: Pantry = { ...emptyPantry(), demo: true };
  const examples: { name: string; category: Category; unit: Unit; location: Location; amount: number; notes: string }[] = [
    { name: 'Tomate triturado', category: 'Conservas', unit: 'botes', location: 'Despensa', amount: 5, notes: 'La última tanda de tomates del huerto.' },
    { name: 'Kombucha', category: 'Fermentados', unit: 'botellas', location: 'Nevera', amount: 3, notes: 'Botellas de la segunda fermentación.' },
    { name: 'Pimientos en conserva', category: 'Conservas', unit: 'botes', location: 'Despensa', amount: 4, notes: '' },
    { name: 'Garbanzos', category: 'Secos', unit: 'bolsas', location: 'Despensa', amount: 2, notes: '' },
    { name: 'Caldo de verduras', category: 'Otros', unit: 'botes', location: 'Congelador', amount: 2, notes: '' },
  ];
  for (const item of examples) {
    state = addProduct(state, item); const productId = state.products.at(-1)!.id;
    state = addBatch(state, productId, { label: 'Primera tanda', location: item.location, date: '2026-09-15', notes: item.notes, quantity: item.amount });
    if (item.name === 'Tomate triturado') state = addBatch(state, productId, { label: 'Segunda tanda', location: item.location, date: '2026-10-01', notes: '', quantity: 3 });
  }
  return state;
}
