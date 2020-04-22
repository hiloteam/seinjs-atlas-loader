/**
 * @File   : processGlTF.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/31/2019, 2:45:44 PM
 * @Description:
 */
import * as path from 'path';
import * as mime from 'mime';
import {loader} from 'webpack';

import {IOptions} from './options';
import {checkFileWithRules, readFileBuffer, getMd5, getAssetType, emitFile, getCommonDir} from './utils';

export interface IProcessResult {
  filePath: string;
  content: string | Buffer;
  processedAssets: string[];
}

export default async function processAtlas(
  context: loader.LoaderContext,
  source: string | Buffer,
  options: IOptions
): Promise<IProcessResult> {
  const {resourcePath} = context;
  const fileName = path.basename(resourcePath, path.extname(resourcePath));
  console.log(`seinjs-atlas-loader: ${fileName}`);

  let rootDir = (context.rootContext || (context as any).options.context) + '/';
  let srcDir = path.dirname(resourcePath);
  const commonDir = getCommonDir([srcDir, rootDir]) + '/';
  const tmp = path.parse(srcDir.replace(commonDir, ''));
  const distDir = tmp.dir;

  console.log(srcDir, '->', distDir);

  const md5 = getMd5(source);
  const processedAssets = [];

  const content: any = JSON.parse(source as string);

  const filePath = path.join(distDir, fileName + '-' + md5 + '.atlas');

  const uri = await processAsset(context, options, content.meta.image, srcDir, distDir);
  content.meta.image = uri;
  processedAssets.push(uri);

  return {filePath, content: JSON.stringify(content), processedAssets};
}

async function processAsset(
  context:  loader.LoaderContext,
  options: IOptions,
  uri: string,
  srcDir: string,
  distDir: string
) {
  const t = getAssetType(uri);
  
  /**
   * @todo: support absolute path
   */
  if (t !== 'relative') {
    return;
  }

  const filePath = path.resolve(srcDir, uri);
  return readFileBuffer(filePath)
    .then(async (data: Buffer) => {
      context.addDependency(path.resolve(context.context, uri));

      if (options.process.enabled) {
        for (let index = 0; index < options.process.processors.length; index += 1) {
          const processor = options.process.processors[index];
          if (checkFileWithRules(filePath, [processor.test])) {
            data = await processor.process({data, filePath});
          }
        }
      }

      if (options.base64.enabled && data.length < options.base64.threshold) {
        if (!checkFileWithRules(filePath, options.base64.excludes)) {
          const mimetype = mime.getType(filePath);
          return `data:${mimetype || ''};base64,${data.toString('base64')}`;
        }
      }

      const tmp = path.parse(uri);
      const prefix = tmp.dir ? tmp.dir.split('/') : [];
      prefix.push(tmp.name, getMd5(data));
      let fp = path.join(distDir, prefix.join('-') + tmp.ext);

      return emitFile(context, options, {data, distPath: fp, filePath});
  });
}
