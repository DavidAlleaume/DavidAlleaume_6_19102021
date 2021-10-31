// création d'un routeur Express
const express = require('express')
const router = express.Router()

// import de la logique métier
const userCtrl = require('../controllers/user')

// configuration des routes
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)


// export du routeur
module.exports = router