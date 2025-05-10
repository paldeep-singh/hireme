terraform {
  cloud {
    organization = "hire-me"
    workspaces {
      name = "learn-terraform-aws"
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

resource "aws_instance" "api_server" {
  ami           = "ami-0f5d1713c9af4fe30"
  instance_type = "t2.micro"

  tags = {
    Name = "HireMeApiServer"
  }
}
