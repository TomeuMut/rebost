import assert from 'node:assert/strict';
import test from 'node:test';
import { messages, translate } from '../src/i18n/messages.ts';

test('every interface message has an English and Catalan translation', () => {
  for (const locale of ['en', 'ca']) {
    assert.deepEqual(Object.keys(messages[locale]), Object.keys(messages.es));
    for (const value of Object.values(messages[locale])) assert.ok(value.trim());
  }
  assert.equal(translate('en', 'Mi despensa'), 'My pantry');
  assert.equal(translate('ca', 'Mi despensa'), 'El meu rebost');
  assert.equal(translate('ca', 'Almacén 2'), 'Almacén 2');
});
