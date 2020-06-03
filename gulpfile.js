const gulp = require('gulp');
const rigger = require('gulp-rigger');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync').create();
const del = require('del');
const notify = require('gulp-notify');

function html() {
    return gulp.src('./src/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}



function styles() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on("error", notify.onError()))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}



function scripts() {
    return gulp.src('./src/js/main.js')
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
}



function font() {
    return gulp.src('./src/font/**/*.*')
        .pipe(gulp.dest('./build/font'))
        .pipe(browserSync.stream());
}



function image() {
    return gulp.src('./src/image/**/*.*')
        .pipe(imagemin({ 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [imageminPngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('./build/image'))
        .pipe(browserSync.stream());
}



function watch() {

	browserSync.init({
		server: {
			baseDir: "./build"
        },
        tunnel: false,
  host: 'localhost',
  port: 8080,
  open: true,
  logLevel: "silent",
  notify: false,
  logLevel: "info"
		
    });
    
    gulp.watch('./src/image/**/*.*', image);
    gulp.watch('./src/font/**/*.*', font);
	gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./src/**/*.html', html);
    gulp.watch('./src/**/*.html', browserSync.reload);
    
    
}



function clean() {
	return del(['build/*'])
}

gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('font', font);
gulp.task('image', image);
gulp.task('watch', watch);
gulp.task('clean', clean);

gulp.task('default', gulp.series(clean, gulp.parallel(html, styles, scripts, image, font), 'watch'))