variable "db_user" {
  sensitive   = true
  type        = string
  description = "username for db"
}

variable "db_password" {
  sensitive   = true
  type        = string
  description = "password for db"
}

resource "aws_db_instance" "hire_me_db" {
  identifier           = "hire-me-db"
  allocated_storage    = 10
  storage_type         = "gp2"
  engine               = "postgres"
  instance_class       = "db.t4g.micro"
  db_name              = "hire_me_db"
  username             = var.db_user
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.rds.name
  multi_az             = false

  # Delete for actual deployment
  # skip_final_snapshot  = true

  # Uncomment for actual deployment
  deletion_protection       = true
  skip_final_snapshot       = false
  final_snapshot_identifier = "hire-me-db-final-snapshot"

  lifecycle {
    prevent_destroy = true
  }

  # Attach the DB security group
  vpc_security_group_ids = [aws_security_group.rds.id]

  tags = {
    Name = "hire_me_db"
  }
}
