
#creating ec2 instance
resource "aws_instance" "ec2" {
    ami = "ami-0822a7a2356687b0f"
    instance_type = "t2.micro"
    subnet_id = aws_subnet.public_subnet.id
    associate_public_ip_address = true
    key_name = "ec2_keypair"
    tags = {
        Name = "EC2-for-RDS"
    }
    security_groups = [ aws_security_group.sg_for_ec2.id ]
}

resource "aws_security_group" "sg_for_ec2" {
  name        = "allow_ssh"
  vpc_id      = aws_vpc.my_vpc.id

  ingress {
    description      = "TLS from VPC"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }
}

output "ec2-publicip"{
    value = aws_instance.ec2.public_ip
}
