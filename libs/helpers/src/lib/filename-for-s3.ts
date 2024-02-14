import { LexRuntime } from 'aws-sdk';

export const getFilenameForS3 = (filename: string) => {
  let searchRegExp = /\s/g;
  let replaceWith = '-';

  let res = filename.replace(searchRegExp, replaceWith);

  searchRegExp = /\./g;
  replaceWith = '-';

  res = res.replace(searchRegExp, replaceWith);

  searchRegExp = /:/g;
  replaceWith = '_';

  res = res.replace(searchRegExp, replaceWith);
  return res;
};
