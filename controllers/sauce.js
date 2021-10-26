const Sauce = require('../models/Sauce')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    // on supprime l'ID du corps de la requête car Mongo va en créer un nouveau
    delete sauceObject._id
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' ']
    })
    sauce
        .save()
        .then(() => res.status(201).json({ message: 'Votre sauce a bien été ajoutée !' }))
        .catch(error => res.status(400).json({ error }))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Votre sauce a bien été modifiée !' }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Votre sauce a bien été supprimée !' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.likesAndDislikesSauce = (req, res, next) => {
    const like = req.body.like
    const userId = req.body.userId
    const sauceId = req.params.id

    switch (like) {
        case 1:
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
                .then(() => res.status(200).json({ message: 'Vous aimez' }))
                .catch((error) => res.status(400).json({ error }))
            break
        case 0:
            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: 'Sans avis' }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({ message: 'Sans avis' }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                })
                .catch((error) => res.status(404).json({ error }))
            break
        case -1:
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
                .then(() => { res.status(200).json({ message: `Vous n'aimez pas` }) })
                .catch((error) => res.status(400).json({ error }))
            break
        default:
            console.log(error)
    }
}