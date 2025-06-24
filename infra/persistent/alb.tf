resource "aws_lb" "alb" {
  name               = "hire-me-api-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_alb_a.id, aws_subnet.public_alb_b.id]
  security_groups    = [aws_security_group.alb.id]
}

resource "aws_lb_target_group" "api_server_tg" {
  name     = "hire-me-alb-target-group"
  port     = 3001
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

# HTTPS listener (port 443)
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-2016-08"
  certificate_arn = "arn:aws:acm:${var.AWS_REGION}:${var.AWS_ACCOUNT_ID}:certificate/${aws_ssm_parameter.acm_cert_id.value}"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_server_tg.arn
  }
}

# HTTP listener (port 80) — redirects to HTTPS
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
