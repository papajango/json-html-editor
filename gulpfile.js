'use strict';

var gulp = require('gulp'),
	minify = require('gulp-minify');

gulp.task('minify-js', function() {
	gulp.src('script.js')
		.pipe(minify())
		.pipe(gulp.dest('dist'))
});
