const express = require('express')
const articles = require('../../db/articles')

const router = express.Router()
/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'KOPLOK' })
})

router.get('/api/articles', (req, res) => {
  res.send(articles)
})

module.exports = router
