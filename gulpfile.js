var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    pump = require('pump'),
    cssmin = require('gulp-cssmin'),
    runSequence = require('run-sequence'),
    imagemin = require('gulp-imagemin');

gulp.task('build', function(callback) {

  runSequence('minifyCSS', 'jslint', 'minifyJS', 'minImages',callback);

});


gulp.task('minImages', function() {

  gulp.src('images/*.png')
      .pipe(imagemin(imagemin.optipng({optimizationLevel: 5})) )
      .pipe(gulp.dest('./Hexagon_puzzle'));

});

gulp.task('minifyJS', function() {

  return browserify({entries: './jscript.js', extensions: ['.js'],debug: true})
         .transform("babelify", {presets: ["es2015"] })
	 .bundle()
	 .pipe(source('bundle.js'))
	 .pipe(buffer())
	 .pipe(uglify())
	 .pipe(gulp.dest('dest'));

}),


gulp.task('minifyCSS', function () {

  gulp.src('./*.css')
      .pipe(cssmin() )
      .pipe(gulp.dest('./dest'));
});

gulp.task('jslint', function () {

  return gulp.src("./jscript.js")
             .pipe(eslint() )
	     .pipe(eslint.format() )
	     .pipe(eslint.failAfterError() );

});

