
resource "aws_ecr_repository" "migration_runner" {
  name = "migration-runner"
}

resource "aws_ecr_lifecycle_policy" "migration_runner" {
  repository = aws_ecr_repository.migration_runner.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Delete untagged images older than 1 day"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_ecr_repository" "hire_me_server" {
    name = "hire_me_server"
}

resource "aws_ecr_lifecycle_policy" "hire_me_server" {
    repository = aws_ecr_repository.hire_me_server.name
    
      policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Delete untagged images older than 1 day"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 1
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}