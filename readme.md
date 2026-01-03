# Get started

```bash
nvm use
npm install playwright
npx playwright install

npm run s
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

# For Zspace NAS server specific
Clone the project to `/tmp/zfsv3/sata11/<userame>/data/Docker/play-scheduler`, modify `.env` file as you need.

Run:
```bash
# build
docker build -t play-scheduler .

# docker run -d \
#   --name play-scheduler \
#   --env-file .env \
#   --restart unless-stopped \
#   play-scheduler

# make a directory for logs
mkdir -p /tmp/zfsv3/sata11/<userame>/data/Docker/play-scheduler/logs

# set up cron job

*/30 * * * * cd /tmp/zfsv3/sata11/<userame>/data/Docker/play-scheduler && /usr/bin/docker run --rm --env-file .env play-scheduler >> logs/cron.log 2>&1


```


```
*/30 * * * * cd /tmp/zfsv3/sata11/<userame>/data/Docker/play-scheduler && /usr/bin/docker run --rm --env-file .env play-scheduler >> logs/cron.log 2>&1


```