# -*- coding: utf-8 -*-


import requests
import json
import os
from pprint import pprint

url_school = 'http://localhost:1337/school'
url_dept = 'http://localhost:1337/dept'
url_course = 'http://localhost:1337/course'
url_position = 'http://localhost:1337/position'
url_prof = 'http://localhost:1337/prof'


json_dir = '../jsons'
school_json = os.path.join(json_dir, 'school.json')
tag_json =os.path.join(json_dir, 'tag.json')
course_json =os.path.join(json_dir, 'course.json')
course_data = json.loads(open(course_json).read())['results']


def getSchoolId(course):
  model = {}
  model['name'] = course['school']
  r = requests.get(url_school, params=model)
  if 'id' in r.json()[0]:
    return r.json()[0]['id']
  else:
    return None

def getDeptId(course):
  model = {}
  model['shortname'] = course['dept']
  r = requests.get(url_dept, params=model)

  if (len(r.json()) > 0) :
    if 'id' in r.json()[0]:
      return r.json()[0]['id']
    else:
      return None
  else:
    print(u' '.join(('BadDept:', course['name'], course['prof'])).encode('utf-8').strip())
    return None

def findOrCreateProfId(course):

  r = requests.get(url_prof + '?name=' + course['prof'])
  if (len(r.json()) != 0):
    #prof exist
    return r.json()[0]['id']
  else:
    #prof not exist, create one
    model = {}
    model['name'] = course['prof']
    model['school'] = getSchoolId(course)
    r = requests.get(url_position + '?name=' + course['position'])
    if (len(r.json()) > 0):
      model['position'] = r.json()[0]['id']
    else:
      model['position'] = None
      print(u' '.join(('BadProfPosition:', course['name'], course['prof'])).encode('utf-8').strip())
    r = requests.post(url_prof, params=model)
    return r.json()['id']


def initModelCourse(course):
  model = {}
  model['name'] = course['name']
  model['school'] = getSchoolId(course)
  model['dept'] = getDeptId(course)
  model['prof'] = findOrCreateProfId(course)
  return model

for course in course_data:
  model = initModelCourse(course)
  r = requests.post(url_course, params=model)
  print(u' '.join((course['name'], course['prof'])).encode('utf-8').strip())


"""
;                                 l ll;l
  try get prof
    if not exist
      post prof and get prof id
  post the course

"""
