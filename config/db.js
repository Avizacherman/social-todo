if(process.env.NODE_ENV !='production')
  require('dotenv').load()

module.exports = require('seraph')({
  server: 'http://localhost:7474/',
  user: process.env.DB_USER,
  pass: process.env.DB_PW
})
