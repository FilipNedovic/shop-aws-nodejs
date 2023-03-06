Write-Host "adding test item to to DynamoDb Stocks table"
aws dynamodb put-item --table-name Stocks --item '{
  \"product_id\": {
    \"S\": \"test-uuid\"
  },
  \"count\": {
    \"N\": \"12\"
  }
}'