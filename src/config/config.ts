import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    dynamoDBTableName: process.env.DYNAMODB_TABLE_NAME
}

export default config;
