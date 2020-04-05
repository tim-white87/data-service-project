provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "data-service-project-bucket" {
  bucket = "data-service-project-tw"

  versioning {
    enabled = true
  }
}