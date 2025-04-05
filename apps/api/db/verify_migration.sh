while docker ps --filter "name=sqitch_migrator" --filter "status=running" | grep -q sqitch_migrator; do
    echo "Database migrations in progress, waiting..."
    sleep 2
done

echo "Migration completed, verifying"
echo "$PWD"
cd db
sqitch verify -t hire_me_test_db