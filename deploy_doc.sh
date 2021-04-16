#!/bin/bash

# get variables from params
for i in "$@"
do
case $i in
  -b=*|--bucket=*)
  S3_BUCKET="${i#*=}"
  shift
  ;;
  -f=*|--folder=*)
  S3_FOLDER="${i#*=}"
  shift
  ;;
esac
done

# exit if no input params are supplied
S3_BUCKET=${S3_BUCKET:?--bucket or -b parameter. This is the S3 bucket which will host moons documentation. }
S3_FOLDER=${S3_FOLDER:?--folder or -f parameter. This is the S3 bucket folder which will host Swagger UI. }

# check if bucket exists /dev/null prevents error
if aws s3api head-bucket --bucket $S3_BUCKET 2>/dev/null;  
then 
  echo 'bucket exists => enable hosting'; 
else 
  echo 'no bucket - create it';
  exit 1
fi

if aws s3 ls s3://$S3_BUCKET/$S3_FOLDER 2>/dev/null;
then
  echo 'folder exists => upload new openapi doc'

  # upload swagger doc file to S3 bucket-folder
  aws s3 cp openapi.yml s3://$S3_BUCKET/$S3_FOLDER/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

  # print your documentation url
  echo https://$S3_BUCKET.s3.amazonaws.com/$S3_FOLDER/index.html
else
  echo 'folder does not exist => building doc'
  
  # remove swagger-ui folder then clone repo for the latest version 
  rm -rf swagger-ui
  git clone https://github.com/swagger-api/swagger-ui.git
  # replace reference inside index.html from https://petstore.swagger.io/v2/swagger.json to openapi.yml (generated swagger file)
  sed -i '' 's/https:\/\/petstore.swagger.io\/v2\/swagger.json/openapi.yml/g' ./swagger-ui/dist/index.html 

  # upload swagger ui to S3 bucket-folder
  aws s3 cp ./swagger-ui/dist s3://$S3_BUCKET/$S3_FOLDER/ --recursive --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

  # upload swagger doc file to S3 bucket-folder
  aws s3 cp openapi.yml s3://$S3_BUCKET/$S3_FOLDER/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

  # cleanup
  rm -rf swagger-ui

  # print your documentation url
  echo https://$S3_BUCKET.s3.amazonaws.com/$S3_FOLDER/index.html
fi