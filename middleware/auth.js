// fichier contenant le middlware d'authentification que l'on appliquera à toutes les routes 
// que l'on souhaite protéger


// import de jsonwebtoken
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        // récupération du token dans le header de la requête
        const token = req.headers.authorization.split(' ')[1]
        // vérification du token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
        // récupération du user ID contenu dans le token
        const userId = decodedToken.userId
        // si le user ID contenu dans le corps de la requête est différent de celui contenu dans le token
        if (req.body.userId && req.body.userId !== userId) {
            //throw 'Invalid user ID'
            res.status(403).json({
                error: new Error('Unauthorized request!')
            })
        } else {
            // si tout va bien on passe la requête au prochain middleware
            next()
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        })
    }
}