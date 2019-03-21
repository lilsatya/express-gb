'use strict'

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  sentryDns: process.env.SENTRY_DNS || null,
}