variable "AWS_ACCOUNT_ID" {
  type      = string
  sensitive = true
}

variable "AWS_REGION" {
  type      = string
  sensitive = true
}

terraform {
  cloud {
    organization = "paldeep"
    workspaces {
      name = "db-migrations"
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
  region = var.AWS_REGION
}
