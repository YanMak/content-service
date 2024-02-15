import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RMQService } from 'nestjs-rmq';
import { FilesService } from './files.service';
import {
  FileElementResponse,
  S3CDNElementResponse,
} from './interfaces/file-element.reposonse';
import { MFile } from './interfaces/mfile.class';
import { PayloadDto } from './interfaces/payload.dto';

import { Get } from '@nestjs/common';
import { GenerateImages } from '@content-service/contracts';

import 'multer';
import { getFileExtension, getFilenameForS3 } from '@content-service/helpers';
//import * as Express from ''

@Controller()
export class ApiController {
  constructor(
    private readonly filesService: FilesService,
    private readonly rmqService: RMQService
  ) {}

  @Get('ping')
  async Ping() {
    return { status: 'ok' };
  }

  @Post('upload_s3')
  @UseInterceptors(FileInterceptor('file'))
  async uploadS3(
    @UploadedFile() file: Express.Multer.File,
    @Query() params: PayloadDto
  ): Promise<S3CDNElementResponse> {
    const saveFile: MFile = new MFile(file);
    if (!file.mimetype.includes('image')) {
      throw new BadRequestException('Неверный формат файла');
    }
    //Logger.log('export class ApiController { async upload_s3( -----');
    const { buffer, ...params_ } = file;
    //Logger.log(params_);
    const { name, extension } = getFileExtension(file.originalname);
    Logger.log(`file extension ${JSON.stringify({ name, extension })}`);
    //Logger.log('filename for s3 ' + getFilenameForS3(name));
    //Logger.log({
    //  width: Number(params.width),
    //  height: Number(params.height),
    //  quality: Number(params.quality),
    //  format: params.type,
    //});
    //Logger.log(') --------- export class ApiController { async uploadFile)');

    const dataforRabbit = {
      image: saveFile.buffer.toString('base64'),
      originalName: `${getFilenameForS3(name)}.${extension}`,
      requirements: [
        {
          width: Number(params.width),
          height: Number(params.height),
          quality: Number(params.quality),
          format: params.type,
        },
      ],
    };
    const { image, ...dataWOimage } = dataforRabbit;
    //Logger.log('file');
    //Logger.log(file.originalname);
    //Logger.log(dataWOimage);
    //Logger.log('_____________');

    //return {} as S3CDNElementResponse;

    const res = await this.rmqService.send<
      GenerateImages.Request,
      GenerateImages.Response
    >(GenerateImages.Topic, dataforRabbit);

    //return this.filesService.saveFile(
    this.filesService.saveFile(
      new MFile({
        originalname: file.originalname.split('.')[0] + '.' + params.type,
        buffer: Buffer.from(res.images[0].image),
      })
    );
    const { s3, cdn } = res;
    return { s3, cdn };
  }

  /*
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query() params: PayloadDto
  ): Promise<FileElementResponse> {
    const saveFile: MFile = new MFile(file);
    if (!file.mimetype.includes('image')) {
      throw new BadRequestException('Неверный формат файла');
    }
    Logger.log('export class ApiController { async uploadFile( -----');
    Logger.log({
      width: Number(params.width),
      height: Number(params.height),
      quality: Number(params.quality),
      format: params.type,
    });
    Logger.log(') --------- export class ApiController { async uploadFile)');
    const res = await this.rmqService.send<
      GenerateImages.Request,
      GenerateImages.Response
    >(GenerateImages.Topic, {
      image: saveFile.buffer.toString('base64'),
      originalName: file.originalname,
      requirements: [
        {
          width: Number(params.width),
          height: Number(params.height),
          quality: Number(params.quality),
          format: params.type,
        },
      ],
    });
    //return this.filesService.saveFile(
    return this.filesService.saveFile(
      new MFile({
        originalname: file.originalname.split('.')[0] + '.' + params.type,
        buffer: Buffer.from(res.images[0].image),
      })
    );
    //const { s3, cdn } = res;
    //return { s3, cdn };
  }*/
}
