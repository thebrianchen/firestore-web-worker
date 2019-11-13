/**
 * Dedicated shared worker that loads Firebase off of the main browser thread.
 * The shared worker instance is shared across all tabs, which allows you to
 * run a single instance of Firestore across all of your tabs. You must pass
 * in `experimentalForce: true` when enabling persistence, or else refreshing
 * the page will break persistence.
 * 
 * To view the log for shared-worker, navigate to: `chrome://inspect/#workers`
 * and click on "Inspect".
 * 
 * Must be loaded and initialized from your main page:
 * sharedWorker = new SharedWorker("shared-worker.js");
 * sharedWorker.port.start();  
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

self.db = null;
self.onconnect = async function(e) {
  console.log('onconnect');
  var port = e.ports[0];

  // Do Firestore work here.
  port.onmessage = function(e) {
    if (e.data === 'enableNetwork') {
      await self.db.enableNetwork().then(() => {
        console.log('Enabled network');
      });
    } else if (e.data == 'disableNetwork') {
      await self.db.disableNetwork().then(() => {
        console.log('Disabled network');
      });
    }
  }
}

async function initializeApp() {
  console.log('Initializing Firebase');
  const app = firebase.initializeApp(config, "app");
  self.db = firebase.firestore(app);
  await self.db.enablePersistence({experimentalForce: true});
}

initializeApp().then(() => {
  console.log('Firebase initialized');
}).catch((err) => {
  console.log('Firebase initialization failed with error: ', err);
});

