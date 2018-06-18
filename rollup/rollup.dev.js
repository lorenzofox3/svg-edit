import node from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';

export default {
  input: './dist/src/js/app/index.js',
  output: [{
    file: './dist/js/bundle/index.js',
    format: 'es'
  }],
  plugins: [node(), cjs()]
}