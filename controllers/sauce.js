// fichier contenant la logique métier

// import du shéma "sauce"
const Sauce = require('../models/Sauce')

// import de File System pour avoir accès aux différentes opérations liées au système de fichiers (pour la suppression des images)
const fs = require('fs')

// fonction permettant la création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    // on récupère la chaîne de caractère contenu dans le corps de la requête puis on la parse pour en objet
    const sauceObject = JSON.parse(req.body.sauce)
    // on supprime l'ID existant car Mongo va en créer un nouveau
    delete sauceObject._id
    // on crée une nouvelle instance de l'objet sauce
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

// fonction permettant la modification d'une sauce
exports.modifySauce = (req, res, next) => {
    // on teste l'objet pour savoir si il contient une nouvelle image
    const sauceObject = req.file ?
        // si req.file existe donc si il y a une nouvelle image, 
        {
            // on récupère toute les infos de la sauce, on la parse en objet
            ...JSON.parse(req.body.sauce),
            // on indique l'url de la nouvelle image
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            // si req.file n'existe pas donc si il n'y a pas de nouvelle image on fait simplement une copie de req.body
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Votre sauce a bien été modifiée !' }))
        .catch(error => res.status(400).json({ error }))
}


// fonction permettant la suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // on extrait le nom du fichier de l'url complète
            const filename = sauce.imageUrl.split('/images/')[1]
            // on utilise la fonction unlink du package fs pour supprimer l'image en utilisant son nom
            fs.unlink(`images/${filename}`, () => {
                // une fois l'image supprimée on supprime l'objet sauce de notre base de donnée
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Votre sauce a bien été supprimée !' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}


// fonction permettant la récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }))
}


// fonction permettant la récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}


// fonction permettant la gestion des likes
exports.likesAndDislikesSauce = (req, res, next) => {
    const like = req.body.like
    const userId = req.body.userId
    const sauceId = req.params.id

    switch (like) {
        // premier cas : Ajout d'un like
        case 1:
            // on identifie la sauce avec son ID, on ajoute l'utilisateur qui a liké au tableau correspondant 
            // et on incrémente le nombre de likes
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
                .then(() => res.status(200).json({ message: 'Vous aimez' }))
                .catch((error) => res.status(400).json({ error }))
            break
        // deuxième cas : retrait d'un like ou d'un dislike
        case 0:
            // on identifie la sauce son ID
            Sauce.findOne({ _id: sauceId })
                .then((sauce) => {
                    // si l'utilisateur est bien celui qui a liké la sauce
                    if (sauce.usersLiked.includes(userId)) {
                        // on retire l'utilisateur qui a liké du tableau correspondant et on décrémente le nombre de likes
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: 'Sans avis' }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                    // si l'utilisateur est bien celui qui a disliké la sauce
                    if (sauce.usersDisliked.includes(userId)) {
                        // on retire l'utilisateur qui a disliké du tableau correspondant et on décrémente le nombre de dislikes
                        Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({ message: 'Sans avis' }))
                            .catch((error) => res.status(400).json({ error }))
                    }
                })
                .catch((error) => res.status(404).json({ error }))
            break
        // ajout d'un dislike
        case -1:
            // on identifie la sauce avec son ID, on ajoute l'utilisateur qui a disliké au tableau correspondant 
            // et on incrémente le nombre de dislikes
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
                .then(() => { res.status(200).json({ message: `Vous n'aimez pas` }) })
                .catch((error) => res.status(400).json({ error }))
            break
        default:
            console.log(error)
    }
}