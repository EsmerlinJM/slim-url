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

variable "env_prefix" {
  description = "The prefix name of your environment"
  type        = string
  default     = "-lambda"
}