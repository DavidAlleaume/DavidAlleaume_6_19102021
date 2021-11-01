// création d'un routeur Express
const express = require('express')
const router = express.Router()

// import du middleware d'authentification
const auth = require('../middleware/auth')
// import du middlware multer
const multer = require('../middleware/multer-config')
// import de la logique métier
const sauceCtrl = require('../controllers/sauce')

// configuration des routes avec ajout des middlwares d'authentification et multer lorsque c'est requis
router.post('/', auth, multer, sauceCtrl.createSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.get('/', auth, sauceCtrl.getAllSauces)
router.post("/:id/like", auth, sauceCtrl.likesAndDislikesSauce)

// export du routeur
module.exports = router