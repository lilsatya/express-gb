import gulp from 'gulp'
import less from 'gulp-less'
import babel from 'gulp-babel'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'
import nodemon from 'gulp-nodemon'
import cleanCSS from 'gulp-clean-css'
import livereload from 'gulp-livereload'
import del from 'del'
import gutil from 'gutil'

const config = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  },
  runScript: 'bin/server.js',
  extensions: 'js html',
  env: {
    NODE_ENV: 'development'
  }
}

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'assets' ])

/*
 * You can also declare named functions and export them as tasks
 */
export const styles = () => {
  return gulp.src(config.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.styles.dest))
}

export const scripts = () => {
  return gulp.src(config.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(config.scripts.dest))
}

const changedFile = (file, type) => {
  livereload.changed(file.path)
  gutil.log(gutil.colors.yellow(`${type} changed' (${file.path})`))
}

/*
* You could even use `export as` to rename exported tasks
*/
export const watch = (done) => {
  livereload.listen()
  gulp.watch(config.scripts.src, scripts)
    .on('change', (file) => changedFile(file, 'JS'))
  gulp.watch(config.styles.src, styles)
    .on('change', (file) => changedFile(file, 'CSS'))

  done()
}

export const run = (done) => {
  const nodeVersions = process.versions
  let debugArgument

  switch (nodeVersions.node.substr(0, 1)) {
  case '4':
  case '5':
  case '6':
    debugArgument = '--debug'
    break
  case '7':
  case '8':
  case '9':
  case '10':
    debugArgument = '--inspect'
    break
  default:
    debugArgument = '--inspect'
    break
  }
  nodemon({
    script: config.runScript,
    nodeArgs: [debugArgument],
    ext: config.extensions,
    env: config.env,
  })

  done()
}

// const build = gulp.series(clean, gulp.parallel(styles, scripts))

const serve = gulp.parallel(run, watch)
/*
 * Export a default task
 */
export default serve