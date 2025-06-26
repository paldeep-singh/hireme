# ------------------------------
# S3 Bucket for Static Website
# ------------------------------
resource "aws_s3_bucket" "static_site" {
  bucket_prefix = "hire-me-jobs-dashboard"
}

resource "aws_s3_bucket_ownership_controls" "static_site" {
  bucket = aws_s3_bucket.static_site.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "static_site" {
  bucket = aws_s3_bucket.static_site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ------------------------------
# CloudFront
# ------------------------------

resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "hire-me-s3-oac"
  description                       = "Origin Access Control for hire-me jobs dashboard"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.static_site.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.static_site.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for hire-me static site"
  default_root_object = "index.html" # Keep this as is, root for /

  aliases = ["www.paldeepsingh.dev"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.static_site.id}"

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 86400    # 1 day
    max_ttl                = 31536000 # 1 year

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Custom error responses to serve /dashboard/index.html on 403 and 404 errors
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/dashboard/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/dashboard/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:${var.AWS_ACCOUNT_ID}:certificate/${local.cloudfront_acm_cert_id}"
    ssl_support_method  = "sni-only"
  }

  tags = {
    Name    = "hire-me-dashboard-distribution"
    Project = "hire-me"
  }
}


# ------------------------------
# S3 Bucket Policy
# ------------------------------

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.static_site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "static_site" {
  bucket = aws_s3_bucket.static_site.id
  policy = data.aws_iam_policy_document.s3_policy.json
  depends_on = [
    aws_cloudfront_distribution.s3_distribution
  ]
}
