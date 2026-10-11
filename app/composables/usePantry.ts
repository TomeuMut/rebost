import { emptyPantry, migratePantry, type Pantry } from '../../src/domain/pantry';

const state = ref<Pantry>(emptyPantry());
const ready = ref(false);
const busy = ref(false);
const error = ref('');
let database: IDBDatabase | undefined;
let channel: BroadcastChannel | undefined;
let started = false;

export function usePantry() {
  async function reload() {
    if (!database) return;
    const tx = database.transaction('pantry', 'readonly');
    const request = tx.objectStore('pantry').get('home');
    await new Promise<void>(resolve => {
      request.onsuccess = () => { if (request.result) state.value = migratePantry(request.result); resolve(); };
      request.onerror = () => { error.value = 'No se ha podido leer tu despensa. Recarga la página para volver a intentarlo.'; resolve(); };
    });
  }
  function initialize() {
    if (started) return;
    started = true;
    if (!('indexedDB' in window)) { error.value = 'Este navegador no permite guardar la despensa. Prueba con otro navegador.'; return; }
    const request = indexedDB.open('rebost-v1', 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('pantry'); };
    request.onerror = () => { error.value = 'No se ha podido abrir el almacenamiento. Revisa si tu navegador permite guardar datos de este sitio.'; };
    request.onblocked = () => { error.value = 'Cierra otras pestañas de Rebost y recarga para actualizar el almacenamiento.'; };
    request.onsuccess = async () => {
      database = request.result;
      database.onversionchange = () => { database?.close(); ready.value = false; error.value = 'Recarga esta pestaña para continuar.'; };
      await new Promise<void>((resolve, reject) => {
        const tx = database!.transaction('pantry', 'readwrite');
        const store = tx.objectStore('pantry');
        const get = store.get('home');
        get.onsuccess = () => { store.put(get.result ? migratePantry(get.result) : emptyPantry(), 'home'); };
        tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
      }).then(async () => { await reload(); ready.value = true; }).catch(() => { error.value = 'No se ha podido preparar tu despensa. Recarga para volver a intentarlo.'; });
      if ('BroadcastChannel' in window) { channel = new BroadcastChannel('rebost-updates'); channel.onmessage = () => { void reload(); }; }
      window.addEventListener('focus', () => { void reload(); });
    };
  }
  async function mutate(change: (current: Pantry) => Pantry): Promise<boolean> {
    if (!database || !ready.value || busy.value) return false;
    busy.value = true; error.value = '';
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = database!.transaction('pantry', 'readwrite');
        const store = tx.objectStore('pantry'); const get = store.get('home'); let next: Pantry;
        get.onsuccess = () => { try { next = change(migratePantry(get.result)); store.put(JSON.parse(JSON.stringify(next)), 'home'); } catch (err) { tx.abort(); reject(err); } };
        tx.oncomplete = () => { state.value = next; channel?.postMessage('updated'); resolve(); };
        tx.onabort = () => reject(new Error('No se han guardado los cambios. El almacenamiento puede estar lleno o no disponible.'));
        tx.onerror = () => reject(tx.error);
      });
      return true;
    } catch (err) { error.value = err instanceof Error ? err.message : 'No se ha podido guardar el cambio. Inténtalo de nuevo.'; return false; }
    finally { busy.value = false; }
  }
  onMounted(initialize);
  return { state, ready, busy, error, mutate };
}
