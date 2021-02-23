/**
 * 参考链接: https://github.com/vitejs/vite/blob/master/src/node/config.ts
 */
import type { UserConfig, ConfigEnv } from 'vite';

import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig  => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  return {
    // root: 'index.html', // 入口
    base: './', // 公共基础路径
    // mode: 'development', // 指令覆盖构建模式 --mode
    define: {
      // setting vue-i18-next
      // Suppress warning
      __VUE_I18N_LEGACY_API__: false,
      __VUE_I18N_FULL_INSTALL__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
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
        '/@components/': path.resolve(__dirname, './src/components'),
        '/@plugins/': path.resolve(__dirname, './src/plugins'),
        '/@utils/': path.resolve(__dirname, './src/utils'),
        '/@api/': path.resolve(__dirname, './src/api'),
        '/@assets/': path.resolve(__dirname, './src/assets'),
      },
      // dedupe: '',
      // conditions: '',
      // mainFields: '',
      // extensions: '',
    },
    css: {
      // modules: '',
      postcss: {
        plugins: [
            require('postcss-pxtorem')({
                rootValue: 16, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
                unitPrecision: 5, //允许REM单位增长到的十进制数字。
                //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
                // propBlackList: [], //黑名单
                exclude: /node_modules/i,  //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                // selectorBlackList: [], //要忽略并保留为px的选择器
                // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
                replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
                mediaQuery: false,  //（布尔值）允许在媒体查询中转换px。
                minPixelValue: 2 //设置要替换的最小像素值(3px会被转rem)。 默认 0
            }),
        ]
      },
      preprocessorOptions: {
        less: {
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
      port: 3333,
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
      chunkSizeWarningLimit: 1024,
    },
    optimizeDeps: {
      // entries: '',
      include: ["lodash"],
      exclude: ['vue-demi'],
    },
    // ssr: {
    //   external: '',
    //   noExternal: '',
    // },
  }
}
