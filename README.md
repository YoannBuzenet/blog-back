TODO

- Factoriser le chargement des env var dans une fonction
  (utilisé à 3 endroits : <br> - config.js pour quand on ping un endpoint (on devrait pas en avoir besoin vu que c'est loadé via index.js ? mais ça ne marche pas sans), <br> - index.js au lancement du serveur, <br> - .sequelizerc pour charger pendant l'accès CLI)<br>
