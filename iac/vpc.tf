data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default_vpc" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  
  filter {
    name = "availability-zone"
    values = ["${var.aws_region}a"]
  }
}

data "aws_security_group" "default_security_group" {
  vpc_id = data.aws_vpc.default.id
}