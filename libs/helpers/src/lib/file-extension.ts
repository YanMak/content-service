import { Logger } from '@nestjs/common';

export const getFileExtension = (filename: string) => {
  //Logger.log('export const getFileExtension = (filename) => {');
  //Logger.log(filename);
  //let extension = '';
  for (let i = filename.length - 1; i >= 0; i--) {
    //Logger.log(i);
    //Logger.log(filename.charAt(i));
    if (filename.charAt(i) === '.') {
      //Logger.log(i);
      //Logger.log(filename.charAt(i));
      //Logger.log(filename.substring(i));
      return {
        name: filename.substring(0, i - 1),
        extension: filename.substring(i + 1),
      };
      return;
    } else {
      //extension = extension + filename.charAt(i);
    }
  }
  return { name: filename, extension: '' };
};
