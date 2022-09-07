### API Keys

To test the example implementation follow the these steps:

1. Add the two key objects to the KV namespace

```
wrangler kv:key put --binding=API_KEYS --preview "7db44309b280823b1c2b8e531b450e411c6efbf878acebcb3dbe4d43c7c6d7d5" --path example/API_KEY/7db44309b280823b1c2b8e531b450e411c6efbf878acebcb3dbe4d43c7c6d7d5.json
```

```
wrangler kv:key put --binding=API_KEYS --preview "dcbc7cf1dd0231b3f3aadc0d980e936e36f207a317e51f02ee6e27ce8b8bbaa9" --path example/API_KEY/dcbc7cf1dd0231b3f3aadc0d980e936e36f207a317e51f02ee6e27ce8b8bbaa9.json
```

2. Add one of these headers in the requests:
   `x-api-key: 68213f71-a06c-4b8e-ab4f-f4a012967b48` (allowed for route `/weather` and `/random-fact`)
   `x-api-key: b8b1b787-21f5-4621-b982-0fbf5d849075` (allowed for `/weather`, `/random-fact` and `json-server` route)
