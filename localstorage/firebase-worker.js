/**
 * Dedicated web worker that loads Firebase off of the main browser thread.
 * Each tab will run an instance of Firestore via the web worker. The worker
 * receives messages from your main page and performs Firestore operations.
 * 
 * Must be loaded and initialized from your main page:
 * dedicatedWorker = new Worker("firebase-worker.js");
 */

importScripts('../firebase/firebase-app.js');
importScripts('../firebase/firebase-firestore.js');

var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
  measurementId: "G-measurement-id",
};

/** The Firestore instance. */
self.db = null;
self.onmessage = async function(e) {
  // Do Firebase work here.
  if (e.data === 'persistenceAvailable') {
    await initializeApp(true);
  } else if (e.data === 'persistenceUnavailable') {
    await initializeApp(false);
  } else if (e.data === 'enableNetwork') {
    await self.db.enableNetwork().then(() => {
      console.log('Enabled network');
    });
  } else if (e.data === 'disableNetwork') {
    await self.db.disableNetwork().then(() => {
      console.log('Disabled network');
    });
  }
};

async function initializeApp(withPersistence) {
  const app = firebase.initializeApp(config, "app");
  self.db = firebase.firestore(app);
  if (withPersistence) {
    console.log('Starting Firestore with persistence.');
    await self.db.enablePersistence({experimentalForce: true}).then(() => {
      postMessage('takePersistence');
    });
  } else {
    console.log(
      'Persistence unavailable. Starting Firestore with persistence will error.'
    );
    // await self.db.enablePersistence();  // This will error
  } 
}
