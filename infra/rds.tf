variable "db_user" {
  sensitive = true
  type = string
  description = "username for db"
}

variable "db_password" {
  sensitive = true
  type = string
  description = "password for db"
}

resource "aws_db_instance" "hire_me_db" {
  allocated_storage    = 10
  storage_type         = "gp2"
  engine               = "postgres"
  instance_class       = "db.t4g.micro"
  db_name              = "hire_me_db"
  username             = var.db_user
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.rds.name
  multi_az = false

# Delete for actual deployment
  skip_final_snapshot  = true

# Uncomment for actual deployment
#   deletion_protection  = true
#   skip_final_snapshot  = false
#   final_snapshot_identifier = "hire_me_db_final_snapshot"

#   lifecycle {
#     prevent_destroy = true
#   }

    # Attach the DB security group
  vpc_security_group_ids = [aws_security_group.rds.id]  

  tags = {
        Name = "hire_me_db"
  }
}

resource "aws_ssm_parameter" "db_url" {
  name        = "db-url"
  type        = "SecureString"
  value       = "postgres://${aws_db_instance.hire_me_db.username}:${aws_db_instance.hire_me_db.password}@${aws_db_instance.hire_me_db.address}:${aws_db_instance.hire_me_db.port}/${aws_db_instance.hire_me_db.db_name}"
  overwrite   = true
  description = "Postgres connection string for my app"
}


output "rds-endpoint" {
    value = aws_db_instance.hire_me_db.endpoint
}

