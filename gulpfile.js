var gulp = require('gulp'),
    prettify = require('gulp-jsbeautifier'),
    jshint = require('gulp-jshint');

gulp.task('default', function() {
	return gulp.src('mccplus.js')
	    .pipe(jshint())
		.pipe(prettify({
			config: '.jsbeautifierrc',
			mode: 'VERIFY_AND_WRITE'
		}))
		.pipe(gulp.dest('.'));
});
