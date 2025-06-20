resource "aws_iam_role" "codebuild_db_migrations_role" {
  name = "codebuild-db-migrations-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "codebuild_db_migrations_policy" {
  name = "codebuild-db-migrations-policy"
  role = aws_iam_role.codebuild_db_migrations_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters"
        ]
        Resource = [
          aws_ssm_parameter.db_url.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeDhcpOptions",
          "ec2:CreateNetworkInterface",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeVpcs"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterfacePermission"
        ]
        Resource = "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:network-interface/*"
        Condition = {
          StringEquals = {
            "ec2:Subnet" = [
              aws_subnet.migrations.arn
            ],
            "ec2:AuthorizedService" = "codebuild.amazonaws.com"
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = [
          aws_ecr_repository.db_migrations_runner.arn
        ]
      }
    ]
  })
}

resource "aws_codebuild_project" "db_migrations" {
  name         = "db-migrations"
  description  = "Run Sqitch database migrations"
  service_role = aws_iam_role.codebuild_db_migrations_role.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    type                        = "LINUX_CONTAINER"
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "${aws_ecr_repository.db_migrations_runner.repository_url}:latest"
    image_pull_credentials_type = "SERVICE_ROLE"
    privileged_mode             = true

    environment_variable {
      name  = "DB_URL"
      value = "db-url"
      type  = "PARAMETER_STORE"
    }
  }

  source {
    type      = "NO_SOURCE"
    buildspec = <<-EOT
      version: 0.2
      phases:
        build:
          commands:
            - cd /migrations
            - sqitch deploy -t "$DB_URL"
    EOT
  }

  vpc_config {
    vpc_id             = aws_vpc.main.id
    subnets            = [aws_subnet.migrations.id]
    security_group_ids = [aws_security_group.migrations.id]
  }

  logs_config {
    cloudwatch_logs {
      group_name = "/aws/codebuild/db-migrations"
    }
  }
}
