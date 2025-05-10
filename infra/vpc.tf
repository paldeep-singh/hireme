resource "aws_vpc" "my_vpc" {
    cidr_block = "10.0.0.0/16"
    tags = {
        Name = "EC2-to-RDS-VPC"
    } 
}

resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_vpc.my_vpc.id
  availability_zone = "ap-southeast-2a"
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "Public Subnet"
  }
}

resource "aws_subnet" "private_subnet" {
  vpc_id     = aws_vpc.my_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "ap-southeast-2a"
  tags = {
    Name = "Private Subnet"
  }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id     = aws_vpc.my_vpc.id
  cidr_block = "10.0.3.0/28"  # Tiny block
  availability_zone = "ap-southeast-2b"  # Different AZ
  tags = {
    Name = "Private Subnet 2"
  }
}

resource "aws_internet_gateway" "ig_2tier" {
  vpc_id = aws_vpc.my_vpc.id

  tags = {
    Name = "Internet Gateway for EC2-to-RDS VPC"
  }
}


#public route table with internet
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "Public route_table"
  }
}

#public subnet associated with the subnet
resource "aws_route_table_association" "public-route-table-association" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

#routing internet to public subnet
resource "aws_route" "public_route" {
  route_table_id         = aws_route_table.public_route_table.id
  destination_cidr_block = "0.0.0.0/0"  # All traffic that isn't local.
  gateway_id             = aws_internet_gateway.ig_2tier.id
}


#private route table without internet
resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "private route_table"
  }
}

#private subnet associated with the subnet
resource "aws_route_table_association" "private-route-table-association" {
  subnet_id      = aws_subnet.private_subnet.id
  route_table_id = aws_route_table.private_route_table.id
}