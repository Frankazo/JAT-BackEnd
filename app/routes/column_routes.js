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
// GET /column/tableID
router.get('/column/:tid', requireToken, (req, res, next) => {
  Table.findById(req.params.tid)
    .then(handle404)
    .then(parent => {
      return parent.columns.map(column => column.toObject())
    })
    // respond with status 200 and JSON of the column
    .then(column => res.status(200).json({ column: column }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /column/tableID/5a7db6c74d55bc51bdf39793
router.get('/column/:tid/:id', requireToken, (req, res, next) => {
  Table.findById(req.params.tid)
    .then(parent => {
      // return parent.column.find(column => column.id === req.params.id)
      return parent.columns.id(req.params.id)
    })
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "column" JSON
    .then(column => res.status(200).json({ column: column.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /column/tableID
router.post('/column/:tid', requireToken, (req, res, next) => {
  // set owner of new column to be current user
  req.body.column.owner = req.user.id
  // find Table by id in order to add the new column into it
  Table.findById(req.params.tid)
    .then(parent => {
      parent.columns.push(req.body.column)
      return parent.save()
    })
    .then(savedParent => {
      res.status(201).json({ column: req.body.column })
    })
    .catch(next)
})

// UPDATE
// PATCH /column/tableID/5a7db6c74d55bc51bdf39793
router.patch('/column/:tid/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.column.owner

  Table.findById(req.params.tid)
    .then(handle404)
    .then(parent => {
      const column = parent.columns.id(req.params.id)
      requireOwnership(req, column)
      column.set(req.body.column)
      return parent.save()
    })
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /column/tableID/5a7db6c74d55bc51bdf39793
router.delete('/column/:tid/:id', requireToken, (req, res, next) => {
  Table.findById(req.params.tid)
    .then(handle404)
    .then(parent => {
      const column = parent.columns.id(req.params.id)
      requireOwnership(req, column)

      column.remove()
      return parent.save()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
