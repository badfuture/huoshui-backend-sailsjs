
const {
  getIncludeModel, initInclude, getAllIncludes,
  applyCommonFilter,
} = require('./Utils')

module.exports = (includeList = []) => {
  let result = []
  const model = Course

  if (typeof includeList == 'string' && includeList == 'all') {
    includeList = getAllIncludes(model)
  }

  includeList.forEach((include) => {
    if (!getIncludeModel(model, include)) { return }
    let obj = initInclude(model, include)
    if (include == "Stat") {
      obj.duplicating = false
    } else if (include == "Prof") {
      obj.include = [{
        model: Position,
        as: 'Position',
        duplicating: false
      },
      {
        model: Dept,
        as: 'Depts',
        duplicating: false
      }]
    } else if (include == "Reviews") {
      delete obj.duplicating
      obj.include = [
        {
          model: User,
          as: 'Author',
          attributes: {
            exclude: ['password', 'salt']
          },
          include: {
            model: Dept,
            as: 'Dept',
          }
        },
        {
          model: Course,
          as: 'Course'
        },
        {
          model: Prof,
          as: 'Prof'
        },
        {
          model: Tag,
          as: 'Tags'
        }
      ]
    } else {
      obj = applyCommonFilter(model, include, obj)
    }

    result.push(obj)
  })
  return result
}
