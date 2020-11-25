interface SharedConfig {
    /**
     * Project root directory. Can be an absolute path, or a path relative from
     * the location of the config file itself.
     * @default process.cwd()
     */
    root?: string
    /**
     * Import alias. The entries can either be exact request -> request mappings
     * (exact, no wildcard syntax), or request path -> fs directory mappings.
     * When using directory mappings, the key **must start and end with a slash**.
     *
     * Example `vite.config.js`:
     * ``` js
     * module.exports = {
     *   alias: {
     *     // alias package names
     *     'react': '@pika/react',
     *     'react-dom': '@pika/react-dom'
     *
     *     // alias a path to a fs directory
     *     // the key must start and end with a slash
     *     '/@foo/': path.resolve(__dirname, 'some-special-dir')
     *   }
     * }
     * ```
     */
    alias?: Record<string, string>
    /**
     * Function that tests a file path for inclusion as a static asset.
     */
    assetsInclude?: (file: string) => boolean
    /**
     * Custom file transforms.
     */
    transforms?: Transform[]
    /**
     * Custom index.html transforms.
     */
    indexHtmlTransforms?: IndexHtmlTransform[]
    /**
     * Define global variable replacements.
     * Entries will be defined on `window` during dev and replaced during build.
     */
    define?: Record<string, any>
    /**
     * Resolvers to map dev server public path requests to/from file system paths,
     * and optionally map module ids to public path requests.
     */
    resolvers?: Resolver[]
    /**
     * Configure dep optimization behavior.
     *
     * Example `vite.config.js`:
     * ``` js
     * module.exports = {
     *   optimizeDeps: {
     *     exclude: ['dep-a', 'dep-b']
     *   }
     * }
     * ```
     */
    optimizeDeps?: DepOptimizationOptions
    /**
     * Options to pass to `@vue/compiler-dom`
     *
     * https://github.com/vuejs/vue-next/blob/master/packages/compiler-core/src/options.ts
     */
    vueCompilerOptions?: CompilerOptions
    /**
     * Configure what tags/attributes to trasnform into asset url imports,
     * or disable the transform altogether with `false`.
     */
    vueTransformAssetUrls?: SFCTemplateCompileOptions['transformAssetUrls']
    /**
     * The options for template block preprocessor render.
     */
    vueTemplatePreprocessOptions?: Record<
        string,
        SFCTemplateCompileOptions['preprocessOptions']
    >
    /**
     * Transform functions for Vue custom blocks.
     *
     * Example `vue.config.js`:
     * ``` js
     * module.exports = {
     *   vueCustomBlockTransforms: {
     *     i18n: src => `export default Comp => { ... }`
     *   }
     * }
     * ```
     */
    vueCustomBlockTransforms?: Record<string, CustomBlockTransform>
    /**
     * Configure what to use for jsx factory and fragment.
     * @default 'vue'
     */
    jsx?:
        | 'vue'
        | 'preact'
        | 'react'
        | {
            factory?: string
            fragment?: string
        }
    /**
     * Environment mode
     */
    mode?: string
    /**
     * CSS preprocess options
     */
    cssPreprocessOptions?: CssPreprocessOptions
    /**
     * CSS modules options
     */
    cssModuleOptions?: SFCAsyncStyleCompileOptions['modulesOptions']
    /**
     * Enable esbuild
     * @default true
     */
    enableEsbuild?: boolean
    /**
     * Environment variables parsed from .env files
     * only ones starting with VITE_ are exposed on `import.meta.env`
     * @internal
     */
    env?: DotenvParseOutput
}

interface HmrConfig {
    protocol?: string
    hostname?: string
    port?: number
    path?: string
}
  
interface ServerConfig {
    /**
     * Configure hmr websocket connection.
     */
    hmr?: HmrConfig | boolean
    /**
     * Configure dev server hostname.
     */
    hostname?: string
    port?: number
    open?: boolean
    /**
     * Configure https.
     */
    https?: boolean
    httpsOptions?: ServerOptions
    /**
     * Configure custom proxy rules for the dev server. Uses
     * [`koa-proxies`](https://github.com/vagusX/koa-proxies) which in turn uses
     * [`http-proxy`](https://github.com/http-party/node-http-proxy). Each key can
     * be a path Full options
     * [here](https://github.com/http-party/node-http-proxy#options).
     *
     * Example `vite.config.js`:
     * ``` js
     * module.exports = {
     *   proxy: {
     *     // string shorthand
     *     '/foo': 'http://localhost:4567/foo',
     *     // with options
     *     '/api': {
     *       target: 'http://jsonplaceholder.typicode.com',
     *       changeOrigin: true,
     *       rewrite: path => path.replace(/^\/api/, '')
     *     }
     *   }
     * }
     * ```
     */
    proxy?: Record<string, string | ProxiesOptions>
    /**
     * Configure CORS for the dev server.
     * Uses [@koa/cors](https://github.com/koajs/cors).
     * Set to `true` to allow all methods from any origin, or configure separately
     * using an object.
     */
    cors?: CorsOptions | boolean
    /**
     * A plugin function that configures the dev server. Receives a server plugin
     * context object just like the internal server plugins. Can also be an array
     * of multiple server plugin functions.
     */
    configureServer?: ServerPlugin | ServerPlugin[]
}

interface BuildConfig extends Required<SharedConfig> {
    /**
     * Entry. Use this to specify a js entry file in use cases where an
     * `index.html` does not exist (e.g. serving vite assets from a different host)
     * @default 'index.html'
     */
    entry: string
    /**
     * Base public path when served in production.
     * @default '/'
     */
    base: string
    /**
     * Directory relative from `root` where build output will be placed. If the
     * directory exists, it will be removed before the build.
     * @default 'dist'
     */
    outDir: string
    /**
     * Directory relative from `outDir` where the built js/css/image assets will
     * be placed.
     * @default '_assets'
     */
    assetsDir: string
    /**
     * Static asset files smaller than this number (in bytes) will be inlined as
     * base64 strings. Default limit is `4096` (4kb). Set to `0` to disable.
     * @default 4096
     */
    assetsInlineLimit: number
    /**
     * Whether to code-split CSS. When enabled, CSS in async chunks will be
     * inlined as strings in the chunk and inserted via dynamically created
     * style tags when the chunk is loaded.
     * @default true
     */
    cssCodeSplit: boolean
    /**
     * Whether to generate sourcemap
     * @default false
     */
    sourcemap: boolean | 'inline'
    /**
     * Set to `false` to disable minification, or specify the minifier to use.
     * Available options are 'terser' or 'esbuild'.
     * @default 'terser'
     */
    minify: boolean | 'terser' | 'esbuild'
    /**
     * The option for `terser`
     */
    terserOptions: RollupTerserOptions
    /**
     * Transpile target for esbuild.
     * @default 'es2020'
     */
    esbuildTarget: string
    /**
     * Build for server-side rendering, only as a CLI flag
     * for programmatic usage, use `ssrBuild` directly.
     * @internal
     */
    ssr?: boolean

    // The following are API / config only and not documented in the CLI. --------
    /**
     * Will be passed to rollup.rollup()
     *
     * https://rollupjs.org/guide/en/#big-list-of-options
     */
    rollupInputOptions: ViteRollupInputOptions
    /**
     * Will be passed to bundle.generate()
     *
     * https://rollupjs.org/guide/en/#big-list-of-options
     */
    rollupOutputOptions: RollupOutputOptions
    /**
     * Will be passed to rollup-plugin-vue
     *
     * https://github.com/vuejs/rollup-plugin-vue/blob/next/src/index.ts
     */
    rollupPluginVueOptions: Partial<RollupPluginVueOptions>
    /**
     * Will be passed to @rollup/plugin-node-resolve
     * https://github.com/rollup/plugins/tree/master/packages/node-resolve#dedupe
     */
    rollupDedupe: string[]
    /**
     * Whether to log asset info to console
     * @default false
     */
    silent: boolean
    /**
     * Whether to write bundle to disk
     * @default true
     */
    write: boolean
    /**
     * Whether to emit index.html
     * @default true
     */
    emitIndex: boolean
    /**
     * Whether to emit assets other than JavaScript
     * @default true
     */
    emitAssets: boolean
    /**
     * Whether to emit a manifest.json under assets dir to map hash-less filenames
     * to their hashed versions. Useful when you want to generate your own HTML
     * instead of using the one generated by Vite.
     *
     * Example:
     *
     * ```json
     * {
     *   "main.js": "main.68fe3fad.js",
     *   "style.css": "style.e6b63442.css"
     * }
     * ```
     * @default false
     */
    emitManifest?: boolean
    /**
     * Predicate function that determines whether a link rel=modulepreload shall be
     * added to the index.html for the chunk passed in
     */
    shouldPreload: ((chunk: OutputChunk) => boolean) | null
    /**
     * Enable 'rollup-plugin-vue'
     * @default true
     */
    enableRollupPluginVue?: boolean
    /**
     * Plugin functions that mutate the Vite build config. The `builds` array can
     * be added to if the plugin wants to add another Rollup build that Vite writes
     * to disk. Return a function to gain access to each build's output.
     * @internal
     */
    configureBuild?: BuildPlugin | BuildPlugin[]
}

module.exports = {

}