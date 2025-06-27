# Enable access logging for the ALB
resource "aws_s3_bucket" "alb_logs" {
  bucket = "hire-me-alb-logs"

  lifecycle {
    prevent_destroy = true
  }

  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "alb_logs_block" {
  bucket = aws_s3_bucket.alb_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_lb" "alb" {
  name               = "hire-me-api-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_alb_a.id, aws_subnet.public_alb_b.id]
  security_groups    = [aws_security_group.alb.id]

  access_logs {
    bucket  = aws_s3_bucket.alb_logs.bucket
    enabled = true
    prefix  = "alb"
  }
}

resource "aws_lb_target_group" "api_server_tg" {
  name     = "hire-me-alb-target-group"
  port     = 3001
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/health"
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

# WAF Web ACL (regional)
resource "aws_wafv2_web_acl" "api_waf" {
  name        = "hire-me-api-waf"
  scope       = "REGIONAL"
  description = "Protects the API with rate limiting and basic rules"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "hireMeApiWaf"
    sampled_requests_enabled   = true
  }

  rule {
    name     = "rate-limit-by-ip"
    priority = 0

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 100
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "rateLimit"
      sampled_requests_enabled   = true
    }
  }
}

# Associate the WAF Web ACL with the ALB
resource "aws_wafv2_web_acl_association" "alb_waf" {
  resource_arn = aws_lb.alb.arn
  web_acl_arn  = aws_wafv2_web_acl.api_waf.arn
}
