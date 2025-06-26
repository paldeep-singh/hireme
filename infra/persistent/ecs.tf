data "aws_ami" "ecs" {
  owners      = ["amazon"]
  most_recent = true
  filter {
    name   = "name"
    values = ["al2023-ami-ecs-hvm-*-x86_64"] # Amazon Linux 2023 ECS Optimized
  }
}

resource "aws_ecs_cluster" "main" {
  name = "hire-me-api-cluster"
}

resource "aws_iam_role" "ecs_instance_role" {
  name = "hire-me-api-ecs-instance-role"
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

resource "aws_iam_role_policy_attachment" "ecs_instance_attach" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_instance_profile" {
  name = "hire-me-ecs-instance-profile"
  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_launch_template" "ecs" {
  name_prefix   = "hire-me-ecs-launch-template"
  image_id      = data.aws_ami.ecs.id
  instance_type = "t2.micro"
  key_name      = "ec2_keypair"
  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }
  user_data              = base64encode("#!/bin/bash\necho ECS_CLUSTER=${aws_ecs_cluster.main.name} >> /etc/ecs/ecs.config")
  vpc_security_group_ids = [aws_security_group.ec2.id]
}

resource "aws_autoscaling_group" "ecs_asg" {
  name                = "hire-me-api-asg"
  desired_capacity    = 1
  max_size            = 1
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.public_ec2.id]
  launch_template {
    id      = aws_launch_template.ecs.id
    version = "$Latest"
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = "hire-me-api-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "hire-me-api"
      image     = "${aws_ecr_repository.api_server.repository_url}:latest"
      essential = true
      portMappings = [{
        containerPort = 3001,
        hostPort      = 3001
      }],
      environment = [
        { name = "DATABASE_URL", value = "${aws_ssm_parameter.db_url.value}" },
        { name = "CORS_ORIGIN", value = "https://www.paldeepsingh.dev" }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/hire-me-api"
          "awslogs-region"        = var.AWS_REGION
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "api" {
  name            = "api-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "EC2"

  load_balancer {
    target_group_arn = aws_lb_target_group.api_server_tg.arn
    container_name   = "hire-me-api"
    container_port   = 3001
  }

  depends_on = [aws_autoscaling_group.ecs_asg]
}


