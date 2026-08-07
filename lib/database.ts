const DB_NAME = "BlueLog";
const DB_VERSION = 1;

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("dives")) {
        db.createObjectStore("dives", {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

}

export async function saveDiveToDatabase(dive: any) {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("dives", "readwrite");

    const store = tx.objectStore("dives");

    store.put(dive);

    tx.oncomplete = () => resolve();

    tx.onerror = () => reject(tx.error);
  });
}