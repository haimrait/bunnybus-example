# Run the following

```
npm run start-docker-rmq
npm run start-docker-dynamodb

# wait 10 sec

npm run start
```

## What to look for

* Look at the `src/plugins/apiPlugin/index.js` and `src/plugins/bunnyBusPlugin/index.js`
* They are wired up to simulate our full plugin
* Look at `src/manifest.js` to see how the plugins are loaded.
* `src/server.js` is the entrypoint