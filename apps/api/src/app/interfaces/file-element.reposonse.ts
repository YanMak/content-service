import { GenerateImages } from '@content-service/contracts';

export class FileElementResponse {
  url: string;
  name: string;
}

export class S3CDNElementResponse {
  s3: GenerateImages.S3UploadResponse;
  cdn: GenerateImages.CDNUploadResponse;
}
