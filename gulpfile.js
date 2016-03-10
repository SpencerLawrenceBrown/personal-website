//include gulp
var gulp 		= require('gulp');

//include our plugins
var jshint 		= require('gulp-jshint');
var less 		= require('gulp-less');
var concat 		= require('gulp-concat');
var uglify		= require('gulp-uglify');
var rename		= require('gulp-rename');
var concatcss  	= require('gulp-concat-css');
var cssnano		= require('gulp-cssnano');

//Lint Task
gulp.task('lint', function(){
	return gulp.src('./public/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//Compile Less & Concat CSS * Minify
gulp.task('buildCSS', function(){
	return gulp.src('./public/styles/less/styles.less')
		.pipe(less())
		.pipe(concatcss('main.css'))
		.pipe(gulp.dest('./public/dist'))
		.pipe(cssnano())
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('./public/dist'));
});

//Concat and Minify JSS
gulp.task("buildJSDev", function(){
	return gulp.src("./public/js/*.js")
		.pipe(concat('main.build.js'))
		.pipe(gulp.dest('./public/dist'))
		.pipe(rename('main.build.min.js'))
		.pipe(gulp.dest("./public/dist"));
});

//Concat and Uglify JSS
gulp.task("buildJSProd", function(){
	return gulp.src("./public/js/*.js")
		.pipe(concat('main.build.js'))
		.pipe(gulp.dest('./public/dist'))
		.pipe(rename('main.build.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest("./public/dist"));
});

//Watch
gulp.task("watch", function(){
	gulp.watch('./public/js/*.js', ['buildJSDev']);
	gulp.watch('./public/styles/less/**/*.less', ['buildCSS']);
});

//Default Task
gulp.task('default', ['lint', 'buildCSS', 'buildJSDev', 'watch']);
gulp.task('buildProduction', ['lint', 'buildCSS', 'buildJSProd', 'watch']);
