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

resource "aws_iam_instance_profile" "api_server_profile" {
  name = "hire-me-api-server-profile"
  role = aws_iam_role.api_server_ssm_role.id
}

# resource "aws_instance" "api_server" {
#   ami                  = "ami-00543daa0ad4d3ea4" # Amazon Linux 2023 kernel-6.1 AMI (x86)
#   instance_type        = "t2.micro"
#   subnet_id            = aws_subnet.public_ec2.id
#   security_groups      = [aws_security_group.ec2.id]
#   iam_instance_profile = aws_iam_instance_profile.api_server_profile.id

#   user_data = templatefile("${path.module}/up-api-server.sh", {
#     AWS_REGION         = var.AWS_REGION,
#     api_server_ecr_url = local.api_server_ecr_url,
#     cors_origin        = "https://paldeepsingh.dev"
#   })

#   tags = {
#     Name = "api-ec2-instance"
#   }
# }

