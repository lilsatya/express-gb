const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sentry = require('@sentry/node')
const config = require('./config/env/default.js')

const indexRouter = require('./src/routes/index')

const app = express()

/**
 * Sentry init
 */

if (config.sentryDns) {
  sentry.init({ dsn: config.sentryDns })
  app.use(sentry.Handlers.requestHandler())
  app.use(sentry.Handlers.errorHandler())
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.end(res.sentry + '\n')
  res.render('error')
})

module.exports = app
