const express = require('express')
const passport = require('passport')

const Table = require('../models/table')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
router.get('/card/:tid/:cid', requireToken, (req, res, next) => {
  Table.findById(req.params.tid)
    .then(handle404)
    .then(parent => {
      return parent.columns.id(req.params.cid)
    })
    .then(column => {
      return column.cards.map(card => card.toObject())
    })
    // respond with status 200 and JSON of the column
    .then(card => res.status(200).json({ card: card }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
router.get('/card/:tid/:cid/:id', requireToken, (req, res, next) => {
  Table.findById(req.params.tid)
    .then(parent => {
      return parent.columns.id(req.params.cid)
    })
    .then(column => {
      return column.cards.id(req.params.id)
    })
    .then(handle404)
    .then(card => res.status(200).json({ card: card.toObject() }))
    .catch(next)
})

// CREATE
router.post('/card/:tid/:cid', requireToken, (req, res, next) => {
  req.body.card.owner = req.user.id
  Table.findById(req.params.tid)
    .then(parent => {
      let column = parent.columns.id(req.params.cid)
      column.cards.push(req.body.card)
      return parent.save()
    })
    .then(savedParent => {
      res.status(201).json({ card: req.body.card })
    })
    .catch(next)
})

// UPDATE
router.patch('/card/:tid/:cid/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.card.owner

  Table.findById(req.params.tid)
    .then(handle404)
    .then(parent => {
      const column = parent.columns.id(req.params.cid)
      const card = column.cards.id(req.params.id)
      requireOwnership(req, card)
      card.set(req.body.card)
      return parent.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
router.delete('/card/:tid/:cid/:id', requireToken, (req, res, next) => {
  Table.findById(req.params.tid)
    .then(handle404)
    .then(parent => {
      const column = parent.columns.id(req.params.cid)
      const card = column.cards.id(req.params.id)
      requireOwnership(req, card)

      card.remove()
      return parent.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
