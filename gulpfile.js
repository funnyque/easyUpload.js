var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

function minifyCss(cb) {
    gulp.src('./src/easy_upload.css')
        .pipe(minify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'));
    cb();
}
function minifyJs(cb) {
    gulp.src('./src/easyUpload.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
    cb();
}
function repDist (cb) {
    gulp.src('./src/index.html')
    .pipe(replace(/\.\/easyUpload.js/, './easyUpload.min.js'))
    .pipe(replace(/\.\/easy_upload.css/, './easy_upload.min.css'))
    .pipe(gulp.dest('./dist'));
    cb();
}
function repIndex (cb) {
    gulp.src('./src/index.html')
    .pipe(replace(/\.\/easyUpload.js/, './dist/easyUpload.min.js'))
    .pipe(replace(/\.\/easy_upload.css/, './dist/easy_upload.min.css'))
    .pipe(gulp.dest('./'));
    cb();
}

exports.default = gulp.series(minifyCss, minifyJs, repDist, repIndex);