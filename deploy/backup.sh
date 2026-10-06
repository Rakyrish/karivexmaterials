#!/bin/sh
# Back up THIS application's database and uploaded media only.
#   deploy/backup.sh [backup-dir]      (run from the repo root on the server)
# Produces <dir>/materials-db-<ts>.dump (pg_dump custom format) and
# <dir>/materials-media-<ts>.tar.gz. Copy them off the server afterwards.
set -eu

COMPOSE="docker compose -f deploy/docker-compose.prod.yml --env-file .env.production"
DIR="${1:-./backups}"
TS="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DIR"

$COMPOSE exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "$DIR/materials-db-$TS.dump"
docker run --rm -v karivex_materials_media:/media:ro -v "$(cd "$DIR" && pwd)":/backup alpine \
  tar czf "/backup/materials-media-$TS.tar.gz" -C /media .

echo "Wrote $DIR/materials-db-$TS.dump and $DIR/materials-media-$TS.tar.gz"
