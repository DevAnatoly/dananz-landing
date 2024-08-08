const {src, dest, watch, parallel, series} = require('gulp');

const scss         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const browserSync  = require('browser-sync').create();
const clean        = require('gulp-clean');
const avif         = require('gulp-avif');
const webp         = require('gulp-webp');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const fonter       = require('gulp-fonter');
const ttf2woff2    = require('gulp-ttf2woff2');
const rename       = require('gulp-rename');
const pugHTML      = require('gulp-pug');

function pug(){
    return src(['app/pug/**/*.pug', '!app/pug/sections/**/*.pug', '!app/pug/layout/*.pug'])
           .pipe(
                pugHTML({ pretty: true })
            )
            .pipe(rename((file)=>{
                if (file.dirname.includes('pages')){
                    file.dirname = '';
                }
            }))
            .pipe(dest('app'));
}

function fonts() {
    return src('app/fonts/src/*.*',{encoding:false})
    .pipe(fonter({
        formats: ['woff', 'ttf']
    }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'))
}


function images() {
    return src([
        'app/images/src/*.{png,jpg,svg}',
        '!app/images/src/*.svg'
    ])
    .pipe(newer('app/images'))

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images'))
    .pipe(webp())

    .pipe(src('app/images/src/*.*'))
    .pipe(newer('app/images'))
    .pipe(imagemin())

    .pipe(dest('app/images'))
}

function scripts() {
    return src(['app/js/main.js'])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        .pipe(concat('style.min.css'))
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function watching() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
    watch(['app/scss/style.scss', 'app/scss/**/*.scss'], styles)
    watch(['app/images/src'], images)
    watch(['app/js/main.js'], scripts)
    watch('app/pug/**/*.pug', pug)
    watch(['app/**/*.html']).on('change', browserSync.reload);
}


function cleanDist() {
    return src('dist')
    .pipe(clean())
}

function building(){
    return src([
        'app/css/style.min.css',
        'app/images/*.*',
        'app/fonts/*.*',
        'app/js/*.js',
        'app/**/*.html',
        'app/sprites.svg'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

exports.styles   = styles;
exports.images   = images;
exports.fonts    = fonts;
exports.building    = building;
exports.scripts  = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, pug, watching);