const {task, series, watch} = require('gulp')
const {rollup} = require('rollup')
const rollupCjs = require('@rollup/plugin-commonjs')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const rollupTypescript = require('rollup-plugin-typescript2')
const {babel: rollupBabel} = require('@rollup/plugin-babel')
const rollupHtmlTemplate = require('rollup-plugin-generate-html-template')
const rollupReplace = require('@rollup/plugin-replace')
const {uglify : rollupUglify} = require('rollup-plugin-uglify')
const browsersync = require('browser-sync').create()
const {removeSync} = require('fs-extra')
const {join, dirname} = require('path')
const root = dirname(__dirname)

function init(cb){
    ['/es', '/lib', '/bundle'].forEach(path=>removeSync(join(root, path)))
    cb()
}

async function compile(){
    const bundle = await rollup({
        input: '../src/index.ts',
        external: [
            'bezier-easing',
            /@babel\/runtime/,
            'color-string'
        ],
        plugins: [
            rollupTypescript(),
            rollupCjs(),
            nodeResolve(),
            rollupBabel({
                extensions: ['.ts', '.js'],
                babelHelpers: 'runtime',
                configFile: join(root, '/babel.config.json')
            }),
            rollupUglify()
        ]
    })
    await bundle.write({
        file: '../es/bundle.js',
        format: 'esm'
    })
    await bundle.write({
        file: '../lib/bundle.js',
        format: 'cjs'
    })
}

function devInit(){
    browsersync.init({
        server: {
            baseDir: '../bundle',
            index: 'index.html'
        },
        open: true
    })
    watch(['../dev/**/*.ts', '../dev/**/*.tsx', '../src/**/*.ts'], async function(cb){
        await devCompile()
        browsersync.reload()
        cb()
    })
}
async function devCompile(){
    const bundle = await rollup({
        input: '../dev/main.ts',
        plugins: [
            rollupTypescript(),
            rollupCjs(),
            nodeResolve(),
            rollupReplace({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            rollupBabel({
                extensions: ['.ts', '.js', '.tsx'],
                babelHelpers: 'bundled',
                presets: ["@babel/preset-react"]
            }),
            rollupHtmlTemplate({
                template: join(root, '/public/index.html'),
                target: 'index.html'
            })
        ]
    })
    await bundle.write({
        dir: '../bundle',
        format: 'umd',
    })
}

task('compile', series(init, compile))
task('devCompile', series(init, devCompile, devInit))