#!/bin/sh
# Restore THIS application's database and media from deploy/backup.sh output.
#   deploy/restore.sh backups/materials-db-<ts>.dump backups/materials-media-<ts>.tar.gz
#
# DESTRUCTIVE for this application only: replaces the karivex-materials
# database contents and media volume. Take a fresh backup first. It never
# touches other applications' containers or volumes.
set -eu

DB_DUMP="$1"
MEDIA_TAR="$2"
COMPOSE="docker compose -f deploy/docker-compose.prod.yml --env-file .env.production"

printf 'Restore %s and %s into karivex-materials? Type RESTORE: ' "$DB_DUMP" "$MEDIA_TAR"
read -r answer
[ "$answer" = "RESTORE" ] || { echo "Aborted."; exit 1; }

$COMPOSE stop frontend backend
$COMPOSE exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner' < "$DB_DUMP"
docker run --rm -v karivex_materials_media:/media -v "$(cd "$(dirname "$MEDIA_TAR")" && pwd)":/backup alpine \
  sh -c "find /media -mindepth 1 -delete && tar xzf /backup/$(basename "$MEDIA_TAR") -C /media"
$COMPOSE start backend frontend
echo "Restore complete. Check https://materials.karivexsolutionsltd.com/healthz"
