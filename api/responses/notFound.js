
module.exports = function notFound ({code, type, message}) {
  this.res.status(404)
  const errorJson = _.merge(ErrorCode.NotAuthorized, {
    code,
    type,
    message
  })

  const error = Errors.create(errorJson)
  this.res.jsonx(error.toJson())
}
