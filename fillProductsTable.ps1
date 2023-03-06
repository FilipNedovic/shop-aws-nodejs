Write-Host "adding test item to to DynamoDb Products table"
aws dynamodb put-item --table-name Products --item '{
  \"id\": {
    \"S\": \"test-uuid\"
  },
  \"description\": {
    \"S\": \"Test product description created via script\"
  },
  \"price\": {
    \"N\": \"55\"
  },
  \"title\": {
    \"S\": \"Test product created via script\"
  }
}'