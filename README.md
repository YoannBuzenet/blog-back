TODO

- Créer une fonction `isSlateContent` pour vérifier les strings reçus pour les Posts et les Answers

- Factoriser le chargement des env var dans une fonction
  (utilisé à 3 endroits : <br> - config.js pour quand on ping un endpoint (on devrait pas en avoir besoin vu que c'est loadé via index.js ? mais ça ne marche pas sans), <br> - index.js au lancement du serveur, <br> - .sequelizerc pour charger pendant l'accès CLI)<br>

### Images / Tags

- Créer les endpoints pour Image et Tag (existingScript.setFormats(req.body.formats);)
- Modifier les endpoints pour modifier les associations sur Image/Tag/Post

### Windows

- Pour que les commandes de package.json marchent sur windows, il faut
  - Installer pwsh
  - Indiquer le path de pwsh à VSCode pour que le terminal dedans s'execute avec
  - Indiquer à npm le path de pwsh pour qu'il execute également le bon
