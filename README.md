# firestore-web-worker

This contains sample implementations of using web workers with persistence in Firestore by using the `experimentalForce`
option provided in the experimental build (See [context](https://github.com/firebase/firebase-js-sdk/issues/983#issuecomment-536813965)).

There are 2 sample apps: 
- `shared-worker` uses a [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) to run a single
instance of Firestore that is shared across tabs.
- `localstorage` uses [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to track and
manage which which tab is allowed to use persistence (only one tab can use persistence at a time).
