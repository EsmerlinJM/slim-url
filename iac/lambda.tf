module "create_short_url_lambda" {
  source           = "./modules/lambda"
  name             = "create-short-url-${var.lambda_prefix_name}"
  source_file_path = "./init/index.mjs"
  policies = [
    data.aws_iam_policy_document.create_short_url_lambda.json
  ]

  environment_variables = {
    BASE_URL = "https://yr9q6b5bjc.execute-api.us-east-1.amazonaws.com/live/"
  }
}

module "redirect_lambda" {
  source           = "./modules/lambda"
  name             = "redirect-${var.lambda_prefix_name}"
  source_file_path = "./init/index.mjs"
  policies = [
    data.aws_iam_policy_document.allow_get_url_lambda.json
  ]
}

module "delete_lambda" {
  source           = "./modules/lambda"
  name             = "delete-${var.lambda_prefix_name}"
  source_file_path = "./init/index.mjs"
  policies = [
    data.aws_iam_policy_document.allow_get_url_lambda.json
  ]
}