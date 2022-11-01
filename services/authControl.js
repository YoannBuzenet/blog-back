const belongsToRelevantUser = (userID, userIDOwnerOfContent) => {
  const userIDInt = parseInt(userID, 10);
  const userIDOwnerOfContentInt = parseInt(userIDOwnerOfContent, 10);

  return userIDInt === userIDOwnerOfContentInt;
};

const isComingFromBlog = (header) => {
  return header.Authorization === process.env.PASSPHRASE;
};

module.exports = {
  belongsToRelevantUser,
  isComingFromBlog,
};
