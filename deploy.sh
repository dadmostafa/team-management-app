!/bin/bash
echo "Building React app..."
npm run build

echo "Uploading to S3..."
aws s3 sync build/ s3://acme-team-management-app --delete

echo "app is live at:"
echo "http://acme-team-management-app.s3-website-us-east-1.amazonaws.com"