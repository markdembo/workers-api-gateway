### API Keys

To test the example implementation follow the these steps:

1. Add a key object to the KV namespace

```
wrangler kv:key put --binding=API_KEYS --preview "7db44309b280823b1c2b8e531b450e411c6efbf878acebcb3dbe4d43c7c6d7d5" --path example/API_KEY/7db44309b280823b1c2b8e531b450e411c6efbf878acebcb3dbe4d43c7c6d7d5.json
```

2. Add this header in the requests: `x-api-key: 68213f71-a06c-4b8e-ab4f-f4a012967b48`
