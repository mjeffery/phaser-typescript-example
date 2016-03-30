var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

gulp.task('clean', function(cb) {
	del.sync(['./.tmp/**']);
});

gulp.task('copy-libraries', function() {
	return gulp.src([
			'./node_modules/phaser/dist/phaser.js',
			'./node_modules/phaser/typescript/*.d.ts',
			'!**/*.comments.d.ts'
		])
		.pipe(gulp.dest('./.tmp/lib'));
});

gulp.task('typescript', ['copy-libraries'], function() {
	var tsResult = 
		gulp.src(['src/**/*.ts', '.tmp/lib/*.{js,d.ts}'])
			.pipe(sourcemaps.init())
			.pipe(tsc({
				noExternalResolve: true,
				sortOutput: true
			}));

	return tsResult.js
				.pipe(concat('app.js'))
				.pipe(sourcemaps.write())
				.pipe(gulp.dest('.tmp/js'));
});

gulp.task('html', function() {
	gulp.src('src/**/*.html').pipe(gulp.dest('.tmp'));
});

gulp.task('build', ['copy-libraries', 'typescript', 'html']);

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: '.tmp'
		}
	});	

	gulp.watch('.tmp/js/*.js').on('change', browserSync.reload);
});

gulp.task('serve', ['clean', 'build', 'browser-sync']);

