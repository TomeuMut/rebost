import assert from 'node:assert/strict';
import test from 'node:test';
import { addProduct, addBatch, addZone, emptyPantry, migratePantry, productStock } from '../src/domain/pantry.ts';

test('custom zones can be assigned to batches without changing stock', () => {
  let pantry = addZone(emptyPantry(), '  Almacén 2  ');
  const zone = pantry.zones.at(-1);
  assert.equal(zone.name, 'Almacén 2');
  pantry = addProduct(pantry, { name: 'Tomate', category: 'Conservas', unit: 'botes' });
  pantry = addBatch(pantry, pantry.products[0].id, { label: '', location: zone.id, date: '', notes: '', quantity: 5 });
  assert.equal(pantry.batches[0].location, zone.id);
  assert.equal(productStock(pantry, pantry.products[0].id), 5);
  assert.throws(() => addBatch(pantry, pantry.products[0].id, { label: '', location: 'missing', date: '', notes: '', quantity: 2 }));
});

test('zone names reject blanks, excessive length and case or accent duplicates', () => {
  const pantry = addZone(emptyPantry(), 'Almacén 2');
  for (const name of ['', '  ', 'a'.repeat(81), ' ALMACEN 2 ', 'despensa']) assert.throws(() => addZone(pantry, name));
  assert.equal(pantry.zones.length, 4);
  assert.equal(addZone(pantry, 'Despensa 1').zones.length, 5);
});

test('migration preserves existing products, batches, balances and legacy locations', () => {
  let pantry = addProduct(emptyPantry(), { name: 'Tomate', category: 'Conservas', unit: 'botes' });
  pantry = addBatch(pantry, pantry.products[0].id, { label: 'Septiembre', location: 'Despensa', date: '', notes: 'Mi nota', quantity: 5 });
  const { zones, ...rest } = pantry;
  const legacy = { ...rest, version: 1, batches: [{ ...rest.batches[0], location: 'Antiguo almacén' }], movements: rest.movements.map(({ systemNote, ...movement }) => movement) };
  const migrated = migratePantry(legacy);
  assert.equal(migrated.version, 2);
  assert.deepEqual(migrated.products, legacy.products);
  assert.deepEqual(migrated.batches, legacy.batches);
  assert.equal(migrated.movements[0].id, legacy.movements[0].id);
  assert.equal(productStock(migrated, migrated.products[0].id), 5);
  assert.equal(migrated.zones.find(zone => zone.id === 'Antiguo almacén').name, 'Antiguo almacén');
  assert.equal(migratePantry(migrated), migrated);
  assert.equal(legacy.version, 1);
  const withPersonalNote = migratePantry({ ...legacy, movements: [{ ...legacy.movements[0], id: 'manual-entry', note: 'Lote añadido' }, ...legacy.movements] });
  assert.equal(withPersonalNote.movements[0].systemNote, undefined);
  assert.equal(withPersonalNote.movements[1].systemNote, 'batchAdded');
});
