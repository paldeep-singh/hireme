function upLocalDb {
  docker compose -f ./docker/test.db.yml up -d 
  
  # Wait for migrations to finish.
  while docker ps --filter "name=sqitch_migrator" --filter "status=running" | grep -q sqitch_migrator; do
    echo "Database migrations in progress, waiting..."
    sleep 2
  done
}

function downLocalDb {
  docker compose -f ./docker/test.db.yml down -v
}

downLocalDb

upLocalDb

pnpm tsx ./scripts/seedTestDb.ts

pnpm tsx watch ./src/index.ts