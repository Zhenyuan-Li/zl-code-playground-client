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
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      // Hijack the esbuild, if it want to search index.js in file system, instead we load them for it.
      if (args.path === 'index.js') {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      }

      const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
        args.path
      );
      if (cachedResult) {
        return cachedResult;
      }

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
