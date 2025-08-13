const AWS = require('@aws-sdk/client-s3');
const helperFunctions = require("./helperFunctions");
const config = require("../config");
const AWS_REGION = config.AWS_REGION;
const IAM_ACCESS_KEY = config.IAM_ACCESS_KEY;
const IAM_SECRET_KEY = config.IAM_SECRET_KEY;
const BUCKET_NAME = config.BUCKET_NAME;


const s3Client = new AWS.S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: IAM_ACCESS_KEY,
        secretAccessKey: IAM_SECRET_KEY
    }
});

function uploadFileToS3(fileName, data) {
    const body = helperFunctions.jsonExpensesToCsv(data);
    return s3Client.send(new AWS.PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `${fileName}.csv`,
            Body: body,
            ContentType: "text/csv",
            ACL: "public-read",
        })).then(result => {
            return result;
        }).catch(err => {
            console.log("Error: uploadFIleToS3", err);
        });
}


module.exports = {
    uploadFileToS3
}