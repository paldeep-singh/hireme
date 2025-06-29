resource "aws_iam_role" "ci_permissions_admin" {
  name = "hire-me-ci-permissions-admin"

  assume_role_policy = jsonencode(({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Federated" : "arn:aws:iam::${var.AWS_ACCOUNT_ID}:oidc-provider/app.terraform.io"
        },
        "Action" : "sts:AssumeRoleWithWebIdentity",
        "Condition" : {
          "StringEquals" : {
            "app.terraform.io:aud" : "aws.workload.identity"
          },
          "StringLike" : {
            "app.terraform.io:sub" : "organization:paldeep:project:hire-me:workspace:ci-permissions:run_phase:*"
          }
        }
      }
    ]
  }))
}

resource "aws_iam_role" "deployment_admin" {
  name = "hire-me-deployment-admin"

  assume_role_policy = jsonencode(({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Federated" : "arn:aws:iam::${var.AWS_ACCOUNT_ID}:oidc-provider/app.terraform.io"
        },
        "Action" : "sts:AssumeRoleWithWebIdentity",
        "Condition" : {
          "StringEquals" : {
            "app.terraform.io:aud" : "aws.workload.identity"
          },
          "StringLike" : {
            "app.terraform.io:sub" : "organization:paldeep:project:hire-me:workspace:deployment:run_phase:*"
          }
        }
      }
    ]
  }))
}

resource "aws_iam_role" "db_migrations_admin" {
  name = "hire-me-db-migrations-admin"

  assume_role_policy = jsonencode(({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Federated" : "arn:aws:iam::${var.AWS_ACCOUNT_ID}:oidc-provider/app.terraform.io"
        },
        "Action" : "sts:AssumeRoleWithWebIdentity",
        "Condition" : {
          "StringEquals" : {
            "app.terraform.io:aud" : "aws.workload.identity"
          },
          "StringLike" : {
            "app.terraform.io:sub" : "organization:paldeep:project:hire-me:workspace:db-migrations:run_phase:*"
          }
        }
      }
    ]
  }))
}

resource "aws_iam_role" "db_migrations_github_action" {
  name = "hire-me-db-migrations-github-action"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:paldeep-singh/hireme:workflow_ref:paldeep-singh/hireme/.github/workflows/migrations.yml@*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role" "api_server_deployment_github_action" {
  name = "hire-me-api-server-deployment-github-action"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:paldeep-singh/hireme:workflow_ref:paldeep-singh/hireme/.github/workflows/deploy-api-server.yml*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role" "jobs_dashboard_deployment_github_action" {
  name = "hire-me-jobs-dashboard-deployment-github-action"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:paldeep-singh/hireme:workflow_ref:paldeep-singh/hireme/.github/workflows/deploy-dashboard.yml*"
          }
        }
      }
    ]
  })
}
