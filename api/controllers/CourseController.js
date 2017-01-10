/**
 * CoursesController
 *
 * @description :: Server-side logic for managing Course
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  find: function(req,res){
    var customInclude = ActionUtil.populateEach(req);
    var defaultInclude = [
      { model: School, as: 'School'},
      { model: Prof, as: 'Prof'},
      { model: Elective, as: 'Elective'},
      { model: Dept, as: 'Depts'},
    ];
    var includeOption = (customInclude.length === 0)
                  ? defaultInclude : customInclude;

    Course.findAll({
      where: ActionUtil.parseWhere(req),
      limit: ActionUtil.parseLimit(req),
      offset: ActionUtil.parseSkip(req),
      order: ActionUtil.parseSort(req),
      include: includeOption
    }).then(function(recordsFound){
      return res.ok(recordsFound);
    }).catch(function(err){
      return res.serverError(err);
    });
  },

  findOne: function(req,res){
    var pk = ActionUtil.requirePk(req);
    var customInclude = ActionUtil.populateEach(req);
    var defaultInclude = [
      { model: School, as: 'School'},
      { model: Prof, as: 'Prof'},
      { model: Elective, as: 'Elective'},
      { model: Tag, as: 'Tags'},
      { model: Dept, as: 'Depts'},
    ];
    var includeOption = (customInclude.length === 0)
                  ? defaultInclude : customInclude;

    Course.findById(pk, {
      include: includeOption
    }).then(function(recordFound) {
      if(!recordFound) return res.notFound('No record found with the specified `id`.');
      res.ok(recordFound);
    }).catch(function(err){
      return res.serverError(err);
    });
  },


};
