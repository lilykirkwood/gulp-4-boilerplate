// TODO:
// * browsersync
// * js bundling
// * babel
// * browser list in autoprefixer https://github.com/browserslist/browserslist#readme
// * css & js versioning - https://www.npmjs.com/package/gulp-rev-all
// * image optimisation - imagemin
// * gulp-change watches for images that change?
// * lineec

// modules
const {
    src,
    dest,
    watch,
    series,
    parallel
} = require("gulp"),
    autoprefixer = require("autoprefixer"),
    //   browsersync = require("browser-sync"),
    cssnano = require("cssnano"),
    //   change = require("gulp-change"),
    concat = require("gulp-concat"),
    //   imagemin = require("gulp-imagemin"),
    // lineec = require("gulp-line-ending-corrector"),
    postcss = require("gulp-postcss"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify");

// path vars
const dev = "src",
    dist = "dist",
    paths = {
        src: {
            scss: dev + "/scss/**/*.scss",
            js: dev + "/js/**/*.js"
        },
        dist: {
            css: dist + "/scss/",
            js: dist + "/js/"
        }
    };

// sass task
function styles() {
    return src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(dest(paths.dist.css))
        .pipe(
            postcss([
                autoprefixer({
                    browsers: ["> 1%", "last 2 versions"]
                }),
                cssnano()
            ])
        )
        .pipe(sourcemaps.write("."))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(dest(paths.dist.css));
}

// js task
function javascript() {
    return src(paths.src.js)
        .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(dest(paths.dist.js));
}

// watch task
function watcher() {
    watch([paths.src.scss, paths.src.js], parallel(styles, javascript));
}

// default task
exports.default = series(parallel(styles, javascript), watcher);