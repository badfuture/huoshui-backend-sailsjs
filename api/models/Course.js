/**
 * Courses.js
 *
 * @description :: course model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    school: { // many to one
      model: 'school',
      required: true
    },
    code: { //good <- change to required when ready
      type: 'string',
      defaultsTo: ''
    },
    name: { //good
      type: 'string',
      required: true
    },
    prof: { // many to one
      model: 'prof',
      required: true
    },
    dept: { // many to one
      model: 'dept',
      required: true
    },
    offerings: { // many to many
      collection: 'offering',
      via: 'courses'
    },
    homepage: { //good
      type: 'string',
      defaultsTo: ''
    },
    textbook: { //good
      type: 'string',
      defaultsTo: ''
    },
    credit: {
      type: 'float',
      defaultsTo: 0
    },
    electiveness: { //many to many
      collection: 'electiveness',
      via: 'courses',
    },
    tags: { // many to many through course_tag join table
      collection: 'tag',
      via: 'courses',
      through: 'course_tag'
    },
    stats: { // one to one
      model: 'stat',
      defaultsTo: null
    },
    reviews: { // one to many
      collection: 'review',
      via: 'course'
    },
    metrics: { //many to many
      collection: 'metric',
      via: 'courses'
    },
    followers: { //many to many
      collection: 'user',
      via: 'followedCourses'
    }
  }
};
