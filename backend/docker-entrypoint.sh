#!/bin/sh
# Applies migrations (never resets data), refreshes permission groups and,
# if RUN_SEED=true, creates any missing catalogue records without
# overwriting admin edits. Then starts the web server.
set -e

python manage.py migrate --noinput
python manage.py createcachetable
python manage.py setup_groups

if [ "${RUN_SEED:-true}" = "true" ]; then
  python manage.py seed_catalog
fi

exec "$@"
