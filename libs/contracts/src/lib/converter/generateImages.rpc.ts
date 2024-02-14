import { ImageRequirement, ImageResult, ImageOptions } from './models';
import * as AWS from 'aws-sdk';

export namespace GenerateImages {
  export const Topic = 'image-processor.generateImages.rpc';

  export class S3UploadResponse implements AWS.S3.ManagedUpload.SendData {
    Location: string;
    ETag: string;
    Bucket: string;
    Key: string;
  }

  export class CDNUploadResponse {
    url: string;
  }

  export class Request {
    image: string;
    requirements: ImageRequirement[];
    options?: ImageOptions;
  }

  export class Response {
    images: ImageResult[];
    s3: S3UploadResponse;
    cdn: CDNUploadResponse;
  }
}
