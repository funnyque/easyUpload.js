module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: './src/easyUpload.js',
                dest: './dist/easyUpload.min.js'
            }
        },
        cssmin: {
            build: {
                src: './src/easy_upload.css',
                dest: './dist/easy_upload.min.css'
            }
        },
        ejs: {
            build1: {
                options: { css: './easy_upload.min.css', script: './easyUpload.min.js' },
                src: './src/template.html',
                dest: './dist/index.html'
            },
            build2: {
                options: { css: './dist/easy_upload.min.css', script: './dist/easyUpload.min.js' },
                src: './src/template.html',
                dest: './index.html'
            }
        },
        watch: {
            scripts: {
                files: './src/easyUpload.js',
                tasks: ['uglify']
            },
            css: {
                files: './src/easy_upload.css',
                tasks: ['cssmin']
            },
            html: {
                files: './src/template.html',
                tasks: ['ejs']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-ejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var tasks = ['uglify', 'cssmin', 'ejs'];
    if (process.env.NODE_ENV == 'dev') tasks.push('watch'); //dev时开启监听
    grunt.registerTask('default', tasks);
};