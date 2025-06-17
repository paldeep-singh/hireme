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
          "iam:UpdateRole"
        ],
        "Resource" : [
          aws_iam_role.ci_permissions_admin.arn,
          aws_iam_role.deployment_admin.arn,
          aws_iam_role.db_migrations_admin.arn
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

# resource "aws_iam_role_policy" "db_migrations_admin_policy" {
#   name = "hire-me-db-migrations-admin-policy"
#   role = aws_iam_role.db_migrations_admin.id
#   policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [{}]
#   })
# }


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
          "ec2:AuthorizeSecurityGroupIngress"
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
          "ec2:DescribeInternetGateways",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DescribeRouteTables",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeSubnets",
          "ec2:DescribeVpcClassicLink",
          "ec2:DescribeVpcClassicLinkDnsSupport",
          "ec2:DescribeVpcs"
        ],
        "Resource" : "*"
      }
    ]
  })
}
