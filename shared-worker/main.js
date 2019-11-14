/**
 * This is an example of using a shared worker loaded in your main page to run 
 * a single instance of Firebase that is shared across all tabs. Because only
 * one instance of Firestore runs at a time, we do not have to perform any tab
 * management like we have to do in the LocalStorage example.
 * 
 * You can invoke Firestore functionality from your main page by passing messages
 * to the shared worker running Firebase, as shown in the enableNetwork/
 * disableNetwork example.
 */

var sharedWorker = null;
function main() {
  if (!!window.SharedWorker) {  
    sharedWorker = new SharedWorker("shared-worker.js");
    sharedWorker.port.start();   
  } 
}

/** Enable the network in Firestore by posting a message to the worker. */
function enableNetwork() {
  sharedWorker.port.postMessage('enableNetwork');
}

/** Disable the network in Firestore by posting a message to the worker. */
function disableNetwork() {
  sharedWorker.port.postMessage('disableNetwork');
}

/** Writes data to Firestore. */
function writeData() {
  sharedWorker.port.postMessage('writeData');
}

main();
