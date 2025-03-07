#!/bin/bash
set -e

STATUS=0

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


function runIntegrationTests {
  # Setup local Postgres instance
  upLocalDb
  
  echo "$@"
  # If the test fails, we still want the teardown to run.
  # So we set STATUS to 1 and allow the script to proceed.
  npx jest "$@" --testRegex=\\.integration.test\\.ts$ --runInBand || STATUS=1

  # Teardown local Postgres instance
  downLocalDb
}

function runUnitTests {
  npx jest "$@" --testPathIgnorePatterns="\\.integration\\.test\\.ts$" || STATUS=1
}

function runAllTests {
  
  upLocalDb

  # If the test fails, we still want the teardown to run.
  # So we set STATUS to 1 and allow the script to proceed.
  npx jest "$@" --runInBand || STATUS=1

  # Teardown local DynamoDB instance
  downLocalDb
}

# function runDynamoDBIntegrationTests {
#   # Setup local DynamoDB instance
#   docker compose -f ./docker/admin-user.db.yml up -d 

#   # If the test fails, we still want the teardown to run.
#   # So we set STATUS to 1 and allow the script to proceed.
#   yarn run jest "$@" --testRegex=.*dynamodb\.integration\.test\.ts$ || STATUS=1

#   # Teardown local DynamoDB instance
#   docker-compose -f ./docker/admin-user.db.yml down
# }

# function runNeo4JTests {
#   # Setup local Neo4J instance
#   docker compose -f ./docker/recipe.db.yml up -d 
#   ./scripts/localDb.sh

#   # If the test fails, we still want the teardown to run.
#   # So we set STATUS to 1 and allow the script to proceed.
#   yarn run jest "$@" --testRegex=.*neo4j\.integration\.test\.ts$ || STATUS=1

#   # Teardown local Neo4J instance
#   docker-compose -f ./docker/recipe.db.yml down
# }

if (( "$#" != 0 ))
then
  TEST_TYPE="$1"
  shift
  if [ $TEST_TYPE = "integration" ] 
  then
    runIntegrationTests "$@"
  elif [ $TEST_TYPE = "unit" ] 
  then
    runUnitTests "$@"
  elif [ $TEST_TYPE = "all" ] 
  then
    runAllTests "$@"
  # elif [ $TEST_TYPE = "dynamodb" ] 
  # then
  #   runDynamoDBIntegrationTests "$@"
  # elif [ $TEST_TYPE = "neo4j" ] 
  # then
  #   runNeo4JTests "$@"
  else
    STATUS=1
    echo "Valid values for test type are 'unit', 'integration','all', 'dynamodb' or 'neo4j', but '$TEST_TYPE' was received"
  fi
else
  STATUS=1
  echo "Must pass in an argument for test type ('unit', 'integration', or 'all')"
fi

exit $STATUS