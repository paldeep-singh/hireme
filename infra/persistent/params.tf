
resource "aws_ssm_parameter" "db_url" {
  name        = "db-url"
  type        = "SecureString"
  value       = "postgres://${aws_db_instance.hire_me_db.username}:${aws_db_instance.hire_me_db.password}@${aws_db_instance.hire_me_db.address}:${aws_db_instance.hire_me_db.port}/${aws_db_instance.hire_me_db.db_name}"
  overwrite   = true
  description = "Postgres connection string for my app"
}

resource "aws_ssm_parameter" "vpc_id" {
  name        = "vpc_id"
  type        = "SecureString"
  value       = aws_vpc.main.id
  overwrite   = true
  description = "Hire me VPC id"
}

resource "aws_ssm_parameter" "migrations_subnet_id" {
  name        = "migrations_subnet_id"
  type        = "SecureString"
  value       = aws_subnet.migrations.id
  overwrite   = true
  description = "Hire me migrations subnet id"
}

resource "aws_ssm_parameter" "vpc_endpoints_security_group_id" {
  name        = "vpc_endpoints_security_group_id"
  type        = "SecureString"
  value       = aws_security_group.vpc_endpoints.id
  overwrite   = true
  description = "VPC endpoints security group id"
}

resource "aws_ssm_parameter" "acm_cert_id" {
  name        = "hire-me-acm-cert-id"
  type        = "String"
  value       = "25e024ec-f1ad-499f-92d0-43ba1eb80ff9"
  overwrite   = false
  description = "ID for domain acm cert"
}
