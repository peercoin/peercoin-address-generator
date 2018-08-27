module.exports = {
  files: {
    javascripts: {joinTo: 'app.js'},
    stylesheets: {joinTo: 'app.css'}
  },
  plugins: {
    babel: { presets: ['latest'] },
    closurecompiler: {
      compilationLevel: 'SIMPLE',
      createSourceMap: false
    },
    postcss: { processors: [require('autoprefixer')] },
    sveltejs: {
      store: true
    }
  },
  modules: {
    autoRequire: {
      'app.js': ['initialize']
    }
  }
};