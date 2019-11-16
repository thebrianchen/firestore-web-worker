/**
 * Dedicated web worker that loads Firebase off of the main browser thread.
 * Each tab will run an instance of Firestore via the web worker. The worker
 * receives messages from your main page and performs Firestore operations.
 * 
 * Must be loaded and initialized from your main page:
 * dedicatedWorker = new Worker("firebase-worker.js");
 *
 * In this example, you can test that persistence is working by disabling the
 * network and writing data. When you refresh a page that has persistence
 * enabled, you can see that the data persists to the server.
 */

importScripts('../firebase/firebase-app.js');
importScripts('../firebase/firebase-firestore.js');

var config = {
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
self.onmessage = function(e) {
  if (e.data === 'persistenceAvailable') {
    initializeApp(/*withPersistence=*/true);
  } else if (e.data === 'persistenceUnavailable') {
    initializeApp(/*withPersistence=*/false);
  } else if (e.data === 'enableNetwork') {
    self.db.enableNetwork().then(() => {
      console.log('Enabled network');
    });
  } else if (e.data === 'disableNetwork') {
    self.db.disableNetwork().then(() => {
      console.log('Disabled network');
    });
  } else if (e.data === 'writeData') {
    self.db.doc('followers/user1').set({
      name: 'Bobby',
      // Set age to a random value to test that persistence works.
      age: Math.floor(Math.random() * 80 + 20)
    })
  }
  // Add message handlers that do Firebase work here.
};

function initializeApp(withPersistence) {
  const app = firebase.initializeApp(config, "app");
  self.db = firebase.firestore(app);
  if (withPersistence) {
    console.log('Starting Firestore with persistence.');
    self.db.enablePersistence({experimentalForce: true}).then(() => {
      postMessage('persistenceTaken');
    }).catch((err) => {
      console.error('error enabling persistence', err);
    });
  } else {
    console.log(
      'Persistence unavailable. Starting Firestore with persistence will error.'
    );
    // await self.db.enablePersistence();  // This will error
  }

  // Listen to data.
  self.db.doc('followers/user1')
    .onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
      var source = snapshot.metadata.fromCache ? "local cache" : "server";
      console.log("Data came from " + source, snapshot.data());
  });
}
