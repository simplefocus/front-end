/*!
 * gulp
 * $ npm install gulp browser-sync main-bower-files fileinclude gulp-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp            = require('gulp');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var minifycss       = require('gulp-minify-css');
var jshint          = require('gulp-jshint');
var uglify          = require('gulp-uglify');
var imagemin        = require('gulp-imagemin');
var rename          = require('gulp-rename');
var concat          = require('gulp-concat');
var notify          = require('gulp-notify');
var cache           = require('gulp-cache');
var browserSync     = require('browser-sync');
var reload          = browserSync.reload;
var mainBowerFiles  = require('main-bower-files');
var fileinclude     = require('gulp-file-include');
var del             = require('del');
var path            = require('path');

// Source Paths
var src = {
  root              : './src',
  bower             : './src/_bower_components/',
  modernizr         : './src/js/vendor/modernizr-2.6.2.min.js',
  templates         : './src/_templates/',
  scss              : './src/_scss',
  css               : './src/css',
  js                : './src/js',
  img               : './src/img'
};

// Dist Paths
var dist = {
  root              : './dist',
  css               : './dist/css',
  js                : './dist/js',
  img               : './dist/img'
};

// Markup
gulp.task('markup', function() {
  return gulp.src(path.join(src.templates, '*.tpl.html'))
    .pipe(fileinclude())
    .pipe(rename({ extname: '' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest( src.root ))
    .pipe(gulp.dest( dist.root ))
    .pipe(notify({ message: 'Markup task complete' }));
});

// Styles
gulp.task('styles', function() {
  return gulp.src(path.join(src.scss, '/main.scss'))
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('src/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream:true}))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Plugins
gulp.task('plugins', function() {
  return gulp.src(mainBowerFiles())
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(src.js))
    .pipe(notify({ message: 'Plugins task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src([path.join(src.js, '/plugins.js'), path.join(src.js, '/**/*.js'), '!'+src.js+'/vendor/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(dist.js))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(dist.js))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src(path.join(src.img, '/**/*'))
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist.img))
    .pipe(notify({ message: 'Images task complete' }));
});

// Modernizr
gulp.task('modernizr', function() {
  return gulp.src(src.modernizr)
    .pipe(gulp.dest(path.join(dist.js, '/vendor')));
});

// Move assets, like .htaccess and crossdomain.xml
var assets = [
  './src/.htaccess',
  './src/*.*', // files with an extension
  '!./src/*.html', // exclude HTML, we'll handle that elsewhere.
  '.'
];

gulp.task('move', function() {
  return gulp.src(assets)
    .pipe(gulp.dest(dist.root));
});

// Clean
gulp.task('clean', function(cb) {
    del([dist.root, './src/css/*', './src/*.html'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('markup', 'styles', 'plugins', 'scripts', 'images', 'modernizr', 'move');
});

// Watch
gulp.task('watch', ['default'], function() {

  // Watch .html files
  gulp.watch('./src/**/*.html', ['markup']);

  // Watch .scss files
  gulp.watch('./src/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('./src/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('./src/img/**/*', ['images']);

  // Turn on Browser Sync server
  browserSync({
      server: {
          baseDir: "./dist/"
      }
  });

  // Watch any files in dist/, reload on change
  gulp.watch(['./dist/**']).on('change', browserSync.reload);

});