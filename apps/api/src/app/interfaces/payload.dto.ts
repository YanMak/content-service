import { ImageType } from '@content-service/contracts';

export class PayloadDto {
  width: number;
  height: number;
  quality: number;
  type: ImageType;
}
