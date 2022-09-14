TODO

- créer le modèle pour les commentaires
- l'endpoint de creation d'image doit connaitre le path de sauvegarde qu'a utilisé sharp dans le controller images

- Factoriser le chargement des env var dans une fonction
  (utilisé à 3 endroits : <br> - config.js pour quand on ping un endpoint (on devrait pas en avoir besoin vu que c'est loadé via index.js ? mais ça ne marche pas sans), <br> - index.js au lancement du serveur, <br> - .sequelizerc pour charger pendant l'accès CLI)<br>

### Images / Tags

- Créer les endpoints pour Image et Tag (existingScript.setFormats(req.body.formats);)
- Modifier les endpoints pour modifier les associations sur Image/Tag/Post
