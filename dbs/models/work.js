const mongoose = require('mongoose')

let workSchema = new mongoose.Schema({name: String, type: String})

module.exports = mongoose.model('Work', workSchema,'work')
