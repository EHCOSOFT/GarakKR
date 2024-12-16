// gulp 및 패키지 모듈 호출
var
gulp = require('gulp'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
sourcemaps = require('gulp-sourcemaps'),
scss = require('gulp-sass')(require('sass'));
fileinclude = require('gulp-file-include'),
changed = require('gulp-changed'),
browserSync = require('browser-sync').create(); // browser-sync 호출
livereload  = require('gulp-livereload'); // livereload 호출
/**
 * ==============================+
 * @Path 정의
 * ==============================+
 */
var src   = 'public/src';
var dist  = 'public/dist';
var paths = {
    include : src + '/**/*.html',
    html : src + '/.html',
    js : src + '/js/**/*.js',
    scss : src + '/sass/**/*.scss'
};


/**
 * =====================================+
 * @task : HTML livereload 반영
 * =====================================+
 */
gulp.task('html', function () {
    return gulp
        .src('public/dist/*.html')

        /**
         * html 파일을 읽어온 후 livereload 호출하여 브라우저에 반영
         */
        .pipe(livereload());
});




/**
 * =====================================+
 * @task : Script 병합,압축,min 파일 생성
 * =====================================+
 */
gulp.task('js:combine', function () {
    return gulp
        .src(paths.js)
        .pipe(concat('combined.js'))
        .pipe(gulp.dest(dist+'/js'))
        .pipe(uglify())
        .pipe(rename({suffix : ".min"}))
        .pipe(gulp.dest(dist+'/js'))

        /**
         * 스크립트 파일을 browserSync 로 브라우저에 반영
         */
        .pipe(browserSync.reload({
        	stream : true
        }));
});

/**
 * ==============================+
 * @SCSS : SCSS Config(환경설정)
 * ==============================+
 */
var scssOptions = {
    outputStyle : "expanded",
    indentType : "tab",
    indentWidth : 1,
    precision: 3,
    sourceComments: false
};

/**
 * ==================================+
 * @task : SCSS Compile & sourcemaps
 * ==================================+
 */

gulp.task('scss:compile', function () {
    return gulp
        .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(scss(scssOptions).on('error', scss.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist + '/css/front'))

        /**
         * SCSS 컴파일을 수행한 후 browserSync 로 브라우저에 반영
         */
        .pipe(browserSync.reload({
            stream : true
        }));
});

/**
 * ==============================+
 * @task : fileinclude
 * ==============================+
 */

gulp.task('fileinclude', function () {
	return gulp
	.src('public/src/*.html')
	/*.pipe(changed('public/dist/'))*/
	.pipe(fileinclude('@@'))
	.pipe(gulp.dest('public/dist/'))

	.pipe(browserSync.reload({
        stream : true
    }));
});

/**
 * ==============================+
 * @task : browserSync
 * ==============================+
 */
gulp.task('browserSync', gulp.series(['html', 'js:combine', 'scss:compile','fileinclude']), function () {
    return browserSync.init({
        port : 3111,
        server: {
            baseDir: 'public/dist'
        }
    });
});

/**
 * ==================================+
 * @task : watch 파일 변경을 감지
 * ==================================+
 */


gulp.task('watch', function (){
    livereload.listen();
    gulp.watch(paths.include, gulp.series(['fileinclude']));
    gulp.watch(paths.html, gulp.series(['html']));
    gulp.watch(paths.js, gulp.series(['js:combine']));
    gulp.watch(paths.scss, gulp.series(['scss:compile']));
    gulp.watch(dist + '/**').on('change', livereload.changed);
    return browserSync.init({
        port : 3111,
        server: {
            baseDir: 'public/dist'
        }
    });
});

/**
 * ==============================+
 * @task : gulp default
 * ==============================+
 */
gulp.task('default', gulp.series(['browserSync','watch']));
gulp.task('build', gulp.series(['html', 'js:combine', 'scss:compile','fileinclude']));
