const { logger } = require("../../../logger");
const db = require("../../../models/index");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", (request, reply, done) => {

    console.log('TEST', request);
    console.log('TEST', request.body);
    const { UserId, token, provider } = request.body;

    if (!token || !provider || !UserId) {
      reply.code(400).send("Bad Request.");
      return;
    }

    const isUserLogged = db.User.isAuthenticated(UserId, token, provider);

    if (!isUserLogged) {
      reply.code(401).send("Unauthorized");
      return;
    }
    done();
  });

  fastify.put(
    "/:id",
    {
      schema: {
        body: {
          required: ["UserId", "token", "provider"],
          type: "object",
          properties: {
            UserId: { type: "number" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const post = await db.Post.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        // change object, save it
        for (const prop in req.body) {
          post[prop] = req.body[prop];
        }


        // ManyToMany
        if(req.body.Sibling){
          let siblingToAdd = JSON.parse(req.body.Sibling);
          if(!Array.isArray(siblingToAdd)){
            siblingToAdd = [siblingToAdd]
          }
          siblingToAdd = siblingToAdd.map(sibling => sibling.id);
          await post.setSibling(siblingToAdd);
        }

        const savedPost = await post.save();

        // Pour avoir les siblings dans le retour, on fait la requete complete
        const updatedPost = await db.Post.findOne({
          where: {
            id: req.params.id,
          },
          include: [{
            model: db.Post,
            as: "Sibling",
          }, {
            model : db.Tag,
          }],
        });

        reply.code(200).send(updatedPost);
        return;
      } catch (e) {
        logger.log("error", "Error while editing for Post : " + e);
        reply.code(500).send("Error when editing a post");
      }
    }
  );
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: [
            "title",
            "shortDescription",
            "content",
            "metaDescription",
            "UserId",
            "token",
            "provider",
            "url"
          ],
          properties: {
            title: { type: "string" },
            url: { type: "string" },
            shortDescription: { type: "string" },
            content: { type: "string" },
            UserId: { type: "integer" },
            metaDescription: { type: "string" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const newPost = {
          title: req.body.title,
          url: req.body.url,
          shortDescription: req.body.shortDescription,
          mainImageUrl: req.body.mainImageUrl,
          metaDescription: req.body.metaDescription,
          isScoop: req.body.isScoop,
          isPublished: req.body.isPublished,
          content: req.body.content,
          UserId: req.body.UserId,
        };

        const savedPost = await db.Post.create(newPost);

        if(req.body.Sibling){
          let siblingToAdd;
          try{
            siblingToAdd = JSON.parse(req.body.Sibling);
          }
          catch(e){
            console.error('Couldnt parse siblings when posting a post')
          }
          if(!Array.isArray(siblingToAdd)){
            siblingToAdd = [siblingToAdd]
          }
          siblingToAdd = siblingToAdd.map(sibling => sibling.id)
          await savedPost.setSibling(siblingToAdd);
        }

        // Pour avoir les siblings dans le retour, on fait la requete complete
        const updatedPost = await db.Post.findOne({
          where: {
            id: savedPost.dataValues.id,
          },
          include: {
            model: db.Post,
            as: "Sibling",
          },
        });


        reply.code(200).send(updatedPost);
        return;
      } catch (e) {
        logger.log("error", "Error while creating a Post :" + e);
        reply.code(500).send("Error when creating a post" + e);
        //TODO ajouter un parseur d'erreurs pour redonner les bonnes au front
      }
      return;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        body: {
          type: "object",
          required: ["UserId", "token", "provider"],
          properties: {
            UserId: { type: "number" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const post = await db.Post.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        //Delete
        const deletedPost = await post.destroy();
        reply.code(200).send(deletedPost.dataValues);

        return;
      } catch (e) {
        logger.log("error", "Error while deleting post :" + e);
        reply.code(500).send("Error when editing a post");
      }
    }
  );

  done();
};
