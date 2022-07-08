const db = require('../models');
const User = db.user;
const Post = db.post;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const fs = require('fs');
//on recupère grâce au token l'user ID pr savoir si l'user a les droits de supprétion/modification
const { getUserIdFromToken } = require('../middleware/auth');

//Route Post/Création d'un utilisateur
exports.signin = (req, res) => {
  const userObject = req.body.user;
  const user = new User({
    ...userObject,
  });
  user
    .save()
    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
    .catch((error) => res.status(400).json({ error }));
};

//Route Post/Connexion d'un utilisateur
exports.login = (req, res) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user.id,
            role: user.administrator,
            token: jwt.sign(
              { userId: user.id, role: user.administrator },
              process.env.JWT_SECRET,
              {
                expiresIn: '24h',
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Route Delete/Supprétion d'un utilisateur
exports.deleteUser = (req, res) => {
  const authUserId = getUserIdFromToken(req);
  //on récupère les posts appartenant à l'utilisateur pr gérer la suppressions des médias
  Post.findAll({ where: { userId: authUserId } }).then((post) => {
    post.forEach((p) => {
      if (p.imageUrl) {
        const filename = p.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('File deleted successfully');
          }
        });
      }
    });
  });
  //on supprime l'utilisateur et son média s'il y a
  //les posts lui appartennant sont éliminés automatiquement grâce à la relation one to many entre les modeles post et user
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (user.id !== authUserId) {
        res.status(403).end();
        return;
      }
      if (user.imageUrl) {
        const filename = user.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          User.destroy({ where: { id: req.params.id } })
            .then(() => res.status(204).end())
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        User.destroy({ where: { id: req.params.id } })
          .then(() => res.status(204).end())
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

//Route Put/Modification d'un utilisateur
exports.modifyUser = (req, res) => {
  const authUserId = getUserIdFromToken(req);
  User.findOne({ where: { id: req.params.id } })
    .then((u) => {
      if (u.id !== authUserId) {
        res.status(403).json({ message: 'Utilisateur non autorisé!' });
        return;
      }
      let newUser = { ...req.body };
      //gérer la modification du user en fonction de la présence d'une image ou pas
      if (req.file && u.imageUrl !== null) {
        const filename = u.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          newUser = {
            ...newUser,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
          };
        });
        const user = {
          ...newUser,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        };
        u.update(user);
        u.save(user)
          .then(() => res.status(200).json({ message: 'Utilisateur modifié!' }))
          .catch((error) => res.status(400).json({ error }));
      } else if (req.file && u.imageUrl == null) {
        newUser = {
          ...newUser,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        };
        const user = {
          ...newUser,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        };
        u.update(user);
        u.save(user)
          .then(() => res.status(200).json({ message: 'Utilisateur modifié!' }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        const user = { ...newUser };
        u.update(user);
        u.save(user)
          .then(() => res.status(200).json({ message: 'Utilisateur modifié!' }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(404).json({ status: 'KO', error: error });
    });
};

//Route GET/Affichage d'un utilisateur
exports.getOneUser = (req, res) => {
  User.findOne({ where: { id: req.params.id } })
    .then((oneuser) => {
      res.status(200).json(oneuser);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
