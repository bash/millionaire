#!/bin/sh

redis-cli --raw KEYS "*" | xargs redis-cli DEL

psql postgres postgres -f data/schema.sql
psql postgres postgres -f data/questions.sql
psql postgres postgres -f data/users.sql
