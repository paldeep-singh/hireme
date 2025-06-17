data "aws_ssm_parameter" "vpc_id" {
  name = "vpc_id"
}

data "aws_ssm_parameter" "migrations_subnet_id" {
  name = "migrations_subnet_id"
}

data "aws_ssm_parameter" "vpc_endpoints_security_group_id" {
  name = "vpc_endpoints_security_group_id"
}

# VPC Endpoints for SSM
resource "aws_vpc_endpoint" "ssm" {
  vpc_id            = data.aws_ssm_parameter.vpc_id.value
  service_name      = "com.amazonaws.${var.AWS_REGION}.ssm"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [data.aws_ssm_parameter.migrations_subnet_id.value]


  security_group_ids = [data.aws_ssm_parameter.vpc_endpoints_security_group_id.value]

  private_dns_enabled = true

  tags = {
    Name      = "ssm-endpoint"
    Project   = "hire-me"
    Purpose   = "db-migrations"
    Ephemeral = "true"
  }
}

resource "aws_vpc_endpoint" "ssm_messages" {
  vpc_id            = data.aws_ssm_parameter.vpc_id.value
  service_name      = "com.amazonaws.${var.AWS_REGION}.ssmmessages"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [data.aws_ssm_parameter.migrations_subnet_id.value]

  security_group_ids = [data.aws_ssm_parameter.vpc_endpoints_security_group_id.value]

  private_dns_enabled = true

  tags = {
    Name      = "ssm-messages-endpoint"
    Project   = "hire-me"
    Purpose   = "db-migrations"
    Ephemeral = "true"
  }
}

resource "aws_vpc_endpoint" "ec2_messages" {
  vpc_id            = data.aws_ssm_parameter.vpc_id.value
  service_name      = "com.amazonaws.${var.AWS_REGION}.ec2messages"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [data.aws_ssm_parameter.migrations_subnet_id.value]

  security_group_ids = [data.aws_ssm_parameter.vpc_endpoints_security_group_id.value]

  private_dns_enabled = true

  tags = {
    Name      = "ec2-messages-endpoint"
    Project   = "hire-me"
    Purpose   = "db-migrations"
    Ephemeral = "true"
  }
}

resource "aws_vpc_endpoint" "logs" {
  vpc_id            = data.aws_ssm_parameter.vpc_id.value
  service_name      = "com.amazonaws.${var.AWS_REGION}.logs"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [data.aws_ssm_parameter.migrations_subnet_id.value]

  security_group_ids = [data.aws_ssm_parameter.vpc_endpoints_security_group_id.value]

  private_dns_enabled = true

  tags = {
    Name      = "logs-endpoint"
    Project   = "hire-me"
    Purpose   = "db-migrations"
    Ephemeral = "true"
  }
}

