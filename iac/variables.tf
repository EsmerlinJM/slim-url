variable "aws_region" {
  default = "us-east-1"
}

variable "rest_api_name" {
  description = "The name of your API"
  type        = string
  default     = "slim-url-shortener-api"
}

variable "stage_name" {
  description = "The name of your API stage"
  type        = string
  default     = "live"
}

variable "lambda_name" {
  description = "The name of your lambda"
  type        = string
  default     = "lambda"
}