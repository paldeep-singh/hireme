variable "AWS_ACCOUNT_ID" {
  type      = string
  sensitive = true
}

variable "AWS_REGION" {
  type      = string
  sensitive = true
}

locals {
  cloudfront_acm_cert_id = "18273463-bf4a-4bad-82b9-2318ac47bff1"
}


terraform {
  cloud {
    organization = "paldeep"
    workspaces {
      name = "deployment"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-southeast-2"
}
