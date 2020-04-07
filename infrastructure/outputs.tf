output "s3_bucket_domain" {
  value       = aws_s3_bucket.data-service-project-ui-bucket.website_endpoint
  description = "The bucket hosting the SPA"
}
