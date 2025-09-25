# CashFlowAI Backend

TypeScript backend API for CashFlowAI application with AWS integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
PORT=3000
JWT_SECRET=your-jwt-secret-key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
DYNAMODB_TABLE_NAME=cashflowai-table
S3_BUCKET_NAME=cashflowai-bucket
```

3. Start development server:
```bash
npm run dev
```

## AWS Configuration

### DynamoDB Setup
Create a DynamoDB table with:
- Table name: `cashflowai-table`
- Partition key: `id` (String)

### S3 Setup
Create an S3 bucket:
- Bucket name: `cashflowai-bucket`
- Enable versioning (optional)

### IAM Permissions
Ensure your AWS credentials have permissions for:
- DynamoDB: `GetItem`, `PutItem`, `UpdateItem`, `DeleteItem`, `Query`, `Scan`
- S3: `GetObject`, `PutObject`, `DeleteObject`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## API Endpoints

- `GET /` - Health check
