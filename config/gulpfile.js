const {task, src, dest, series} = require('gulp')
const {rollup} = require('rollup')
const rollupCjs = require('@rollup/plugin-commonjs')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const rollupTypescript = require('rollup-plugin-typescript2')
const {babel: rollupBabel} = require('@rollup/plugin-babel')
const {removeSync} = require('fs-extra')
const {join, dirname} = require('path')
const root = dirname(__dirname)

function init(cb){
    ['/es', '/lib'].forEach(path=>removeSync(join(root, path)))
    cb()
}

async function compile(){
    const bundle = await rollup({
        input: '../src/index.ts',
        external: [
            'bezier-easing',
            /@babel\/runtime/
        ],
        plugins: [
            rollupTypescript(),
            rollupCjs(),
            nodeResolve(),
            rollupBabel({
                extensions: ['.ts', '.js'],
                babelHelpers: 'runtime',
                configFile: join(root, '/babel.config.json')
            })
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

task('compile', series(init, compile))