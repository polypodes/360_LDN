// Include gulp
var gulp = require('gulp'); 
 
// Include our plugins
// Jade tasks
var jade = require('gulp-jade');
// CSS tasks
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var prefixCss = require('gulp-autoprefixer');
// JS tasks
var uglifyJS = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
// Various tasks
var rename = require('gulp-rename');
var liveReload = require('gulp-livereload');
var concat = require('gulp-concat');
var filesize = require('gulp-filesize');
var htmlhint = require("gulp-htmlhint");
// var imageop = require('gulp-image-optimization');
var imagemin = require('gulp-imagemin');
var browsersync = require('browser-sync');

/* ------------ */
/* BROWSER SYNC */
/* ------------ */

gulp.task('browser-sync', function () {
   var files = [
      'dist/**/*.html'
   ];

   browsersync.init(files, {
      server: {
         baseDir: 'dist/'
      }
   });
});

/* DEFAULT TASKS */
/* ------------- */

// COMPILE JADE TEMPLATE
gulp.task('jade', function() {



        gulp.src('src/jade/index.jade')
            .pipe(jade({
                pretty : true,
                locals : { page : "home" }
            }))
            .pipe(rename("index.html"))
            .pipe(gulp.dest('dist/'))
    
});

// COMPILE LESS FILES
gulp.task('less', function() {

    return gulp.src('src/less/main.less')
        .pipe(less())
        .pipe(prefixCss())
        .pipe(minifyCss())
        .pipe(filesize())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('dist/css'));

});

// COMPILE SCRIPTS
gulp.task('scripts', function() {

    // Add files here
    var appFiles = [
        'src/js/*.js'
    ];

    return gulp.src(appFiles)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(concat('app.min.js'))
        .pipe(uglifyJS())
        .pipe(filesize())
        .pipe(gulp.dest('dist/js'));

});

/* ----------- */
/* OTHER TASKS */
/* ----------- */

// COMPILE VENDOR FILES
gulp.task('vendor', function() {

    // Add files here
    var vendorFiles = [
        'src/js/vendor/jquery.min.js',
        'src/js/vendor/modernizr.min.js',
        'src/js/vendor/video.js',
        'src/js/vendor/bigvideo.js'
    ];

    return gulp.src(vendorFiles)
        .pipe(concat('vendor.min.js'))
        .pipe(filesize())
        .pipe(gulp.dest('dist/js'));

});

// COMPILE VENDOR FILES
gulp.task('hammer', function() {

    // Add files here
    var vendorFiles = [
        'src/js/hammer/hammer.js'
    ];

    return gulp.src(vendorFiles)
        .pipe(concat('hammer.min.js'))
        .pipe(filesize())
        .pipe(gulp.dest('dist/js'));

});

// OPTIMIZE IMAGES
gulp.task('images', function() {

    gulp.src(['src/img/**/*.png','src/img/**/*.jpg','src/img/**/*.gif','src/img/**/*.jpeg'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));

});

// INSTALL RESET.CSS
gulp.task('install', function() {

    // Move the css reset
    return gulp.src('src/less/reset.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'));

});

/* ----------------- */
/* WATCH FOR CHANGES */
/* ----------------- */

// Watch Files For Changes
gulp.task('watch', function() {

    console.log("watching ...");

    // Livereload server
    var liveServer = liveReload();

    gulp.watch('dist/xml/**/*.*')
    .on('change', function(event){
        liveServer.changed(event.path);
        console.log('Reloading for XML');
    });

    gulp.watch('src/jade/**/*.*', ['jade'])
    .on('change', function(event){
        liveServer.changed(event.path);
        console.log('Reloading for Jade');
    });

    gulp.watch('src/js/**/*.*', ['scripts'])
    .on('change', function(event){
        liveServer.changed(event.path);
        console.log('Reloading for JS');
    });

    gulp.watch('src/less/**/*.*', ['less'])
    .on('change', function(event){
        liveServer.changed(event.path);
        console.log('Reloading for CSS');
    });

});

// Default Task
gulp.task('default', ['jade', 'less', 'vendor', 'scripts', 'watch']);