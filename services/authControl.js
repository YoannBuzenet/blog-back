const belongsToRelevantUser = (userID, userIDOwnerOfContent) => {
  const userIDInt = parseInt(userID, 10);
  const userIDOwnerOfContentInt = parseInt(userIDOwnerOfContent, 10);

  return userIDInt === userIDOwnerOfContentInt;
};

module.exports = {
  belongsToRelevantUser,
};
