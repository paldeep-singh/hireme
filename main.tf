terraform {
  cloud {
    organization = "hire-me"
    workspaces {
      name = "hire-me-deployment"
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

resource "aws_db_instance" "hire-me-db" {
  db_name = "hire_me_db"
  instance_class = "db.t4g.micro"
}
