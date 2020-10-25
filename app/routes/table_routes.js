const express = require('express')
const passport = require('passport')

const Table = require('../models/table')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const removeBlanks = require('../../lib/remove_blank_fields')
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
router.get('/table', requireToken, (req, res, next) => {
  Table.find()
    .then(table => {
      return table.map(res => res.toObject())
    })
    .then(table => res.status(200).json({ table: table }))
    .catch(next)
})

// CREATE
router.post('/table', requireToken, (req, res, next) => {
  req.body.table.owner = req.user.id
  Table.create(req.body.table)
    .then(table => {
      res.status(201).json({ table: table.toObject() })
    })
    .catch(next)
})

// SHOW
router.get('/table/:id', requireToken, (req, res, next) => {
  Table.findById(req.params.id)
    .then(handle404)
    .then(table => res.status(200).json({ table: table.toObject() }))
    .catch(next)
})

// UPDATE
router.patch('/table/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  // delete req.body.example.owner

  Table.findById(req.params.id)
    .then(handle404)
    .then(res => {
      requireOwnership(req, res)
      return res.updateOne(req.body.table)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
router.delete('/table/:id', requireToken, (req, res, next) => {
  Table.findById(req.params.id)
    .then(handle404)
    .then(res => {
      requireOwnership(req, res)
      return res.updateOne({isDeleted: true})
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
