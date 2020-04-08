provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "data-service-project-ui-bucket" {
  bucket = "data-service-project-ui-bucket-tw"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  versioning {
    enabled = true
  }
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
}

locals {
  s3_origin_id = "data-service-project-S3-origin"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.data-service-project-ui-bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    compress               = true
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  ordered_cache_behavior {
    path_pattern     = "/index.html"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}



resource "aws_s3_bucket" "data-service-project-bucket" {
  bucket = "data-service-project-tw"

  versioning {
    enabled = true
  }
}

resource "aws_cognito_user_pool" "data-service-project-pool" {
  name = "data-service-project"
}

resource "aws_cognito_user_pool_client" "data-service-project-client" {
  name = "data-service-project-client"

  user_pool_id                         = aws_cognito_user_pool.data-service-project-pool.id
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  callback_urls                        = ["http://localhost:3000/", "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "data-service-project"
  user_pool_id = aws_cognito_user_pool.data-service-project-pool.id
}
