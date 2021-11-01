// import du package de cryptage bcrypt (après installation avec npm install --save bcrypt)
const bcrypt = require('bcrypt')

// import de jsonwebtoken (après installation avec npm install --save jsonwebtoken) pour permettre la
// création et la vérification de tokens d'authentification
const jwt = require('jsonwebtoken')

// import du modèle user
const User = require('../models/user')

// fonction signup permettant l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    // hashage du mot de passe en 10 tours
    bcrypt.hash(req.body.password, 10)
        // récupération du hash et création d'un utilisateur qui sera enregistré dans notre base de donnée 
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé!' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

// fonction login pour permettant la connexion d'utilisateurs existants
exports.login = (req, res, next) => {
    // on cherche l'utilisateur à partir de son adresse mail
    User.findOne({ email: req.body.email })
        .then(user => {
            // si il n'est pas trouvé
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }
            // si il est trouvé on utilise la fonction compare de bcrypt pour comparer l'adresse mail contenue 
            // dans la requête avec le hash enregitré dans la base de donnée
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // si false
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    // si true on renvoie un objet json contenant un user ID + un token d'authentification
                    res.status(200).json({
                        userId: user._id,
                        // token créé avec la fonction sign de jwt et contenant un user ID, une clé secrète 
                        // pour l'encodage et un délai d'expiration
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}