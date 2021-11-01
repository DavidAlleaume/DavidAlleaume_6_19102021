// fichier contenant la configuration de multer. Multer permet de gérer les fichiers entrants
// dans les requêtes http (ici les images des sauces)

// import de multer après installation avec npm install --save multer
const multer = require('multer')


// dictionnaire des différents extensions
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}


// objet de configuration qui indiqura à multer une destination et un nom pour chacun de nos fichiers
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // on supprime les éventuels espaces du nom original du fichier
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})


// export de multer en lui passant la config storage et en idiquant que nous gérerons uniquement les fichiers image
module.exports = multer({ storage }).single('image')