// Plugins
var gulp = require("gulp"),
    order = require("gulp-order"),
    print = require("gulp-print"),
    preprocess = require("gulp-preprocess"),
    rename = require("gulp-rename"),
    del = require("del"),
    autoprefixer = require("gulp-autoprefixer"),
    htmlmin = require("gulp-htmlmin"),
    babel = require("gulp-babel"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    imagemin = require("gulp-imagemin"),
    cache = require("gulp-cache"),
    minifycss = require("gulp-clean-css"),
    sass = require("gulp-sass");

// Vars Locais
var sourcePath  = "source/",
    buildPath   = "build/",
    development = false,
    version  = String(new Date().getDate()) + String(new Date().getHours()) + String(new Date().getSeconds()),
    watching = false;

// Watch - Atualiza a Build a cada vez que houverem modificações;
gulp.task("watch", function() {
    watching = true;
    gulp.watch([sourcePath+"**/sass/**/*.scss"], ["sass"]);
    gulp.watch([sourcePath+"**/*.css", "!"+sourcePath+"**/vendor/**/*.css"], ["create-dynamic-css"]);
    gulp.watch([sourcePath+"**/vendor/**/*.css"], ["create-static-css"]);
    gulp.watch([sourcePath+"**/*.js", "!"+sourcePath+"**/vendor/**/*.js", "!"+sourcePath+"**/essentials/**/*.js"], ["create-dynamic-js"]);
    gulp.watch([sourcePath+"**/essentials/**/*.js"],["create-core-js"]);
    gulp.watch([sourcePath+"**/vendor/**/*.js"], ["create-static-js"]);
    gulp.watch(sourcePath+"assets/img/**/*", ["compress-images"]);
    gulp.watch(sourcePath+"**/*.html", ["move-all-components"]);
    gulp.watch([sourcePath+"**/*.*", "!"+sourcePath+"**/*.js", "!"+sourcePath+"**/*.css", "!"+sourcePath+"**/*.html"], ["move-all-other-files"]);
});

gulp.task("sass", function () {
  return gulp.src([sourcePath+"**/sass/**/*.scss"])
    .pipe(print())
    .pipe(sass().on("error", sass.logError))
    .pipe(rename({dirname:"", suffix:".sass"}))
    .pipe(gulp.dest(sourcePath+"assets/css/", {overwrite: true}))
});
 
// Cria o bundle de CSS dinâmico - contendo todo o CSS específico
gulp.task("create-dynamic-css", ["clear", "sass"], function() {
  return gulp.src([sourcePath+"**/*.css", "!"+sourcePath+"**/vendor/**/*.css"])
    .pipe(order([
    "**/*.css"
     ], {base: sourcePath}))
    .pipe(print())
    .pipe(sourcemaps.init())
    .pipe(concat("dynamic.css"))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(rename({suffix:".min"}))
    .pipe(minifycss())
    .pipe(sourcemaps.write("/maps"))
    .pipe(gulp.dest(buildPath+"assets/css/"))
});

// Cria o CSS estático - Vendors
gulp.task("create-static-css", ["clear"], function() {
  return gulp.src([sourcePath+"**/vendor/**/*.css"])
    .pipe(sourcemaps.init())
    .pipe(concat("static.css"))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(rename({suffix:".min"}))
    .pipe(minifycss())
    .pipe(sourcemaps.write("/maps"))
    .pipe(gulp.dest(buildPath+"assets/css/"))
});

// Cria o bundle de JS essencial durante o carregamento
gulp.task("create-core-js", ["clear"], function() {
  return gulp.src([sourcePath+"**/essentials/**/*.js"])
    .pipe(order([
        "assets/js/essentials/core-essentials.js",
        "**/*.js"
    ], {base: sourcePath}))
    .pipe(print())
    .pipe(sourcemaps.init())
    .pipe(concat("core-essentials.js"))
    .pipe(babel({compact:true}))
    .pipe(rename({suffix:".min"}))
    .pipe(uglify())
    .pipe(sourcemaps.write("/maps"))
    .pipe(gulp.dest(buildPath+"assets/js/"))
});

// Cria o bundle de JS dinâmico específico
gulp.task("create-dynamic-js", ["clear", "create-core-js"], function() {
  return gulp.src([sourcePath+"**/*.js", "!"+sourcePath+"**/essentials/**/*.js" , "!"+sourcePath+"**/vendor/**/*.js"])
    .pipe(order([
        "assets/js/app.js",
        "**/*.js"
    ]))
    .pipe(print())
    .pipe(preprocess({context: {development: development, version: version}}))
    .pipe(sourcemaps.init())
    .pipe(concat("dynamic.js"))
    .pipe(babel({compact:true}))
    .pipe(rename({suffix:".min"}))
    .pipe(uglify())
    .pipe(sourcemaps.write("/maps"))
    .pipe(gulp.dest(buildPath+"assets/js/"))
});

// Cria o bundle de JS estático, dos vendors para a Base
gulp.task("create-static-js", ["clear"], function() {
  return gulp.src([sourcePath+"**/vendor/**/*.js"])
    .pipe(order([
        "assets/js/vendor/foundation/jquery.js",
        "assets/js/vendor/foundation/what-input.js",
        "assets/js/vendor/foundation/foundation.js",
        "assets/js/vendor/ractive/ractive.js",
        "**/*.js"
    ]))
    .pipe(print())
    .pipe(sourcemaps.init())
    .pipe(concat("static.js"))
    .pipe(babel({compact:true}))
    .pipe(rename({suffix:".min"}))
    .pipe(uglify())
    .pipe(sourcemaps.write("/maps"))
    .pipe(gulp.dest(buildPath+"assets/js/"))
});

// Comprime todas as imagens estáticas
gulp.task("compress-images", ["clear"], function() {
  return gulp.src(sourcePath+"assets/img/**/*")
    .pipe(print())
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(buildPath+"assets/img/"));
});

// Move todos os componentes HTML para a Build
gulp.task("move-all-components", ["clear"], function() {
  return gulp.src([sourcePath+"**/*.html"])
    .pipe(preprocess({context: {development: development, version: version}}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(buildPath))
});

// Move demais arquivos das demais extensões não tratadas (fonts, audios, sourcemaps, etc)
gulp.task("move-all-other-files", ["clear"], function() {
  return gulp.src([sourcePath+"**/*.*", "!"+sourcePath+"**/*.js", "!"+sourcePath+"**/*.css", "!"+sourcePath+"**/*.scss", "!"+sourcePath+"**/*.html", "!"+sourcePath+"**/img/**/*.*"])
    .pipe(gulp.dest(buildPath))
});

// Limpa a pasta Build exceto em modo Watch
gulp.task("clear", function(cb) {
    if (!watching) {
        del(buildPath);
        setTimeout(function() {
            cb();
        }, 500);
    } else {
        cb();
    }
});

// Gera a build
gulp.task("build", [
    "create-static-css",
    "create-dynamic-css",
    "create-static-js",
    "create-core-js",
    "create-dynamic-js",
    "compress-images",
    "move-all-components",
    "move-all-other-files"
]);

// Tarefa Padrão
gulp.task("default", ["build"]);