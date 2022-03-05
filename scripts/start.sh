#!/bin/bash
cd /home/ubuntu/Roadgram/server
npm run build
export DATABASE_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_PASSWORD --query Parameters[0].Value | sed 's/"//g')
export DATABASE_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_HOST --query Parameters[0].Value | sed 's/"//g')
export DATABASE_NAME=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_NAME --query Parameters[0].Value | sed 's/"//g')
export DATABASE_USERNAME=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_USERNAME --query Parameters[0].Value | sed 's/"//g')
export DATABASE_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names DATABASE_PORT --query Parameters[0].Value | sed 's/"//g')
export SERVER_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names SERVER_PORT --query Parameters[0].Value | sed 's/"//g')
export CLIENT_ID=$(aws ssm get-parameters --region ap-northeast-2 --names CLIENT_ID --query Parameters[0].Value | sed 's/"//g')
export JWT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names JWT_SECRET --query Parameters[0].Value | sed 's/"//g')
export REDIRECT_URI=$(aws ssm get-parameters --region ap-northeast-2 --names REDIRECT_URI --query Parameters[0].Value | sed 's/"//g')
export TYPEORM_SEEDING_FACTORIES=$(aws ssm get-parameters --region ap-northeast-2 --names TYPEORM_SEEDING_FACTORIES --query Parameters[0].Value | sed 's/"//g')
export TYPEORM_SEEDING_SEEDS=$(aws ssm get-parameters --region ap-northeast-2 --names TYPEORM_SEEDING_SEEDS --query Parameters[0].Value | sed 's/"//g')
pm2 start dist/src/main.js