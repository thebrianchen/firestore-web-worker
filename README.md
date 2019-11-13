# firestore-web-worker

This contains sample implementations of using web workers with persistence in Firestore by using the `experimentalForce`
option provided in the experimental build (See [context](https://github.com/firebase/firebase-js-sdk/issues/983#issuecomment-536813965)).

There are 2 sample apps: 
- `shared-worker` uses a [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)
to manage the primary lease. 
- `localstorage` uses [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
to manage the primary lease.
