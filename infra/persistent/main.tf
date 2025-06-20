variable "AWS_ACCOUNT_ID" {
  type      = string
  sensitive = true
}

variable "AWS_REGION" {
  type      = string
  sensitive = true
}

locals {
  api_server_ecr_url = aws_ecr_repository.api_server.repository_url
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
