import { Controller, Logger } from '@nestjs/common';
import { Message, RMQMessage, RMQRoute } from 'nestjs-rmq';
import { GenerateService } from './generator/generate.service';
import { performance } from 'perf_hooks';
import {
  GenerateImages,
  ImageRequirement,
  ImageResult,
} from '@content-service/contracts';
import { S3Service } from './s3/s3.service';
import { CDNService } from './cdn/cdn.service';
import { mimetype } from './helpers/mimetype';

@Controller()
export class AppController {
  private static instance: number =
    Math.floor(Math.random() * (999 - 100 + 1)) + 100;

  constructor(
    private readonly generateService: GenerateService,
    private readonly s3Service: S3Service,
    private readonly cdnService: CDNService
  ) {}

  @RMQRoute(GenerateImages.Topic)
  async generateImage(
    { image, originalName, requirements, options }: GenerateImages.Request,
    @RMQMessage msg: Message
  ): Promise<GenerateImages.Response> {
    const jobNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    //Logger.log('@RMQRoute(GenerateImages.Topic): @RMQMessage msg: Message');
    //Logger.log(msg.properties);
    //Logger.log('@RMQRoute(GenerateImages.Topic): options');
    //Logger.log(options);
    //Logger.log('@RMQRoute(GenerateImages.Topic): requirements');
    //Logger.log(requirements);
    //Logger.log(`[${AppController.instance}][${jobNumber}] Start generate...`);
    const t0 = performance.now();
    try {
      const bufferImage = Buffer.from(image, 'base64');
      const transformedImage = await this.generateService.transformOriginal(
        bufferImage,
        options
      );

      const images = await Promise.all(
        requirements.map(
          async (requirement: ImageRequirement): Promise<ImageResult> => {
            return this.generateService.generateSizes(
              Buffer.from(transformedImage.image),
              requirement,
              options
            );
          }
        )
      );

      //const buffForS3 = bufferImage;
      const buffForS3 = Buffer.from(images.concat([transformedImage])[0].image);

      //const file_originalname = 'image001.jpg';
      const file_originalname = originalName;
      //console.log(`original name ${file_originalname}`);
      const [originalname] = file_originalname.split('.');
      const s3UploadResult = await this.s3Service.uploadBuffer(
        buffForS3 as Buffer,
        //originalname + '.webp'
        originalname + '.' + requirements[0].format,
        mimetype(requirements[0].format)
      );

      //Logger.log('images.concat([transformedImage])');
      //Logger.log(images.concat([transformedImage]));

      return {
        images: images.concat([transformedImage]),
        s3: s3UploadResult,
        cdn: this.cdnService.getCDNUrl(s3UploadResult),
      };
    } catch (error) {
      Logger.error(error);
      throw error;
    } finally {
      const t1 = performance.now();
      Logger.log(
        `[${
          AppController.instance
        }][${jobNumber}] ${originalName} Generation completed in ${
          t1 - t0
        } milliseconds.`
      );
    }
  }
}
