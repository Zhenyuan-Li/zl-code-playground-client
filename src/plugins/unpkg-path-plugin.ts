/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    // 1. figure out where the index.js is stored
    // 3. If there are any import, figure out where the requested file is.
    build.onResolve({ filter: /.*/ }, async (args: any) => {
      console.log('onResolve', args);
      if (args.path === 'index.js') {
        return { path: args.path, namespace: 'a' };
      }

      // // breaking case1: when package has other file bundles. medium-test-pkg
      if (args.path.includes('./') || args.path.includes('../')) {
        return {
          namespace: 'a',
          // case 1 - path: new URL(args.path, `${args.imported}/`).href,
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
        };
      }

      // breaking case2: when the package require nested files. nested-test-pkg

      // // simple case 1: only for tiny test pkg
      // if (args.path === 'tiny-test-pkg') {
      //   return {
      //     path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js',
      //     namespace: 'a',
      //   };
      // }

      // // general cases
      return {
        namespace: 'a',
        path: `https://unpkg.com/${args.path}`,
      };
    });

    // Hijack the esbuild, if it want to search index.js in file system, instead we load them for it.
    // 2. Attempt to load up the index.js file
    // 4. Attempt to load that file up
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      console.log('onLoad', args);

      if (args.path === 'index.js') {
        return {
          loader: 'jsx',
          contents: `
            // const react = require('react');
            // const reactDOM = require('react-dom)
            import React, {useState} from 'react'
            console.log(message);
          `,
        };
      }
      const { data, request } = await axios.get(args.path);
      // console.log(request);
      // console.log(data);
      return {
        loader: 'jsx',
        contents: data,
        resolveDir: new URL('./', request.responseURL).pathname,
      };
    });
  },
});
