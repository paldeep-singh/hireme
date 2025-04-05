while docker ps --filter "name=sqitch_migrator" --filter "status=running" | grep -q sqitch_migrator; do
    echo "Database migrations in progress, waiting..."
    sleep 2
done

echo "Migration completed, verifying"
echo "$PWD"
cd db
# We use deploy since we we verify on deployment anyway.
# In CI, migrations won't be automatically applied to the
# PG docker container since that would make it impossible to 
# verify if deployment is rolled back due to failed verification.
sqitch deploy -t hire_me_test_db