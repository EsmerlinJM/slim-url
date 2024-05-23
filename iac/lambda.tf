module "create_short_url_lambda" {
  source           = "./modules/lambda"
  name             = "create-short-url"
  source_file_path = "./init/index.mjs"
  policies = [
    data.aws_iam_policy_document.create_short_url_lambda.json
  ]

  environment_variables = {
    BASE_URL = ""
  }
}

module "redirect_lambda" {
  source           = "./modules/lambda"
  name             = "redirect"
  source_file_path = "./init/index.mjs"
  policies = [
    data.aws_iam_policy_document.allow_get_url_lambda.json
  ]

   environment_variables = {
    DAX_ENDPOINT = aws_dax_cluster.urls.cluster_address
  }

  has_vpc            = true
  security_group_ids = [data.aws_security_group.default_security_group.id]
  subnet_ids         = data.aws_subnets.default_vpc.ids

  depends_on = [aws_dax_cluster.urls]
}