terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "slim-url-terraform-state-bucket-19283719"
    key    = "slim-url/state"
  }
}

# Configure the AWS Provider
provider "aws" {}