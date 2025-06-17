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


# resource "aws_iam_role_policy" "deployment_admin_policy" {
#   name = "hire-me-deployment-admin-policy"
#   role = aws_iam_role.deployment_admin.id
#   policy = jsonencode({
#     "Version" : "2012-10-17",
#     "Statement" : [{
#       "Sid" : "VisualEditor0",
#       "Effect" : "Allow",
#       "Action" : []
#     }]
#   })
# }
