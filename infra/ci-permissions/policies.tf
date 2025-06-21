resource "aws_iam_role_policy" "ci_permissions_admin_policy" {
  name = "hire-me-ci-permissions-admin-policy"
  role = aws_iam_role.ci_permissions_admin.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "iam:AttachRolePolicy",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:DeleteRolePolicy",
          "iam:DetachRolePolicy",
          "iam:GetRole",
          "iam:GetRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole",
          "iam:ListRolePolicies",
          "iam:ListRoleTags",
          "iam:PutRolePolicy",
          "iam:TagRole",
          "iam:UntagRole",
          "iam:UpdateAssumeRolePolicy",
          "iam:UpdateRole"
        ],
        "Resource" : [
          aws_iam_role.ci_permissions_admin.arn,
          aws_iam_role.deployment_admin.arn,
          aws_iam_role.db_migrations_admin.arn,
          aws_iam_role.db_migrations_github_action.arn,
          aws_iam_role.api_server_deployment_github_action.arn
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : "iam:ListRoles",
        "Resource" : "*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "db_migrations_admin_policy" {
  name = "hire-me-db-migrations-admin-policy"
  role = aws_iam_role.db_migrations_admin.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:GetParameter",
        ],
        "Resource" : [
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/vpc_id",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/migrations_subnet_id",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/vpc_endpoints_security_group_id"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateTags",
          "ec2:CreateVpcEndpoint"
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc-endpoint/*",
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:RequestTag/Project" : "hire-me",
            "aws:RequestTag/Purpose" : "db-migrations",
            "aws:RequestTag/Ephemeral" : "true"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:DeleteVpcEndpoints"
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc-endpoint/*",
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me",
            "aws:ResourceTag/Purpose" : "db-migrations",
            "aws:ResourceTag/Ephemeral" : "true"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateVpcEndpoint",
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:security-group/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me",
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:DescribePrefixLists",
          "ec2:DescribeVpcEndpoints"
        ],
        "Resource" : "*",
        "Condition" : {
          "StringEquals" : {
            "ec2:Region" : "${var.AWS_REGION}",
          }
        }
      }
    ]
  })
}


resource "aws_iam_role_policy" "deployment_admin_policy" {
  name = "hire-me-deployment-admin-policy"
  role = aws_iam_role.deployment_admin.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateVpc",
          "ec2:CreateTags",
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:RequestTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateInternetGateway",
          "ec2:CreateTags",
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:internet-gateway/*",
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:RequestTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateSecurityGroup",
          "ec2:CreateSubnet",
          "ec2:CreateRouteTable"
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateSubnet",
          "ec2:CreateTags",
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:RequestTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateRouteTable",
          "ec2:CreateTags",
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:route-table/*",
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:RequestTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateRoute",
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:route-table/*",
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:CreateSecurityGroup",
          "ec2:CreateTags",
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:security-group/*",
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:RequestTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "rds:AddTagsToResource",
          "rds:CreateDBSubnetGroup",
          "rds:DeleteDBSubnetGroup",
          "rds:DescribeDBSubnetGroups",
          "rds:ListTagsForResource"
        ],
        "Resource" : [
          "arn:aws:rds:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subgrp:hire-me-db-subnet-group",
        ],
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:ModifySubnetAttribute"
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:RevokeSecurityGroupEgress",
          "ec2:AuthorizeSecurityGroupEgress",
          "ec2:AuthorizeSecurityGroupIngress",
          "ec2:RevokeSecurityGroupIngress"
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:security-group/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:AttachInternetGateway"
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:internet-gateway/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:AssociateRouteTable"
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:internet-gateway/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:route-table/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:DeleteInternetGateway",
          "ec2:DeleteRouteTable",
          "ec2:DeleteSecurityGroup",
          "ec2:DeleteSubnet",
          "ec2:DeleteVpc",
          "ec2:DescribeVpcAttribute",
          "ec2:DetachInternetGateway",
          "ec2:DisassociateRouteTable",
          "ec2:ModifyVpcAttribute"
        ],
        "Resource" : [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:internet-gateway/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:route-table/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:security-group/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:DescribeAccountAttributes",
          "ec2:DescribeInternetGateways",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DescribeRouteTables",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeSubnets",
          "ec2:DescribeVpcClassicLink",
          "ec2:DescribeVpcClassicLinkDnsSupport",
          "ec2:DescribeVpcs",
          "ssm:DescribeParameters"
        ],
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "rds:CreateDBInstance"
        ],
        "Resource" : [
          "arn:aws:rds:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:db:hire-me-db",
          "arn:aws:rds:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subgrp:hire-me-db-subnet-group"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "rds:AddTagsToResource",
          "rds:CreateTenantDatabase",
          "rds:DeleteDBInstance",
          "rds:DescribeDBInstances"
        ],
        "Resource" : "arn:aws:rds:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:db:hire-me-db"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:AddTagsToResource",
          "ssm:DeleteParameter",
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:ListTagsForResource",
          "ssm:PutParameter"
        ],
        "Resource" : [
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/db-url",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/vpc_id",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/migrations_subnet_id",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/vpc_endpoints_security_group_id",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/hire-me-acm-cert-id"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "codebuild:BatchGetProjects",
          "codebuild:CreateProject",
          "codebuild:DeleteProject",
          "codebuild:UpdateProject"
        ],
        "Resource" : [
          "arn:aws:codebuild:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:project/db-migrations"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ecr:CreateRepository",
          "ecr:DescribeRepositories",
          "ecr:DeleteLifecyclePolicy",
          "ecr:DeleteRepository",
          "ecr:GetLifecyclePolicy",
          "ecr:ListTagsForResource",
          "ecr:PutLifecyclePolicy",
          "ecr:TagResource"
        ],
        "Resource" : [
          "arn:aws:codebuild:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:project/db-migrations",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/codebuild-db-migrations-role",
          "arn:aws:ecr:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:repository/db-migrations-runner",
          "arn:aws:ecr:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:repository/hire-me-api-server",

        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "codebuild:BatchGetProjects",
          "ecr:PutLifecyclePolicy",
          "ecr:CreateRepository",
          "ecr:ListTagsForResource",
          "ecr:DeleteLifecyclePolicy",
          "codebuild:UpdateProject",
          "codebuild:CreateProject",
          "ecr:DeleteRepository",
          "iam:PassRole",
          "ecr:TagResource",
          "codebuild:DeleteProject",
          "ecr:DescribeRepositories",
          "ecr:GetLifecyclePolicy"
        ],
        "Resource" : [
          "arn:aws:codebuild:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:project/db-migrations",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/codebuild-db-migrations-role",
          "arn:aws:ecr:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:repository/db-migrations-runner"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "iam:AttachRolePolicy",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:DeleteRolePolicy",
          "iam:DetachRolePolicy",
          "iam:GetRole",
          "iam:GetRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole",
          "iam:ListRolePolicies",
          "iam:PutRolePolicy",
          "iam:PassRole"
        ],
        "Resource" : [
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/codebuild-db-migrations-role",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/api-server-ssm-role",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/hire-me-api-server-ssm-patch-role"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "iam:CreateInstanceProfile",
          "iam:DeleteInstanceProfile",
          "iam:GetInstanceProfile",
          "iam:AddRoleToInstanceProfile",
          "iam:RemoveRoleFromInstanceProfile"
        ],
        "Resource" : [
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:instance-profile/hire-me-api-server-profile"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "elasticloadbalancing:AddTags",
          "elasticloadbalancing:CreateListener",
          "elasticloadbalancing:CreateLoadBalancer",
          "elasticloadbalancing:DeleteLoadBalancer",
          "elasticloadbalancing:ModifyLoadBalancerAttributes",
          "elasticloadbalancing:SetSecurityGroups"
        ],
        "Resource" : [
          "arn:aws:elasticloadbalancing:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:loadbalancer/app/hire-me-api-alb/*"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "elasticloadbalancing:DeleteListener",
        ],
        "Resource" : [
          "arn:aws:elasticloadbalancing:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:listener/app/hire-me-api-alb/*"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "elasticloadbalancing:CreateTargetGroup",
          "elasticloadbalancing:DeleteTargetGroup",
          "elasticloadbalancing:ModifyTargetGroupAttributes"
        ],
        "Resource" : [
          "arn:aws:elasticloadbalancing:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:targetgroup/hire-me-alb-target-group/*"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "elasticloadbalancing:DescribeListeners",
          "elasticloadbalancing:DescribeLoadBalancers",
          "elasticloadbalancing:DescribeLoadBalancerAttributes",
          "elasticloadbalancing:DescribeTags",
          "elasticloadbalancing:DescribeTargetGroups",
          "elasticloadbalancing:DescribeTargetGroupAttributes",
          "ssm:DescribePatchGroups",
        ],
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "iam:CreateServiceLinkedRole"
        ],
        "Resource" : [
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:CreatePatchBaseline",
          "ssm:CreateMaintenanceWindow",
        ],
        "Resource" : "*",
        "Condition" : {
          "StringEquals" : {
            "aws:RequestTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:DeleteMaintenanceWindow",
          "ssm:DeletePatchBaseline",
          "ssm:DeregisterPatchBaselineForPatchGroup",
          "ssm:DescribeMaintenanceWindowTargets",
          "ssm:GetMaintenanceWindow",
          "ssm:GetPatchBaseline",
          "ssm:RegisterPatchBaselineForPatchGroup",
          "ssm:RegisterTargetWithMaintenanceWindow"
        ],
        "Resource" : "*",
        "Condition" : {
          "StringEquals" : {
            "aws:ResourceTag/Project" : "hire-me"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:DeregisterTargetFromMaintenanceWindow",
          "ssm:DeregisterTaskFromMaintenanceWindow",
          "ssm:RegisterTaskWithMaintenanceWindow"
        ],
        "Resource" : [
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:maintenancewindow/*",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:windowtask/*"
        ],
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:AddTagsToResource",
          "ssm:ListTagsForResource"
        ],
        "Resource" : [
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:patchbaseline/*",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:maintenancewindow/*"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "ssm:GetMaintenanceWindowTask",
        ],
        "Resource" : [
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:maintenancewindow/*",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:windowtask/*"
        ]
      }
    ]
  })
}


resource "aws_iam_role_policy" "db_migrations_github_action_policy" {
  name = "hire-me-db-migrations-github-action-policy"
  role = aws_iam_role.db_migrations_github_action.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "codebuild:BatchGetBuilds",
          "codebuild:StartBuild"
        ]
        Resource = "arn:aws:codebuild:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:project/db-migrations"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:GetLogEvents"
        ]
        Resource = [
          "arn:aws:logs:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:log-group:/aws/codebuild/db-migrations:*"
        ]
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
          "ecr:BatchDeleteImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeImages",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart"
        ]
        Resource = [
          "arn:aws:ecr:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:repository/db-migrations-runner"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "api_server_deployment_github_action_policy" {
  name = "hire-me-api-server-deployment-github-action-policy"
  role = aws_iam_role.api_server_deployment_github_action.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
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
          "ecr:BatchDeleteImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeImages",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart"
        ]
        Resource = [
          "arn:aws:ecr:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:repository/hire-me-api-server"
        ]
      }
    ]
  })
}

