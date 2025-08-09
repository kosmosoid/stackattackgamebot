#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "postgres"  <<-EOSQL
  CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
  ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
  CREATE DATABASE ${DB_NAME};
  GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO "${DB_USER}";
EOSQL

psql -U${DB_USER} -d ${DB_NAME} -f /docker-entrypoint-initdb.d/sqls/schema.sql
