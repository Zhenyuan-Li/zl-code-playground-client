/* eslint-disable @typescript-eslint/no-explicit-any */
import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';
import axios from 'axios';

// Because localStorage only store the string
const fileCache = localForage.createInstance({
  name: 'filecache',
});

// // Usage of indexedDB with localForage,(stored in key-value pair). Database can be seen in Application
// // The syntax is defining a self-invoking function (()=>{})()
// (async () => {
//   await fileCache.setItem('color', 'red');

//   const color = await fileCache.getItem('color');
//   console.log(color);
// })();

export const fetchPlugin = (inputCode: string) => ({
  name: 'fetch-plugin',
  setup(build: esbuild.PluginBuild) {
    // 1. Hijack the esbuild, if it want to search index.js in file system, instead we load them for it.
    build.onLoad({ filter: /(^index\.js$)/ }, () => ({
      loader: 'jsx',
      contents: inputCode,
    }));

    // Extracting Common Caching Logic, since esbuild execute all the onload function one by one.
    // eslint-disable-next-line consistent-return
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
        args.path
      );
      if (cachedResult) {
        return cachedResult;
      }
    });

    // 2. Handling css file
    build.onLoad({ filter: /.css$/ }, async (args: any) => {
      const { data, request } = await axios.get(args.path);
      // encode (into one line) the whatever css file that can be passed into the param
      const escaped = data
        .replace(/\n/g, '')
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'");
      // trick the esbuild to render css
      const contents = `
      const style = document.createElement('style');
      style.innerText = '${escaped}';
      document.head.appendChild(style)`;

      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents,
        resolveDir: new URL('./', request.responseURL).pathname,
      };
      await fileCache.setItem(args.path, result);

      return result;
    });

    // 3. normal js file
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      const { data, request } = await axios.get(args.path);

      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents: data,
        resolveDir: new URL('./', request.responseURL).pathname,
      };
      await fileCache.setItem(args.path, result);

      return result;
    });
  },
});
