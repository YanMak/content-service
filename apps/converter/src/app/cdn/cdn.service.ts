import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class CDNService {
  constructor(private readonly configService: ConfigService) {}

  getCDNUrl(s3: AWS.S3.ManagedUpload.SendData) {
    return { url: `${this.configService.get('CDN_URL')}${s3.Key}` };
  }
}
