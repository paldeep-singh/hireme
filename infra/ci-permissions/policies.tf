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
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "iam:CreatePolicy",
          "iam:CreatePolicyVersion",
          "iam:DeletePolicy",
          "iam:DeletePolicyVersion",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:ListPolicyVersions"
        ],
        "Resource" : [
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-networking",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-rds",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-ssm",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-ecr-codebuild",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-iam",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-elb-ecs",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-autoscaling",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-s3",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:policy/hire-me-deployment-admin-cloudwatch"
        ]
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

resource "aws_iam_policy" "deployment_admin_networking" {
  name = "hire-me-deployment-admin-networking"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ec2:CreateVpc",
          "ec2:CreateTags"
        ],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*"],
        Condition = {
          StringEquals = {
            "aws:RequestTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "ec2:CreateInternetGateway",
          "ec2:CreateTags"
        ],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:internet-gateway/*"],
        Condition = {
          StringEquals = {
            "aws:RequestTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "ec2:CreateSecurityGroup",
          "ec2:CreateSubnet",
          "ec2:CreateRouteTable"
        ],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*"],
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "ec2:CreateSubnet",
          "ec2:CreateTags"
        ],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*"],
        Condition = {
          StringEquals = {
            "aws:RequestTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "ec2:CreateRouteTable",
          "ec2:CreateTags"
        ],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:route-table/*"],
        Condition = {
          StringEquals = {
            "aws:RequestTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect   = "Allow",
        Action   = ["ec2:CreateRoute"],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:route-table/*"],
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect   = "Allow",
        Action   = ["ec2:CreateSecurityGroup", "ec2:CreateTags"],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:security-group/*"],
        Condition = {
          StringEquals = {
            "aws:RequestTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect   = "Allow",
        Action   = ["ec2:ModifySubnetAttribute"],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*"],
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "ec2:RevokeSecurityGroupEgress",
          "ec2:AuthorizeSecurityGroupEgress",
          "ec2:AuthorizeSecurityGroupIngress",
          "ec2:RevokeSecurityGroupIngress"
        ],
        Resource = ["arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:security-group/*"],
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = ["ec2:AttachInternetGateway"],
        Resource = [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:internet-gateway/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*"
        ],
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = ["ec2:AssociateRouteTable"],
        Resource = [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:internet-gateway/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:route-table/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*"
        ],
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
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
        Resource = [
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:internet-gateway/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:vpc/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:route-table/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:security-group/*",
          "arn:aws:ec2:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subnet/*"
        ],
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "ec2:DescribeAccountAttributes",
          "ec2:DescribeImages",
          "ec2:DescribeInternetGateways",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DescribeRouteTables",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeSubnets",
          "ec2:DescribeVpcClassicLink",
          "ec2:DescribeVpcClassicLinkDnsSupport",
          "ec2:DescribeVpcs"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "deployment_admin_rds" {
  name = "hire-me-deployment-admin-rds"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "rds:AddTagsToResource",
          "rds:CreateDBSubnetGroup",
          "rds:DeleteDBSubnetGroup",
          "rds:DescribeDBSubnetGroups",
          "rds:ListTagsForResource"
        ],
        Resource = ["arn:aws:rds:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subgrp:hire-me-db-subnet-group"]
      },
      {
        Effect = "Allow",
        Action = ["rds:CreateDBInstance"],
        Resource = [
          "arn:aws:rds:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:db:hire-me-db",
          "arn:aws:rds:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:subgrp:hire-me-db-subnet-group"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "rds:AddTagsToResource",
          "rds:CreateTenantDatabase",
          "rds:DeleteDBInstance",
          "rds:DescribeDBInstances"
        ],
        Resource = ["arn:aws:rds:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:db:hire-me-db"]
      }
    ]
  })
}

resource "aws_iam_policy" "deployment_admin_ssm" {
  name = "hire-me-deployment-admin-ssm"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ssm:AddTagsToResource",
          "ssm:DeleteParameter",
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:ListTagsForResource",
          "ssm:PutParameter"
        ],
        Resource = [
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/db-url",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/vpc_id",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/migrations_subnet_id",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/vpc_endpoints_security_group_id",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/hire-me-acm-cert-id"
        ]
      },
      {
        Effect   = "Allow",
        Action   = ["ssm:DescribeParameters", "ssm:DescribePatchGroups"],
        Resource = "*"
      },
      {
        Effect   = "Allow",
        Action   = ["ssm:CreatePatchBaseline", "ssm:CreateMaintenanceWindow"],
        Resource = "*",
        Condition = {
          StringEquals = {
            "aws:RequestTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "ssm:DeleteMaintenanceWindow",
          "ssm:DeletePatchBaseline",
          "ssm:DeregisterPatchBaselineForPatchGroup",
          "ssm:DescribeMaintenanceWindowTargets",
          "ssm:GetMaintenanceWindow",
          "ssm:GetPatchBaseline",
          "ssm:RegisterPatchBaselineForPatchGroup",
          "ssm:RegisterTargetWithMaintenanceWindow"
        ],
        Resource = "*",
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "ssm:DeregisterTargetFromMaintenanceWindow",
          "ssm:DeregisterTaskFromMaintenanceWindow",
          "ssm:RegisterTaskWithMaintenanceWindow"
        ],
        Resource = [
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:maintenancewindow/*",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:windowtask/*"
        ]
      },
      {
        Effect = "Allow",
        Action = ["ssm:GetMaintenanceWindowTask"],
        Resource = [
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:maintenancewindow/*",
          "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:windowtask/*"
        ]
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
      }
    ]
  })
}

resource "aws_iam_policy" "deployment_admin_ecr_codebuild" {
  name = "hire-me-deployment-admin-ecr-codebuild"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "codebuild:BatchGetProjects",
          "codebuild:CreateProject",
          "codebuild:DeleteProject",
          "codebuild:UpdateProject"
        ],
        Resource = ["arn:aws:codebuild:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:project/db-migrations"]
      },
      {
        Effect = "Allow",
        Action = [
          "ecr:CreateRepository",
          "ecr:DescribeImages",
          "ecr:DescribeRepositories",
          "ecr:DeleteLifecyclePolicy",
          "ecr:DeleteRepository",
          "ecr:GetLifecyclePolicy",
          "ecr:ListTagsForResource",
          "ecr:PutLifecyclePolicy",
          "ecr:TagResource"
        ],
        Resource = [
          "arn:aws:ecr:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:repository/db-migrations-runner",
          "arn:aws:ecr:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:repository/hire-me-api-server"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "deployment_admin_iam" {
  name = "hire-me-deployment-admin-iam"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
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
        Resource = [
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/codebuild-db-migrations-role",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/api-server-ssm-role",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/hire-me-api-server-ssm-patch-role",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/hire-me-api-ecs-instance-role"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "iam:CreateInstanceProfile",
          "iam:DeleteInstanceProfile",
          "iam:GetInstanceProfile",
          "iam:RemoveRoleFromInstanceProfile",
          "iam:AddRoleToInstanceProfile"
        ],
        Resource = [
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:instance-profile/hire-me-api-server-profile",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:instance-profile/hire-me-ecs-instance-profile"
        ]
      },
      {
        Effect = "Allow",
        Action = ["iam:CreateServiceLinkedRole"],
        Resource = [
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing",
          "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "deployment_admin_elb_ecs" {
  name = "hire-me-deployment-admin-elb-ecs"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "elasticloadbalancing:AddTags",
          "elasticloadbalancing:CreateListener",
          "elasticloadbalancing:CreateLoadBalancer",
          "elasticloadbalancing:DeleteLoadBalancer",
          "elasticloadbalancing:ModifyLoadBalancerAttributes",
          "elasticloadbalancing:SetSecurityGroups"
        ],
        Resource = [
          "arn:aws:elasticloadbalancing:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:loadbalancer/app/hire-me-api-alb/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "elasticloadbalancing:DeleteListener",
          "elasticloadbalancing:ModifyListener"
        ],
        "Resource" : [
          "arn:aws:elasticloadbalancing:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:listener/app/hire-me-api-alb/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "elasticloadbalancing:CreateTargetGroup",
          "elasticloadbalancing:DeleteTargetGroup",
          "elasticloadbalancing:ModifyTargetGroup",
          "elasticloadbalancing:ModifyTargetGroupAttributes",
        ],
        "Resource" : [
          "arn:aws:elasticloadbalancing:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:targetgroup/hire-me-alb-target-group/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "elasticloadbalancing:DescribeListeners",
          "elasticloadbalancing:DescribeLoadBalancers",
          "elasticloadbalancing:DescribeLoadBalancerAttributes",
          "elasticloadbalancing:DescribeTags",
          "elasticloadbalancing:DescribeTargetGroups",
          "elasticloadbalancing:DescribeTargetGroupAttributes"
        ],
        "Resource" : "*"
      },
      {
        Effect = "Allow",
        Action = [
          "ecs:CreateCluster",
          "ecs:DeleteCluster",
          "ecs:DescribeClusters",
          "ecs:RegisterTaskDefinition",
          "ecs:DescribeTaskDefinition",
          "ecs:DeregisterTaskDefinition"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "ec2:CreateLaunchTemplate",
          "ec2:CreateLaunchTemplateVersion",
          "ec2:DeleteLaunchTemplate",
          "ec2:DescribeLaunchTemplates",
          "ec2:DescribeLaunchTemplateVersions",
          "ec2:GetLaunchTemplateData",
          "ec2:RunInstances"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "ecs:CreateService",
          "ecs:DeleteService",
          "ecs:DescribeServices",
          "ecs:UpdateService"
        ],
        Resource = [
          "arn:aws:ecs:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:service/hire-me-api-cluster/api-service"
        ]

      }
    ]
  })
}

resource "aws_iam_policy" "deployment_admin_s3" {
  name = "hire-me-deployment-admin-s3"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:CreateBucket",
          "s3:PutBucketPublicAccessBlock",
          "s3:PutBucketPolicy",
          "s3:PutBucketOwnershipControls",
          "s3:GetAccelerateConfiguration",
          "s3:GetBucketPolicy",
          "s3:GetBucketLocation",
          "s3:GetBucketAcl",
          "s3:GetBucketPublicAccessBlock",
          "s3:GetBucketOwnershipControls",
          "s3:GetBucketRequestPayment",
          "s3:GetBucketLogging",
          "s3:GetLifecycleConfiguration",
          "s3:GetReplicationConfiguration",
          "s3:GetEncryptionConfiguration",
          "s3:GetBucketObjectLockConfiguration",
          "s3:GetBucketCORS",
          "s3:GetBucketWebsite",
          "s3:GetBucketVersioning",
          "s3:GetBucketTagging",
          "s3:ListBucket",
          "s3:DeleteBucket",
          "s3:PutEncryptionConfiguration"
        ],
        Resource = [
          "arn:aws:s3:::hire-me-jobs-dashboard*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
        ],
        Resource = [
          "arn:aws:s3:::hire-me-jobs-dashboard*/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "cloudfront:CreateDistribution",
          "cloudfront:ListDistributions"
        ],
        Resource = "*",
        Condition = {
          StringEquals = {
            "aws:RequestTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "cloudfront:GetDistribution",
          "cloudfront:GetDistributionConfig",
          "cloudfront:UpdateDistribution",
          "cloudfront:DeleteDistribution",
          "cloudfront:TagResource",
          "cloudfront:ListTagsForResource"
        ],
        Resource = [
          "arn:aws:cloudfront::${var.AWS_ACCOUNT_ID}:distribution/*"
        ],
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Project" = "hire-me"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "cloudfront:CreateOriginAccessControl",
          "cloudfront:ListOriginAccessControls"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "cloudfront:GetOriginAccessControl",
          "cloudfront:UpdateOriginAccessControl",
          "cloudfront:DeleteOriginAccessControl"
        ],
        Resource = [
          "arn:aws:cloudfront::${var.AWS_ACCOUNT_ID}:origin-access-control/*",
        ],
      },
      {
        Effect = "Allow",
        Action = [
          "iam:CreateServiceLinkedRole"
        ],
        Resource = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/aws-service-role/cloudfront.amazonaws.com/AWSServiceRoleForCloudFront",
        Condition = {
          StringEquals = {
            "iam:AWSServiceName" = "cloudfront.amazonaws.com"
          }
        }
      },
      {
        Effect = "Allow",
        Action = [
          "acm:DescribeCertificate"
        ],
        Resource = "arn:aws:acm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:certificate/${local.cloudfront_acm_cert_id}"
      },
      {
        Effect = "Allow",
        Action = [
          "acm:ListCertificates"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "ssm:GetParameter"
        ],
        Resource = "arn:aws:ssm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:parameter/hire-me-acm-cert-id"
      }
    ]
  })
}


resource "aws_iam_policy" "deployment_admin_autoscaling" {
  name = "hire-me-deployment-admin-autoscaling"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "autoscaling:CreateAutoScalingGroup",
          "autoscaling:DeleteAutoScalingGroup"
        ],
        Resource = [
          "arn:aws:autoscaling:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:autoScalingGroup:*:autoScalingGroupName/hire-me-api-asg"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "autoscaling:DescribeScalingActivities",
          "autoscaling:DescribeAutoScalingGroups"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "autoscaling:SetInstanceProtection",
          "autoscaling:UpdateAutoScalingGroup"
        ],
        Resource = [
          "arn:aws:autoscaling:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:autoScalingGroup:*:autoScalingGroupName/hire-me-api-asg"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "deployment_admin_cloudwatch" {
  name = "hire-me-deployment-admin-cloudwatch"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams",
          "logs:DescribeLogGroups",
          "logs:DeleteLogGroup",
          "logs:DeleteLogStream",
          "logs:PutRetentionPolicy",
          "logs:ListTagsLogGroup"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "deployment_admin_attachments" {
  count = 9
  role  = aws_iam_role.deployment_admin.name
  policy_arn = [
    aws_iam_policy.deployment_admin_networking.arn,
    aws_iam_policy.deployment_admin_rds.arn,
    aws_iam_policy.deployment_admin_ssm.arn,
    aws_iam_policy.deployment_admin_ecr_codebuild.arn,
    aws_iam_policy.deployment_admin_iam.arn,
    aws_iam_policy.deployment_admin_elb_ecs.arn,
    aws_iam_policy.deployment_admin_autoscaling.arn,
    aws_iam_policy.deployment_admin_s3.arn,
    aws_iam_policy.deployment_admin_cloudwatch.arn
  ][count.index]
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

