const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();

const sourceBucket = 'PUT_YOUR_ORIGINAL_PHOTO_BUCKET_ID';
const tableName = 'PUT_YOUR_DYNAMODB_TABLE_ID';

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const imageBuffer = Buffer.from(body.image, 'base64');
    const key = `photos/${Date.now()}.jpg`;

    try {
        // Save the image to S3
        await S3.putObject({
          Bucket: sourceBucket,
          Key: key,
          Body: imageBuffer,
          ContentType: 'image/jpeg'
          }).promise();
          
          // Store metadata in DynamoDB
          await DynamoDB.put({
            TableName: tableName,
            Item: {
              PhotoId: key,
              Timestamp: new Date().toISOString()
              }
              }).promise();
              
        return { statusCode: 200, headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
          'Access-Control-Allow-Headers': 'Content-Type'
      },body: JSON.stringify({ message: 'Image uploaded successfully', ImageId: key }) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Error uploading image' }) };
    }
};
