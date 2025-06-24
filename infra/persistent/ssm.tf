resource "aws_iam_role" "api_server_ssm_role" {
  name = "api-server-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_attach" {
  role       = aws_iam_role.api_server_ssm_role.id
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ecr_attach" {
  role       = aws_iam_role.api_server_ssm_role.id
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}


# ----------------------------------------
# Patch Baseline
# ----------------------------------------
resource "aws_ssm_patch_baseline" "linux_baseline" {
  name             = "AmazonLinux2023Baseline"
  operating_system = "AMAZON_LINUX_2023"
  description      = "Baseline for Amazon Linux 2023 with different severities"

  # Rule for critical security patches (faster approval)
  approval_rule {
    approve_after_days = 1

    patch_filter {
      key    = "PRODUCT"
      values = ["AmazonLinux2023"]
    }

    patch_filter {
      key    = "SEVERITY"
      values = ["Critical"]
    }

    patch_filter {
      key    = "CLASSIFICATION"
      values = ["Security"]
    }
  }

  # Rule for medium+ security patches
  approval_rule {
    approve_after_days = 3

    patch_filter {
      key    = "PRODUCT"
      values = ["AmazonLinux2023"]
    }

    patch_filter {
      key    = "SEVERITY"
      values = ["Important", "Medium"]
    }

    patch_filter {
      key    = "CLASSIFICATION"
      values = ["Security"]
    }
  }

  # Rule for non-security patches
  approval_rule {
    approve_after_days  = 7
    enable_non_security = true

    patch_filter {
      key    = "PRODUCT"
      values = ["AmazonLinux2023"]
    }

    patch_filter {
      key    = "CLASSIFICATION"
      values = ["Bugfix", "Enhancement", "Recommended"]
    }
  }

  tags = {
    Name    = "hire-me-api-patch-baseline"
    Project = "hire-me"
  }
}

# ----------------------------------------
# Patch Group Tag (match on EC2 instances)
# ----------------------------------------
resource "aws_ssm_patch_group" "patch_group" {
  baseline_id = aws_ssm_patch_baseline.linux_baseline.id
  patch_group = "api-server-patch-group"
}


# ----------------------------------------
# Maintenance Window
# ----------------------------------------
resource "aws_ssm_maintenance_window" "patch_window" {
  name     = "api-server-daily-patch-window"
  schedule = "cron(0 16 * * ? *)" # 3:00 AM AEST / 4:00 AM AEDT
  duration = 2                    # 2 hours max
  cutoff   = 1                    # Stop new tasks 1 hour before end
  # allow_unassociated_targets = true #Do I need this?

  tags = {
    Name    = "hire-me-api-server-maintenance-window"
    Project = "hire-me"
  }
}

# ----------------------------------------
# Maintenance Window Target
# ----------------------------------------
resource "aws_ssm_maintenance_window_target" "api_server_target" {
  window_id     = aws_ssm_maintenance_window.patch_window.id
  resource_type = "INSTANCE"
  targets {
    key    = "tag:PatchGroup"
    values = ["api-server-patch-group"]
  }
  name = "api-server-maintenance-window-target"
}

# ----------------------------------------
# Maintenance Window Task (Install Patches)
# ----------------------------------------
resource "aws_ssm_maintenance_window_task" "install_patches" {
  window_id        = aws_ssm_maintenance_window.patch_window.id
  task_arn         = "AWS-RunPatchBaseline"
  task_type        = "RUN_COMMAND"
  priority         = 1
  max_concurrency  = "1"
  max_errors       = "1"
  service_role_arn = aws_iam_role.ssm_maintenance_role.arn

  targets {
    key    = "WindowTargetIds"
    values = [aws_ssm_maintenance_window_target.api_server_target.id]
  }

  task_invocation_parameters {
    run_command_parameters {
      parameter {
        name   = "Operation"
        values = ["Install"]
      }

      parameter {
        name   = "RebootOption"
        values = ["RebootIfNeeded"]
      }
    }
  }
}

# ----------------------------------------
# IAM Role for Patch Manager
# ----------------------------------------
resource "aws_iam_role" "ssm_maintenance_role" {
  name = "hire-me-api-server-ssm-patch-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ssm.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_patch_attachment" {
  role       = aws_iam_role.ssm_maintenance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonSSMMaintenanceWindowRole"
}
