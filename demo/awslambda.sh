#!/bin/bash

if [ $1 = "create" ]; then
  aws --function-name AccessMemCache  \
      --region us-east-1 \
      --zip-file $2 \
      --role execution-role-arn \
      --handler app.handler \
      --runtime python3.6  \
      --timeout 30 \
      --vpc-config SubnetIds=comma-separated-vpc-subnet-ids,SecurityGroupIds=default-security-group-id \
      --memory-size 1024
elif
  echo "try again"
fi
