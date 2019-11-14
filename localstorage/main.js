/**
 * This is an example using LocalStorage in your main page to to keep track of
 * whether its underlying web worker can force using persistence without
 * breaking other tabs/web workers. Since only one tab can use persistence at a
 * time, we're using LocalStorage to restrict persistence.
 * 
 * You can invoke Firestore functionality from your main page by passing messages
 * to the web worker running Firebase, as shown in the enableNetwork/
 * disableNetwork example.
 */

const dedicatedWorker = new Worker("firebase-worker.js");

function main() {
  const persistenceAvailable = isPersistenceAvailable();
  
  // Whether the current tab is using persistence.
  let isUsingPersistence = false;

  // Tell the Firestore worker if it can enable persistence.
  if (persistenceAvailable) {
    dedicatedWorker.postMessage('persistenceAvailable');
  } else {
    dedicatedWorker.postMessage('persistenceUnavailable');
  }

  dedicatedWorker.onmessage = function(event) {
    if (event.data === 'persistenceTaken') {
      // Mark persistence as unavailable to other tabs, if this tab has
      // successfully enabled persistence.
      localStorage.setItem('persistenceAvailable', 'false');
      isUsingPersistence = true;
    }
  }

  // If the worker in this tab is using persistence, release persistence
  // before the page terminates. This allows the next worker that loads
  // to use persistence. 
  window.addEventListener("beforeunload", function() {
    console.log('Terminating. Releasing persistence.');
    if (isUsingPersistence) {
      localStorage.setItem('persistenceAvailable', 'true');
    }
  })
}

/**
 * Checks if persistence is available in LocalStorage, or initializes the
 * field if it has not yet been set.
 *
 * TODO: Currently, if the page crahses, persistence could be permanently
 * marked as unavailable in LocalStorage. Implementing some sort of time-based
 * expiration would make this more robust.
 */
function isPersistenceAvailable() {
  if (localStorage.getItem('persistenceAvailable') === 'false') {
    return false;
  } else {
    if (localStorage.getItem('persistenceAvailable') === null) {
      localStorage.setItem('persistenceAvailable', 'true');
    }
    return true;
  }
}

/** Enable the network in Firestore by posting a message to the worker. */
function enableNetwork() {
  dedicatedWorker.postMessage('enableNetwork');
}

/** Disable the network in Firestore by posting a message to the worker. */
function disableNetwork() {
  dedicatedWorker.postMessage('disableNetwork');
}

/** Writes data to Firestore. */
function writeData() {
  dedicatedWorker.postMessage('writeData');
}

main();
