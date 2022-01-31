/* eslint-disable @typescript-eslint/no-explicit-any */
import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    // Handle root entry file of index.js
    // breaking case 1: hijack if it want to find index.js
    build.onResolve({ filter: /(^index\.js$)/ }, () => ({
      path: 'index.js',
      namespace: 'a',
    }));

    // Handle relative paths in a module
    // breaking case2: when package has other file bundles. medium-test-pkg
    // breaking case3: when the package require nested files. nested-test-pkg
    build.onResolve({ filter: /^\.+\// }, (args: any) => ({
      namespace: 'a',
      // For case 2 only - path: new URL(args.path, `${args.imported}/`).href,
      path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
    }));

    // Handle main file of a module
    build.onResolve({ filter: /.*/ }, async (args: any) => ({
      namespace: 'a',
      path: `https://unpkg.com/${args.path}`,
    }));
  },
});
