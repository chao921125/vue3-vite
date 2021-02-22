/**
 * 参考链接: https://github.com/vitejs/vite/blob/master/src/node/config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
console.log(path.resolve(__dirname, './src'))
console.log(process['env']);

// https://vitejs.dev/config/
export default defineConfig({
  // root: 'index.html', // 入口
  base: './', // 公共基础路径
  // mode: 'development', // 指令覆盖构建模式 --mode
  // define: '',
  plugins: [ // 插件
    vue(),
    {
      name: '@rollup/plugin-commonjs',
      transform(code: string, filename: string | string[]) {
        if (filename.includes(`/node_modules/`)) {
          return code
        }

        const cjsRegexp = /(const|let|var)[\n\s]+(\w+)[\n\s]*=[\n\s]*require\(["|'](.+)["|']\)/g
        const res = code.match(cjsRegexp)
        if (res) {
          // const Store = require('electron-store') -> import Store from 'electron-store'
          code = code.replace(cjsRegexp, `import $2 from '$3'`)
        }
        return code
      },
    }
  ],
  // publicDir: 'public', // 静态资源根路径
  resolve: {
    alias: {
      // 别名必须以 / 开头、结尾
      // '/@/': root, -- vite 内部在用，这里不能用了
      // '/root/': __dirname, -- vite 内部在用，这里不能用了
      '/@/': path.resolve(__dirname, './src'),
      // '/@/': path.resolve(__dirname, './src/views'),
      // '/@components/': path.resolve(__dirname, './src/components'),
      // '/@utils/': path.resolve(__dirname, './src/utils'),
      // '/@api/': path.resolve(__dirname, './src/api'),
    },
    // dedupe: '',
    // conditions: '',
    // mainFields: '',
    // extensions: '',
  },
  css: {
    // modules: '',
    // postcss: '',
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~@assets/styles/public.scss";`,
      }
    },
  },
  // json: {
  //   namedExports: true,
  //   stringify: false,
  // },
  // esbuild: { // false or jsx settings
  //   jsxFactory: 'h',
  //   jsxFragment: 'Fragment'
  // },
  // assetsInclude: '', // 静态资源处理
  logLevel: 'info', // 可以根据开发环境动态改变 'info' | 'warn' | 'error' | 'silent'
  clearScreen: true, // --clearScreen
  server: {
    // host: 'localhost',
    port: process.env.VITE_PORT,
    // strictPort: true, // 存在冲突端口，则继续下找可用端口
    // https: '', // boolean | https.ServerOptions
    // open: '', // boolean | string
    proxy: {
      // string shorthand
      // '/foo': 'http://localhost:4567/foo',
      // with options
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // with RegEx
      // '^/fallback/.*': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/fallback/, '')
      // }
    },
    cors: true, // boolean | CorsOptions
    // force: false, // boolean
    // hmr: false, // boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean }
    // watch: '', // object
  },
  build: {
    target: 'modules',
    // polyfillDynamicImport: '', // boolean
    outDir: 'dist', // path.join(__dirname, 'dist/render'),
    // assetsDir: 'assets',
    // assetsInlineLimit: 4096,
    // cssCodeSplit: true,
    sourcemap: false,
    // rollupOptions: '',
    // commonjsOptions: '',
    // lib: '',
    // manifest: false, // manifest.json
    // minify: 'terser', // boolean | 'terser' | 'esbuild'
    // terserOptions: '',
    // cleanCssOptions: '',
    // write: true,
    // emptyOutDir: '', // outDiroutDir--emptyOutDir
    // brotliSize: true, // 压缩大小报告
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    // entries: '',
    // exclude: '',
    include: ["lodash"],
    allowNodeBuiltins: ['electron-is-dev', 'electron-store', 'electron'],
  },
  ssr: false,
  // ssr: {
  //   external: '',
  //   noExternal: '',
  // },
})
