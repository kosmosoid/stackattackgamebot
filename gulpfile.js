const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');

const jsFiles = [
    './web/js/src/cookies.js',
    './web/js/src/mobileControls.js',
    './web/js/src/translations.js',
    './web/js/src/audio.js',
    './web/js/src/utils.js',
    './web/js/src/main.js',
    './web/js/src/box.js',
    './web/js/src/crane.js',
    './web/js/src/player.js',
    './web/js/src/bullet.js'
];

function scripts() {
    return gulp.src(jsFiles)
        .pipe(concat('bundle.js'))
        .pipe(terser())
        .pipe(gulp.dest('./web/js'));
}

// Экспортируем задачу, чтобы её можно было запустить
exports.default = scripts;