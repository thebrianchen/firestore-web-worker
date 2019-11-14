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
 *
 * In this example, you can test that persistence is working by disabling the
 * network and writing data. When you refresh a page, you can see that the data
 * persists to the server.
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

self.db = null;
self.onconnect = function(e) {
  console.log('onconnect');
  var port = e.ports[0];

  port.onmessage = function(e) {
    if (e.data === 'enableNetwork') {
      self.db.enableNetwork().then(() => {
        console.log('Enabled network');
      });
    } else if (e.data === 'disableNetwork') {
      self.db.disableNetwork().then(() => {
        console.log('Disabled network');
      });
    } else if (e.data === 'writeData') {
      self.db.collection('followers').doc('user1').set({
        name: 'Bobby',
        // Set age to a random value to test that persistence works.
        age: Math.floor(Math.random() * 80 + 20)
      })
    }
    // Add message handlers that do Firebase work here.
  }
}

async function initializeApp() {
  console.log('Initializing Firebase');
  const app = firebase.initializeApp(config, "app");
  self.db = firebase.firestore(app);
  await self.db.enablePersistence({experimentalForce: true});

  // Listen to data.
  self.db.collection('followers')
    .onSnapshot({ includeMetadataChanges: true }, function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
          var source = snapshot.metadata.fromCache ? "local cache" : "server";
          console.log("Data came from " + source, change.doc.data());
    });
  });
}

initializeApp().then(() => {
  console.log('Firebase initialized');
}).catch((err) => {
  console.log('Firebase initialization failed with error: ', err);
});

