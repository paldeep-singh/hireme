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

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "my-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet.id, aws_subnet.private_subnet_2.id]  #if multi AZ add another subnet
}

resource "aws_security_group" "sg_for_rds" {
  name        = "my-db-sg"
  vpc_id = aws_vpc.my_vpc.id
  ingress {
    from_port   = 5432  # Postgres port
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.sg_for_ec2.id]
  }
}

resource "aws_db_instance" "my_db_instance" {
  allocated_storage    = 10
  storage_type         = "gp2"
  engine               = "postgres"
  instance_class       = "db.t4g.micro"
  db_name              = "hire_me_db"
  username             = var.db_user
  password             = var.db_password
  skip_final_snapshot  = true
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  multi_az = false

    # Attach the DB security group
  vpc_security_group_ids = [aws_security_group.sg_for_rds.id]  
    tags = {
        Name = "ec2_to_postgres_rds"
    }
}

# resource "aws_security_group_rule" "ec2_to_db" {
#   type        = "ingress"
#   from_port   = 3306  # MySQL port
#   to_port     = 3306
#   protocol    = "tcp"
#   security_group_id = aws_security_group.sg_for_rds.id  # RDS security group
#   source_security_group_id = aws_security_group.sg_for_ec2.id # EC2 security group
# }

output "rds-endpoint" {
    value = aws_db_instance.my_db_instance.endpoint
}

