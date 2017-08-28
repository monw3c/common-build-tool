'use strict';

import gulp from "gulp";
import clean from 'gulp-clean';
import uglify from 'gulp-uglify';
import requirejsOptimize from 'gulp-requirejs-optimize';
import concat from 'gulp-concat';
import minifyCss from 'gulp-minify-css';
import imagemin from 'gulp-imagemin';
import urlAdjuster from 'gulp-css-url-adjuster';
import jshint from 'gulp-jshint';
import usemin from 'gulp-usemin';
import rev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';
import runSequence from 'run-sequence';
import sass from 'gulp-ruby-sass';
import watch from 'gulp-watch';
import md5 from 'gulp-md5-plus';
import browserSync from 'browser-sync';


//目录
const dirs = {
  src: './src',
  dest: './build',
  tmp : './tmp'
};

//路径
const paths = {
  css : [`${dirs.src}/css/*.css`],
  sass : `${dirs.src}/scss/**/*.scss`,
  scripts: [`${dirs.src}/js/**/*.js`, `${dirs.src}/js/**/*.coffee`],
  images: `${dirs.src}/imgs/**/*`,
  fonts: `${dirs.src}/fonts/*`,
  html: `${dirs.src}/*.html`
};


gulp.task("clean", () => {
    return gulp.src([`${dirs.tmp}/js/*.js`,`${dirs.dest}/js/*.js`,`${dirs.tmp}/css/*.css`,`${dirs.dest}/css/*.css`])
        .pipe(clean());
})

// Lint Task
gulp.task('jshint', () => {
    return gulp.src(`${paths.scripts}`)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task("rjs", () => {
        return gulp.src('./src/js/index.js')
        .pipe(requirejsOptimize(() => {
                //requirejsOptimize会根据你的配置文件去找到所有依赖的js文件
                return {
                    mainConfigFile:
                    './src/js/index.js'
                };
        }))
        .pipe(concat("./js/build.js")) //将其合并为build.js
        .pipe(uglify())  //使用uglifyjs去压缩你的js
        //.pipe(rev())
        .pipe(gulp.dest(`${dirs.tmp}`))
        /*.pipe(rev.manifest({
            merge: true //如果存在 rev-manifest.json文件则合并
        }))
        .pipe(gulp.dest('./build/rev/js'));*/
});


gulp.task('minify-css', () => {
  return gulp.src([`${paths.css}`])
    .pipe(urlAdjuster({
            replace:  ['emo/','../imgs/'],
    }))
    .pipe(concat("./css/build.css"))
    .pipe(minifyCss())
    //.pipe(rev())
    .pipe(gulp.dest(`${dirs.tmp}`))
    /*.pipe(rev.manifest({
            merge: true //如果存在 rev-manifest.json文件则合并
        }))
    .pipe(gulp.dest('./build/rev/css'));*/
});

/*gulp.task('rename', function() {
  return gulp.src("build/css/build.css")
    .pipe(rename("../Face"))
    .pipe(gulp.dest("build/imgs"));
});
*/

gulp.task('sass', () => {
  /*return gulp.src('./src/scss/*.scss')
        .pipe(sass({sourcemap: true, sourcemapPath: './src/scss'}))
        .pipe(gulp.dest('./src/css'));*/
  return sass(`${dirs.src}/scss/*.scss`, {
            style: 'compact'
        })
        .pipe(gulp.dest(`${dirs.src}/css`));
});


gulp.task('images', () => {
  return gulp.src(`${paths.images}`)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(`${dirs.dest}/imgs`))
});


gulp.task('fonts', () => {
  return gulp.src(`${paths.fonts}`)
      .pipe(gulp.dest(`${dirs.dest}/fonts`))
});


gulp.task('html', () => {
  return gulp.src(`${dirs.src}/*.html`)
      .pipe(usemin())
      .pipe(gulp.dest(`${dirs.dest}`));
});


gulp.task('md5:js', function (done) {
    gulp.src(`${dirs.tmp}/js/*.js`)
        .pipe(md5(10, `${dirs.dest}/*.html`))
        .pipe(gulp.dest(`${dirs.dest}/js`))
        .on('end', done);
});

gulp.task('md5:css', function (done) {
    gulp.src(`${dirs.tmp}/css/*.css`)
        .pipe(md5(10, `${dirs.dest}/*.html`))
        .pipe(gulp.dest(`${dirs.dest}/css`))
        .on('end', done);
});

gulp.task('browser-sync', function() {
    browserSync({
        files: "**",
        server: {
            baseDir: `${dirs.src}`
        }
    });
});

// 监视文件的变化
gulp.task('watch', () => {
    gulp.watch(`${paths.sass}`, ['sass']);
    gulp.watch(`${paths.css}`, ['minify-css']);
    gulp.watch(`${paths.scripts}`, ['rjs']);
    gulp.watch(`${paths.images}`, ['images']);
    gulp.watch(`${paths.fonts}`, ['fonts']);
    gulp.watch(`${paths.html}`, ['html']);
});

gulp.task('build', (done) => {
  runSequence(
     ['clean'],
     ['sass'],
     ['html'],
     ['rjs','minify-css','images','fonts','watch'],
     ['md5:js','md5:css','browser-sync'],
  done);
});
gulp.task('default', ['build']);