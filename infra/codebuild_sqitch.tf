resource "aws_iam_role" "codebuild_sqitch_role" {
  name = "codebuild-sqitch-role"

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

resource "aws_iam_role_policy" "codebuild_sqitch_policy" {
  name = "codebuild-sqitch-policy"
  role = aws_iam_role.codebuild_sqitch_role.id

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
        Resource = "arn:aws:ec2:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:network-interface/*"
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
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_ecr_repository" "migration_runner" {
  name = "migration-runner"
}

resource "aws_codebuild_project" "sqitch_migrations" {
  name          = "sqitch-migrations"
  description   = "Run Sqitch database migrations"
  service_role  = aws_iam_role.codebuild_sqitch_role.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    type                        = "LINUX_CONTAINER"
    compute_type               = "BUILD_GENERAL1_SMALL"
    image                      = "${aws_ecr_repository.migration_runner.repository_url}:latest"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode            = true

    environment_variable {
      name  = "DB_URL"
      value = "db-url"
      type  = "PARAMETER_STORE"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/paldeep-singh/hireme.git"
    git_clone_depth = 1
    buildspec       = "apps/api/db/buildspec.yml"
  }

  vpc_config {
    vpc_id             = aws_vpc.main.id
    subnets            = [aws_subnet.migrations.id]
    security_group_ids = [aws_security_group.codebuild.id]
  }

  logs_config {
    cloudwatch_logs {
      group_name = "/aws/codebuild/sqitch-migrations"
    }
  }
}

resource "aws_security_group" "codebuild" {
  name        = "codebuild-sg"
  description = "Security group for CodeBuild to access RDS"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "codebuild-sg"
  }
}

# Allow CodeBuild to access RDS
resource "aws_security_group_rule" "codebuild_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.codebuild.id
  security_group_id        = aws_security_group.rds.id
  description              = "Allow CodeBuild to access RDS"
}

resource "aws_iam_role" "github_actions_role" {
  name = "github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:paldeep-singh/hireme:*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "github_actions_policy" {
  name = "github-actions-policy"
  role = aws_iam_role.github_actions_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "codebuild:StartBuild",
          "codebuild:BatchGetBuilds"
        ]
        Resource = aws_codebuild_project.sqitch_migrations.arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:GetLogEvents"
        ]
        Resource = [
          "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/codebuild/sqitch-migrations:*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = [
          aws_ecr_repository.migration_runner.arn
        ]
      }
    ]
  })
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}