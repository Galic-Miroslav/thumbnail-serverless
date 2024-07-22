const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const Jimp = require('jimp');

const sourceBucket = 'PUT_YOUR_ORIGINAL_PHOTO_BUCKET_ID';
const destinationBucket = 'PUT_YOUR_THUMBNAIL_PHOTO_BUCKET_ID';
const tableName = 'PUT_YOUR_DYNAMODB_TABLE_ID';

exports.handler = async (event) => {
  const record = event.Records[0];
  const message = JSON.parse(record.Sns.Message)
  const key = message.Records[0].s3.object.key;

    try {
      // Get the original image from S3
      const originalImage = await S3.getObject({
        Bucket: sourceBucket,
        Key: key
        }).promise();
        
        // Create a thumbnail using Jimp
        const image = await Jimp.read(originalImage.Body);
        const thumbnail = await image.resize(200, Jimp.AUTO).getBufferAsync(Jimp.MIME_JPEG);
        
        // Save the thumbnail to S3
        const thumbnailKey = `thumbnails/${key}`;
        await S3.putObject({
          Bucket: destinationBucket,
          Key: thumbnailKey,
          Body: thumbnail,
          ContentType: 'image/jpeg'
          }).promise();
          
          // Update metadata in DynamoDB
          await DynamoDB.update({
            TableName: tableName,
            Key: { PhotoId: key },
            UpdateExpression: 'set ThumbnailKey = :t',
            ExpressionAttributeValues: {
              ':t': thumbnailKey
              }
              }).promise();

        return { statusCode: 200, body: 'Thumbnail created successfully' };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: 'Error creating thumbnail' };
    }
};
