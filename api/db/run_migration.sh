#!/bin/sh
# Wait for PostgreSQL to be ready
until pg_isready -h db -p 5432 -U myuser; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

echo "PostgreSQL is up! Running Sqitch migrations..."
sqitch deploy db:pg://test_user@db:5432/hire_me_test_db
