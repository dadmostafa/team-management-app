
provider "aws" {
  region = "us-east-1"
}


resource "aws_s3_bucket" "frontend" {
  bucket = "acme-team-management-app"
}


resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# the bucket for website hosting
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  index_document { suffix = "index.html" }
  error_document { key = "index.html" }
}

#  the website URL when done
output "website_url" {
  value = aws_s3_bucket_website_configuration.frontend.website_endpoint
}
