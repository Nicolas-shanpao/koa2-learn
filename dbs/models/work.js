const mongoose = require('mongoose')

let workSchema = new mongoose.Schema({name: String, type: Number})

module.exports = mongoose.model('Work', workSchema)
