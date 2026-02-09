terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

locals {
  // 스위스, 남아프리카공화국, 홍콩, 싱가포르, 말레이시아, 뉴질랜드, 태국, 바레인, 아랍에미리트, 이스라엘 제외됨
  regions = toset([
    "us-east-1", "ca-central-1", "sa-east-1", "mx-central-1", // 미국 캐나다 브라질 멕시코
    "eu-west-1", "eu-west-2", "eu-west-3", "eu-central-1", "eu-south-1", "eu-south-2", "eu-north-1", // 아일랜드 영국 프랑스 독일 이탈리아 스페인 스웨덴
    "ap-northeast-1", "ap-northeast-2", "ap-east-2", "ap-south-1", // 일본 서울 대만 인도
    "ap-southeast-2", "ap-southeast-3", // 호주 인도네시아
  ])
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "youtube_hype" {
  name               = "lambda_execution_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "youtube_hype" {
  type        = "zip"
  source_dir = "${path.module}/lambda"
  output_path = "${path.module}/function.zip"
}

resource "aws_lambda_function" "youtube_hype" {
  for_each = local.regions

  region        = each.value
  function_name = "youtube_hype-${each.value}"
  role          = aws_iam_role.youtube_hype.arn
  filename      = data.archive_file.youtube_hype.output_path
  code_sha256   = data.archive_file.youtube_hype.output_base64sha256
  handler       = "index.handler"

  runtime = "nodejs24.x"
  timeout = 10
}

output "lambda_arns" {
  description = "All Lambda function ARNs by region"
  value = {
    for region, fn in aws_lambda_function.youtube_hype :
    region => fn.arn
  }
}
