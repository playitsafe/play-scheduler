# Get started

```bash
nvm use
npm install playwright
npx playwright install
```

# Buid docker image and run
```bash
# build
docker build -t play-scheduler .

# run
docker run --rm \
  --env-file .env \
  play-scheduler
```