const db = require('../models');
const Post = db.post;
const Like = db.like;
const fs = require('fs');
//on recupère grâce au token l'user ID et l'user role pr savoir si l'user a les droits de supprétion/modification
const { getUserIdFromToken, getRoleFromToken } = require('../middleware/auth');

/*Logique metier des routes post*/

//Création d'un post
exports.createPost = (req, res, next) => {
  const postObject = req.body;
  delete postObject.id;
  let imageUrl = '';
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`;
  }
  const post = new Post({
    ...postObject,
    imageUrl,
    userId: getUserIdFromToken(req),
  });
  post
    .save()
    .then(() => res.status(201).json({ message: 'Post enregistré!' }))
    .catch((error) => res.status(400).json({ error }));
};

//Afficher tous les posts
exports.getAllPosts = (req, res, next) => {
  const userId = getUserIdFromToken(req);
  const role = getRoleFromToken(req);
  Post.findAll({
    order: [['createdAt', 'DESC']], //en ordre antéchrologique
    raw: true,
    nest: true,
    include: [{ model: db.user }], //récuperér les données de l'user qui a crée le post pr pouvoir afficher prénom/image
  })
    .then((posts) => {
      //Gestion asynchrone de l'affichage avec map pr récupérer le nombre de like correct avt le render
      const mappedPosts = posts.map(async (post) => {
        const likes = await Like.count({ where: { postId: post.id } }); // nombre de likes total du post
        const userLiked = await Like.count({
          where: { postId: post.id, userId },
        }); //pr savoir si l user a déjà liker ce post
        return {
          ...post,
          modifiable: post.userId === userId || role === 1, //pr afficher option delete/modify post si admin ou owner du post
          likes,
          userLiked: userLiked > 0,
        };
      });
      Promise.all(mappedPosts).then((posts) => res.status(200).json(posts));
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//Liker un post
exports.likePost = (req, res, next) => {
  const user_Id = getUserIdFromToken(req);
  const post_Id = req.params.id;
  Like.findOne({
    where: { userId: user_Id, postId: post_Id }, //vérifier si user a déjà liker
  })
    .then((response) => {
      if (response) {
        //si déjà liké on annule le like
        Like.destroy(
          { where: { userId: user_Id, postId: post_Id } },
          { truncate: true, restartIdentity: true }
        ).then(() => {
          //on renvoie au front le nombre actualisé de likes et q l'user ne like plus
          Like.count({ where: { postId: post_Id } }).then((likes) => {
            res.status(200).json({ likes, userLiked: false });
          });
        });
      } else {
        //si pas liké, on crée le like
        Like.create({ userId: user_Id, postId: post_Id }).then(() => {
          Like.count({ where: { postId: post_Id } }).then((likes) => {
            //on renvoie au front le nombre actualisé de likes et q l'user like
            res.status(200).json({ likes, userLiked: true });
          });
        });
      }
    })
    .catch(() => {
      res.status(500).json({ error: 'Erreur serveur' });
    });
};

//Afficher un seul post
exports.getOnePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//Modifier un post
exports.modifyPost = (req, res, next) => {
  const authUserId = getUserIdFromToken(req);
  const role = getRoleFromToken(req);
  Post.findOne({ where: { id: req.params.id } })
    .then((p) => {
      //vérifier que le user a le droit de modifier le post
      if (p.userId === authUserId || role === 1) {
        let newPost = { ...req.body };
        //gérer la modification du post en fonction de la présence d'une image ou pas
        if (req.file) {
          //l'image est modifiée: on élimine l'ancienne et on enregistre la nouvelle
          const filename = p.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            newPost = {
              ...newPost,
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
              }`,
            };
          });
          const post = {
            ...newPost,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
          };
          p.update(post);
          p.save(post);
        }
        //pas de changement d'images
        const post = { ...newPost };
        p.update(post);
        p.save(post)
          .then(() => res.status(200).json({ message: 'Post modifié!' }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(403).end();
        return;
      }
    })
    .catch((error) => {
      res.status(404).json({ status: 'KO', error: error });
    });
};

//Supprimer un post
exports.deletePost = (req, res, next) => {
  const authUserId = getUserIdFromToken(req);
  const role = getRoleFromToken(req);
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      //vérifier que le user a le droit de modifier le post
      if (post.userId === authUserId || role === 1) {
        //éliminer l'image du dossier
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          //éliminer le post
          Post.destroy({ where: { id: req.params.id } })
            .then(() => res.status(204).end())
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        res.status(403).end();
        return;
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
