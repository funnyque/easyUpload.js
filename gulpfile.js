var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var ejs = require('gulp-ejs');

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
function doEjs(obj, dir, cb) {
    gulp.src('./src/template.html')
    .pipe(ejs({ 
        css: obj.css,
        script: obj.script
    }))
    .pipe(rename({ basename: 'index' }))
    .pipe(gulp.dest(dir));
    cb();
}
function buildHtml(cb) {
    doEjs({ 
        css: './easy_upload.min.css',
        script: './easyUpload.min.js' 
    }, './dist', cb);
    doEjs({ 
        css: './dist/easy_upload.min.css',
        script: './dist/easyUpload.min.js' 
    }, './', cb);
}

exports.default = gulp.series(minifyCss, minifyJs, buildHtml);