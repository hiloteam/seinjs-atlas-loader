/**
 * @File   : options.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/31/2019, 2:46:53 PM
 * @Description:
 */
import {loader} from 'webpack';
import * as loaderUtils from 'loader-utils';

export interface IOptions {
  // Prefix for all assets, defaults to 'output.publicPath'
  publicPath?: string;
  base64?: {
    // Enable base64
    enabled: boolean;
    // Default to 1000
    threshold?: number;
    // If allow the ATLAS files to base64
    includeIndex?: boolean;
    // Rules for excluding unnecessary files
    excludes?: (RegExp | ((path: string) => boolean))[],
  };
  process?: {
    // Enable process
    enabled: boolean;
    // You custom processors
    processors: {
      test?: RegExp | ((path: string) => boolean),
      process(options: {data: Buffer | string, filePath: string}): Promise<Buffer>;
    }[];
  };
  publish?: {
    // Enable publish
    enabled: boolean;
    // Rules for excluding unnecessary files
    excludes?: (RegExp | ((path: string) => boolean))[];
    // You custom publisher
    publisher: {
      publish(options: {data: Buffer | string, filePath: string, distPath: string}): Promise<string>;
    };
  }
}

const DEFAULT_OPTIONS: IOptions = {
  publicPath: '/',
  base64: {
    enabled: false,
    threshold: 1000,
    includeIndex: false,
    excludes: []
  },
  process: {
    enabled: false,
    processors: []
  },
  publish: {
    enabled: false,
    excludes: [],
    publisher: null
  }
};

export function getOptions(context: loader.LoaderContext) {
  let options: IOptions = loaderUtils.getOptions(context) || {};

  return {
    publicPath: options.publicPath || context._compiler.options.output.publicPath || DEFAULT_OPTIONS.publicPath,
    base64: {
      ...DEFAULT_OPTIONS.base64,
      ...(options.base64 || {})
    },
    process: {
      ...DEFAULT_OPTIONS.process,
      ...(options.process || {})
    },
    publish: {
      ...DEFAULT_OPTIONS.publish,
      ...(options.publish || {})
    }
  }
}
