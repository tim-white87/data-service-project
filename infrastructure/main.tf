provider "aws" {
  region = "us-east-1"
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

  user_pool_id = aws_cognito_user_pool.data-service-project-pool.id
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = ["code"]
  callback_urls = ["https://localhost:5001/signin-oidc"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
  supported_identity_providers  = ["COGNITO"]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "data-service-project"
  user_pool_id = aws_cognito_user_pool.data-service-project-pool.id
}