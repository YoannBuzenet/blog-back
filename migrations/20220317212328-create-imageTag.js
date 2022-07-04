module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ImageTags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Images",
          key: "id",
        },
      },
      tag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Tags",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ImageTags");
  },
};
