/**
 * 参考链接: https://github.com/vitejs/vite/blob/master/src/node/config.ts
 */
import path from 'path'
import dotenv from 'dotenv'

// 配置全局
dotenv.config({ path: path.join(__dirname, '.env') })

module.exports = {
    port: process.env.VITE_PORT,
    base: './',
    outDir: path.join(__dirname, 'dist/render'),
    // 导入别名
    alias: {
        // 别名必须以 / 开头、结尾
        // '/@/': root, -- vite 内部在用，这里不能用了
        // '/root/': __dirname, -- vite 内部在用，这里不能用了
        // '/@/': path.resolve(__dirname, './src'),
        // '/@/': path.resolve(__dirname, './src/views'),
        // '/@components/': path.resolve(__dirname, './src/components'),
        // '/@utils/': path.resolve(__dirname, './src/utils'),
        // '/@api/': path.resolve(__dirname, './src/api'),
    },
    // 配置Dep优化行为
    optimizeDeps: {
        include: ["lodash"],
        allowNodeBuiltins: ['electron-is-dev', 'electron-store', 'electron']
    },
    // 为开发服务器配置自定义代理规则。
    proxy: {
        '/api': {
        target: '127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
        }
    },
    rollupInputOptions: {
      external: [
        'crypto',
        'assert',
        'fs',
        'util',
        'os',
        'events',
        'child_process',
        'http',
        'https',
        'path',
        'electron',
      ],
      plugins: [
        {
          name: '@rollup/plugin-commonjs',
          transform(code, filename) {
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
    },
    rollupOutputOptions: {
      format: 'commonjs',
    },
}
