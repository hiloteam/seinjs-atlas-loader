# seinjs-atlas-loader

```shell
npm i seinjs-atlas-loader --save
```

Webpack config:

```js
{
  test: /\.(atlas|atlas\.json)$/,
  use: [
    {
      loader: 'seinjs-atlas-loader',
      options: {
        // Prefix for all assets, defaults to 'output.publicPath'
        publicPath?: string;
        base64?: {
          // Enable base64
          enabled: boolean;
          // Default to 1000
          threshold?: number;
          // If allow the json/atlas files to base64
          includeIndex?: boolean;
          // Rules for excluding unnecessary files
          excludes?: (RegExp | ((path: string) => boolean))[],
        };
        // Pre process files before emit it
        process?: {
          // Enable process
          enabled: boolean;
          // You custom processors
          processors: {
            test?: RegExp | ((path: string) => boolean),
            process(options: {data: Buffer | string, filePath: string}): Promise<Buffer>;
          }[];
        };
        // for publishing your resource to cdn
        publish?: {
          // Enable publish
          enabled: boolean;
          // Rules for excluding unnecessary files
          excludes?: (RegExp | ((path: string) => boolean))[];
          // You custom publisher
          publisher: {
            publish(options: {data: Buffer | string, filePath: string, distPath: string}): Promise<string>;
          };
        };
      }
    }
  ]
}
```

Load atlas file:

````
import someGLTF from "path/to/file.atlas";
 
````
