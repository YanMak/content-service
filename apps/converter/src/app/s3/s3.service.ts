import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.S3_BUCKET_NAME;
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT_URL,
  });

  async uploadFile(file) {
    const { originalname } = file;

    //console.log(`originalname=${originalname} file.mimetype=${file.mimetype}`);

    await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype
    );
  }

  async uploadBuffer(
    buffer: Buffer,
    originalname: string,
    mimetype = 'image/webp'
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    //console.log(`originalname=${originalname} file.mimetype=${mimetype}`);
    return await this.s3_upload(
      buffer,
      this.AWS_S3_BUCKET,
      originalname,
      mimetype
    );
  }

  async s3_upload(
    file,
    bucket,
    name,
    mimetype
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ru-msk',
      },
    };

    //console.log(params);

    let s3Response: AWS.S3.ManagedUpload.SendData =
      {} as AWS.S3.ManagedUpload.SendData;
    try {
      s3Response = await this.s3.upload(params).promise();

      //Logger.log(`s3Response`);
      //console.log(s3Response);

      //requestIdleCallback;
    } catch (e) {
      console.log(e);
    }

    //Logger.log(`return s3Response;`);
    return s3Response;
  }
}
