```bash
# create bastion EC2 in public subnet with a bastion security group
# TODO: I don't have a bastion group yet, so using ServiceSecurityGroup
# (TODO EC2 creation, save in BASTION_INSTANCE_ID)

# Locally, forward your RDS's 5432 port to some LOCAL_PORT
ssh -N -L $LOCAL_PORT:$RDS_URL:5432 -i ~/.ssh/my-key.pem ec2-user@$BASTION_PUBLIC_IP

# Get the secret from Secrets Manager, and use it to fill in password
# in ~/.pgpass -- make sure to chmod this file.
echo "localhost:$LOCAL_PORT:$DB_NAME:$POSTGRES_USER:$PGPASSWORD" >> ~/.pgpass
chmod 0600 ~/.pgpass

# If you want to log in to psql:
psql -h localhost -p $LOCAL_PORT -U $POSTGRES_USER $DB_NAME
# (or just run a command with -c)
# It should not prompt you for password if .pgpass is set up correctly.

# Do migrations, etc
# NOTE: need to have env vars PGPORT, PGDATABASE, and PGUSER set for knex bc knex production config intentionally doesn't define them
cd path/to/api-server
PGPORT=$LOCAL_PORT PGDATABASE=$DB_NAME PGUSER=$POSTGRES_USER npx knex migrate:latest --knexfile src/knex-cli/knexfile.ts --env production

# Terminate bastion
aws ec2 terminate-instances --instance-ids $BASTION_INSTANCE_ID
```
