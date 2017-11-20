const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const pixrem = require('gulp-pixrem');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const spawn = require('child_process').spawn;
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const stylus = require('gulp-stylus');
const gutil = require('gulp-util');
const glob = require('glob');
const es = require('event-stream');
const uglify = require('gulp-uglify');
const reload = browserSync.reload;
const gulpIf = require('gulp-if');

var env = gutil.env.production ? 'production' : 'development';

var webpackConfig = require('./webpack.config.js');
// let webpackConfig
// if (gutil.env.production) {
// 	webpackConfig = require('./djangostarter/apps/static/webpack/webpack.production.config.js');
// } else {
// 	webpackConfig = require('./djangostarter/apps/static/webpack/webpack.local.config.js');
// }
// const webpackConfig = gutil.env.production ? require('./djangostarter/apps/static/webpack/webpack.production.config.js') : 
// const webpackConfigProd = require('./djangostarter/apps/static/webpack/webpack.production.config.js');
// const webpackConfigLocal = require('./djangostarter/apps/static/webpack/webpack.local.config.js');

// Relative paths function
var pathsConfig = function (appName) {
  this.app = "./" + (appName || pjson.name);

  return {
    app: this.app,
    // templates: [this.app + '/**/templates', this.app + '/templates'],
    appTemplates: this.app + '/**/templates/**/',
    sharedTemplates: this.app + '/templates',
    css: this.app + '/static/css',
    styl: this.app + '/static/styl',
    // fonts: this.app + '/static/fonts',
    // images: this.app + '/static/images',
    js: this.app + '/static/js',
  }
};

var paths = pathsConfig('djangostarter/apps');

gulp.task('styles', function() {
  return gulp.src(paths.styl + '/main.styl')
    .pipe(stylus())
    .pipe(plumber()) // Checks for errors
    .pipe(autoprefixer({browsers: ['last 2 versions']})) // Adds vendor prefixes
    .pipe(pixrem())  // add fallbacks for rem units
    .pipe(gulp.dest(paths.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano()) // Minifies the result
    .pipe(gulp.dest(paths.css));
});

// Run django server
gulp.task('runServer', function(cb) {
	var serverSettings = gutil.env.production ? '--settings=config.settings.production' : '--settings=config.settings.local';
	console.log(serverSettings);
  var cmd = spawn('python', ['djangostarter/manage.py', 'runserver', serverSettings], {stdio: 'inherit'});
  cmd.on('close', function(code) {
    console.log('runServer exited with code ' + code);
    cb(code);
  });
});

// Browser sync server for live reload
gulp.task('browserSync', function() {
    browserSync.init(
      [paths.css + "/*.css", paths.js + "*.js", paths.templates + '*.html'], {
        proxy:  "localhost:8000",
        // port: 3010
    });
});

gulp.task('js', () => {
  gulp.src('./src/js/index.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts', function(done) {
	// glob(paths.js + '/src/**/!(*.min).js', function(err, files) {
  glob(paths.js + '/src/**/index.js', function(err, files) {
    if(err) done(err);
    var tasks = files.map(function(entry) {

    var folders = entry.split("/");
		var name = folders[folders.length-2];

		var buildFolder = gutil.env.production ? "/builds" : "/builds-dev";

    return gulp.src(entry)
    	.pipe(webpackStream(webpackConfig), webpack)
    	.pipe(gulpIf(gutil.env.production, uglify({compress: {drop_console: true }})) )
    	// .pipe(uglify({compress: {drop_console: true }}))
    	.pipe(rename({ suffix: '.min', basename: name }))
    	.pipe(gulp.dest(paths.js + buildFolder));
    });
    es.merge(tasks).on('end', done);
  })
})

gulp.task('watch', function() {
  gulp.watch(paths.styl + '/*.styl', ['styles']);
  gulp.watch(paths.js + '/src/**/**/*.js', ['scripts']).on("change", reload);
  // gulp.watch(paths.images + '/*', ['imgCompression']);
  gulp.watch(paths.appTemplates + '/**/*.html').on("change", reload);
  gulp.watch(paths.sharedTemplates + '/**/*.html').on("change", reload);

});

gulp.task('default', function() {
		// runSequence(['styles', 'scripts']);
    // runSequence(['styles', 'scripts', 'imgCompression'], ['runServer', 'browserSync', 'watch']);
    runSequence(['styles', 'scripts'], ['runServer', 'browserSync', 'watch']);
});