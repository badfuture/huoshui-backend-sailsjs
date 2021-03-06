/**
 * FeedbackController
 *
 * @description :: Server-side logic for managing Feedback
 */

module.exports = {

  find: (req,res) => {
    Feedback.findAll({
      where: ActionUtil.parseWhere(req),
      limit: ActionUtil.parseLimit(req),
      offset: ActionUtil.parseSkip(req),
      order: ActionUtil.parseSort(req),
      include: ActionUtil.parsePopulate(req),
    }).then((recordsFound) => {
      return res.ok(recordsFound)
    }).catch((err) => {
      return res.serverError(err)
    });
  },

  findOne: function(req,res){
    let pk = ActionUtil.requirePk(req);
    console.log(ActionUtil.parsePopulate(req))
    Feedback.findById(pk, {
      include: ActionUtil.parsePopulate(req),
    }).then((recordFound) => {
      if(!recordFound) return res.notFound('No record found with the specified `id`.')
      res.ok(recordFound)
    }).catch((err) => {
      return res.serverError(err)
    });
  },

  create: (req, res) => {
    const {name, contact, content, userId} = ActionUtil.parseValues(req)
    let newFeedback = null

    if (!content) {
      return res.badRequest(ErrorCode.FeedbackContentMissing)
    }

    Feedback.create({
      name,
			contact,
      content,
    }).then((feedbackCreated) => {
      newFeedback = feedbackCreated
      if (userId) {
        return User
          .findOne({where: {id: userId}})
          .then((userFound) => {
            userFound.addFeedback(newFeedback)
          })
      }
    }).then(() => {
      res.created()
    }).catch((err) => {
      return res.serverError(err)
    })
  },
};
