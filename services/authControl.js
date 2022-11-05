/** Vérifie que les ID entre owner du content et modifeur sont les mêmes */
const belongsToRelevantUser = (userID, userIDOwnerOfContent) => {
  const userIDInt = parseInt(userID, 10);
  const userIDOwnerOfContentInt = parseInt(userIDOwnerOfContent, 10);

  return userIDInt === userIDOwnerOfContentInt;
};

/**
 * Filtre pour s'assurer que le call vient du front du blog
 * Ne jamais faire sortir les datas issues des requetes sur le front, sinon on devient scrappables
 * Les réponses ne doivent jamais sortir dans le front du blog-front : on fera les checks dans getServerSideProps
 * @param {*} header
 * @returns boolean
 */
const isComingFromBlog = (header) => {
  return header.authorization === process.env.PASSPHRASE;
};

module.exports = {
  belongsToRelevantUser,
  isComingFromBlog,
};
