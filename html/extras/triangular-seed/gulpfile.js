'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

gulp.task('styles', function () {

  var sassOptions = {
    style: 'expanded',
    includePaths: [
      'bower_components'
    ]
  };

  var injectFiles = gulp.src([
    'bower_components/triangular/triangular.scss',
    'app/**/*.scss',
    '!app/app.scss'
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace('app/', '');
      return '@import \'' + filePath + '\';';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  var indexFilter = $.filter('app.scss', {
    restore: true
  });

  return gulp.src([
    'app/app.scss'
  ])
    // .pipe(indexFilter)
    .pipe($.inject(injectFiles, injectOptions))
    .pipe($.debug({title: 'inject'}))
    .pipe(indexFilter.restore)
    .pipe($.sass(sassOptions))

  .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}))
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('app/'));
});

gulp.task('test', function () {
    return gulp.src([
      'app/**/*.scss',
      '!app/app.scss',
      '!app/**/_*.scss'
    ], { read: false })
    .pipe($.debug({title: 'test'}))
});

gulp.task('inject', ['styles'], function () {
  var injectStyles = gulp.src([
    'app/**/*.css'
  ], { read: false });

  var injectScripts = gulp.src([
    'app/**/*.js',
  ]).pipe($.angularFilesort());

  var injectOptions = {
    addRootSlash: false
  };

  var wiredepOptions = {
    directory: 'bower_components',
    exclude: [/bootstrap\.css/, /foundation\.css/, /material-design-iconic-font\.css/, /default\.css/]
  };

  return gulp.src('index.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest('.'));

});
