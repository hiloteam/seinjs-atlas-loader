/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/31/2019, 2:34:39 PM
 * @Description:
 */
import {loader} from 'webpack';
import * as path from 'path';

import {getOptions} from './options';
import processAtlas from './processAtlas';
import {emitFile} from './utils';

async function SeinJSAtlasLoader(this: loader.LoaderContext, source: string | Buffer) {
  this.cacheable();
  const callback = this.async();

  try {
    const options = getOptions(this);

    let {content, filePath: fp, processedAssets} = await processAtlas(this, source, options);
    let result = '';

    if (options.base64.enabled && options.base64.includeIndex) {
      const mimetype = 'application/json';
      content = new Buffer(content as string);

      if (content.length < options.base64.threshold) {
        result = `"data:${mimetype || ''};base64,${content.toString('base64')}"`;
      }
    }

    if (!result) {
      let {resourcePath} = this;

      fp = await emitFile(this, options, {data: content, distPath: fp, filePath: resourcePath});
      result = `"${fp}"`;
    }

    processedAssets.push(fp);

    if (process.env.SEINJS_LOADER_DEBUG) {
      console.log(processedAssets);
    }

    callback(null, `module.exports = ${result}`);
  } catch (error) {
    callback(error);
  }
}

export = SeinJSAtlasLoader;
