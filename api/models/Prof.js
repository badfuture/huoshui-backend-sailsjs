/**
 * Profs.js (done)
 *
 * @description :: prof model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    school: { // many to one
      model: 'school',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    gender: {
      type: 'string',
      enum: ['male','female'],
      defaultsTo: null
    },
    birth: {
      type: 'integer',
      min: 1900,
      max: 2050,
      defaultsTo: null
    },
    exp: {
      type: 'integer',
      min: 0,
      max: 100,
      defaultsTo: null
    },
    hometown: {
      type: 'string',
      defaultsTo: null
    },
    dept: {
      model: 'dept',
      defaultsTo: null
    },
    email: {
      type: 'string',
      defaultsTo: null
    },
    phone: {
      type: 'string',
      defaultsTo: null
    },
    homepage: {
      type: 'string',
      defaultsTo: null
    },
    motto: {
      type: 'string',
      defaultsTo: null
    },
    position: { // many to one
      model: 'position',
      defaultsTo: null
    },
    group: {
      type: 'string',
      defaultsTo: null
    },
    research: {
      type: 'string',
      defaultsTo: null
    },
    achievement: {
      type: 'string',
      defaultsTo: null
    },
    courses: { // one to many
      collection: 'course',
      via: 'prof'
    }
  }
};
