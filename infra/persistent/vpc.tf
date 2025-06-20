# ------------------------------
# VPC
# ------------------------------
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name    = "main-vpc"
    Project = "hire-me"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name    = "main-igw"
    Project = "hire-me"
  }
}

# ------------------------------
# Subnets
# ------------------------------
resource "aws_subnet" "public_alb" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "ap-southeast-2a"
  map_public_ip_on_launch = true

  tags = {
    Name    = "public-alb-subnet"
    Project = "hire-me"
  }
}

resource "aws_subnet" "public_ec2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-southeast-2a"
  map_public_ip_on_launch = true

  tags = {
    Name    = "public-ec2-subnet"
    Project = "hire-me"
  }
}

resource "aws_subnet" "private_rds_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "ap-southeast-2a"

  tags = {
    Name    = "private-rds-subnet-a"
    Project = "hire-me"
  }
}

resource "aws_subnet" "private_rds_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "ap-southeast-2b"

  tags = {
    Name    = "private-rds-subnet-b"
    Project = "hire-me"
  }
}

resource "aws_subnet" "migrations" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "ap-southeast-2a"

  tags = {
    Name    = "migrations-subnet"
    Project = "hire-me"
  }
}

# ------------------------------
# Route Tables
# ------------------------------
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name    = "public-rt"
    Project = "hire-me"
  }
}

resource "aws_route_table_association" "alb" {
  subnet_id      = aws_subnet.public_alb.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "ec2" {
  subnet_id      = aws_subnet.public_ec2.id
  route_table_id = aws_route_table.public.id
}

# ------------------------------
# Security Groups
# ------------------------------

# ALB Security Group — Public Access
resource "aws_security_group" "alb" {
  name        = "alb-sg"
  description = "Allow HTTP/HTTPS from anywhere"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "alb-sg"
    Project = "hire-me"
  }
}

# EC2 Security Group — Only from ALB
resource "aws_security_group" "ec2" {
  name        = "ec2-sg"
  description = "Allow traffic from ALB only"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "From ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "ec2-sg"
    Project = "hire-me"
  }
}

resource "aws_security_group" "migrations" {
  name        = "migrations-sg"
  description = "Security group for CodeBuild to access RDS"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "migrations-sg"
    Project = "hire-me"
  }
}

# RDS Security Group — Only from EC2
resource "aws_security_group" "rds" {
  name        = "rds-sg"
  description = "Allow DB access from EC2"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id, aws_security_group.migrations.id]
    description     = "From EC2"
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "rds-sg"
    Project = "hire-me"
  }
}

# ------------------------------
# DB Subnet Group
# ------------------------------
resource "aws_db_subnet_group" "rds" {
  name = "hire-me-db-subnet-group"
  subnet_ids = [
    aws_subnet.private_rds_a.id,
    aws_subnet.private_rds_b.id
  ]

  tags = {
    Name    = "rds-subnet-group"
    Project = "hire-me"
  }
}

# Security group for VPC endpoints
resource "aws_security_group" "vpc_endpoints" {
  name        = "vpc-endpoints-sg"
  description = "Security group for VPC endpoints"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.migrations.id]
  }

  tags = {
    Name    = "vpc-endpoints-sg"
    Project = "hire-me"
  }
}
