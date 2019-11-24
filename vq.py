from flask import *
from flask_cors import CORS
from bson.objectid import ObjectId
import pymongo
import random
import string
from datetime import datetime
import os
import subprocess
import http.client
import urllib.parse
import json
from azure.cosmos import exceptions, CosmosClient, PartitionKey
from urllib.parse import quote
import time

app = Flask(__name__)
CORS(app, supports_credentials=True)
db = pymongo.MongoClient(host='127.0.0.1', port=27017)['vq']

endpoint = "https://vq-search-database.documents.azure.com:443/"
key = 'OFkHXptjGLrlDRXZcWj84JK9KBVT0srlc7w9suWVnNJwoolWiwXbRkhhcM0uTgMrAbR8JNY2K4j9awbr2bkYYA=='

client = CosmosClient(endpoint, key)

database_name = 'vq-s'
database = client.create_database_if_not_exists(id=database_name)

container_name = 'vq-q'
container = database.create_container_if_not_exists(
    id=container_name,
    partition_key=PartitionKey(path="/qid"),
    offer_throughput=400,
    unique_key_policy={
        'uniqueKeys': [
            {'paths': ['/qid']},
        ]
    }
)


def update_qid_search(qid):
    res = ''
    question = db['question'].find_one({'_id': ObjectId(qid)})

    if question['status'] == 0:
        return

    res += question['title']
    res += question['desp']

    for aid in question['answer']:
        answer = db['answer'].find_one({'_id': ObjectId(aid)})

        if answer['status'] == 0:
            continue

        res += answer['diff']
        res += answer['desp']

    try:
        query = "SELECT * FROM test t where t.qid='" + qid + "'"
        old_question = container.query_items(query=query, enable_cross_partition_query=True)
        for i in old_question:
            container.delete_item(i, partition_key=i['qid'])
    except exceptions.CosmosResourceNotFoundError as identifier:
        pass
    
    container.upsert_item({'qid': qid, 'data': res})


def new_docker_id(fatherDockerId=None):
    dockerId = ''.join(random.sample(string.ascii_letters + string.digits, 12))

    os.system('mkdir /Users/nyako/vqp/' + dockerId)
    os.system('chmod -R 777 /Users/nyako/vqp/' + dockerId)
    if fatherDockerId:
        os.system('cp -r /Users/nyako/vqp/' + fatherDockerId +
                  '/ /Users/nyako/vqp/' + dockerId + '/')

    return dockerId


def get_diff(dockerIda, dockerIdb):
    diff = os.popen('diff -ruNa /Users/nyako/vqp/' +
                    dockerIda + ' /Users/nyako/vqp/' + dockerIdb).read()
    diff = diff.replace('/Users/nyako/vqp/' + dockerIda, '/a')
    diff = diff.replace('/Users/nyako/vqp/' + dockerIdb, '/b')
    return diff


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/answer/create')
def createAnswer():
    user = request.args.get('user')
    desp = ''
    qid = request.args.get('qid')
    fatherDockerId = db['question'].find_one(
        {'_id': ObjectId(qid)})['dockerId']
    dockerId = new_docker_id(fatherDockerId)

    answer = {}
    answer['user'] = user
    answer['desp'] = desp
    answer['time'] = datetime.now()
    answer['dockerId'] = dockerId
    answer['fatherDockerId'] = fatherDockerId
    answer['diff'] = get_diff(fatherDockerId, dockerId)
    answer['status'] = 0

    db['answer'].insert_one(answer)

    aid = str(answer['_id'])
    db['question'].update_one({'_id': ObjectId(qid)}, {
                              '$push': {'answer': aid}})
    return {'status': 'ok', 'aid': aid, 'dockerId': dockerId}


@app.route('/answer/save')
def saveAnswer(final=0):
    aid = request.args.get('aid')
    desp = request.args.get('desp')

    fatherDockerId = db['answer'].find_one(
        {'_id': ObjectId(aid)})['fatherDockerId']
    dockerId = db['answer'].find_one({'_id': ObjectId(aid)})['dockerId']

    answer = {}
    answer['desp'] = desp
    answer['time'] = datetime.now()
    answer['diff'] = get_diff(fatherDockerId, dockerId)
    if final == 1:
        answer['status'] = 1

    db['answer'].update_one({'_id': ObjectId(aid)}, {'$set': answer})
    update_qid_search(str(db['question'].find_one({'dockerId': fatherDockerId})['_id']))

    return {'status': 'ok'}


@app.route('/answer/submit')
def submitAnswer():
    return saveAnswer(1)


@app.route('/dockerId/in')
def dockerIdIn():
    user = request.args.get('user')
    dockerId = request.args.get('dockerId')

    password = db['user'].find_one({'username': user})['password']
    port = str(random.randint(10000, 20000))
    subprocess.Popen('timeout 1800 docker run --env PASSWORD=' + password + ' -it -p 0.0.0.0:' + port +
                     ':8080 -v "/Users/nyako/vqp/' + dockerId + ':/home/coder/project" codercom/code-server:v2', shell=True)
    time.sleep(3)
    return redirect('http://211.65.35.118:' + port + '/?folder=/home/coder/project')


@app.route('/question/searchRecommend')
def searchRecommendQuestion():
    keywords = request.args.get('keywords')

    subscriptionKey = 'a767a7b743c345f085a3a812845690f4'
    headers = {'Ocp-Apim-Subscription-Key': subscriptionKey}
    conn = http.client.HTTPSConnection('vq-recomm.cognitiveservices.azure.com')
    conn.request(
        "GET", '/bing/v7.0/suggestions?setLang=en-US&mkt=en-US&q=' + quote(keywords), None, headers)
    response = conn.getresponse().read()
    recommend = eval(response)
    res = []
    for rec in recommend['suggestionGroups'][0]['searchSuggestions']:
        res.append(rec['query'])

    return {'status': 'ok', 'recommend': recommend}


@app.route('/question/search')
def searchQuestion():
    keywords = request.args.get('keywords')
    limit = request.args.get('limit')

    if limit:
        limit = int(limit)
    else:
        limit = 9999

    subscriptionKey = 'A726C37600686E6ECF0BF3E0A36CD57B'
    headers = {'api-key': subscriptionKey}
    conn = http.client.HTTPSConnection('vq-search.search.windows.net')
    conn.request(
        "GET", '/indexes/cosmosdb-index/docs?api-version=2019-05-06&search=' + quote(keywords), None, headers)
    response = conn.getresponse().read()
    qids = set([i['qid'] for i in eval(response)['value']])

    res = []

    for qid in qids:

        question = db['question'].find_one({'_id': ObjectId(qid)})

        tmp = {}
        tmp['qid'] = str(question['_id'])
        tmp['user'] = question['user']
        tmp['title'] = question['title']
        tmp['time'] = question['time']
        tmp['desp'] = question['desp']
        tmp['status'] = question['status']
        res.append(tmp)

    res = res[:min(len(res), limit)]
    return {'status': 'ok', 'question': res}


@app.route('/question/get')
def getQuestion():
    user = request.args.get('user')
    qid = request.args.get('qid')

    question = db['question'].find_one({'_id': ObjectId(qid)})

    res = {}
    res['qid'] = str(question['_id'])
    res['user'] = question['user']
    res['title'] = question['title']
    res['time'] = question['time']
    res['desp'] = question['desp']
    res['status'] = question['status']
    res['dockerId'] = question['dockerId']
    res['answer'] = []

    for aid in question['answer']:
        answer = db['answer'].find_one({'_id': ObjectId(aid)})

        tmp = {}
        tmp['aid'] = str(answer['_id'])
        tmp['user'] = answer['user']
        tmp['diff'] = answer['diff']
        tmp['time'] = answer['time']
        tmp['desp'] = answer['desp']
        tmp['status'] = answer['status']

        if answer['status'] == 1 and question['user'] == user:
            tmp['dockerId'] = answer['dockerId']

        if answer['status'] == 0:
            if answer['user'] != user:
                continue
            else:
                tmp['dockerId'] = answer['dockerId']

        res['answer'].append(tmp)
    return {'status': 'ok', 'question': res}


@app.route('/question/list')
def listQuestion():
    user = request.args.get('user')

    questions = db['question'].find()
    res = []
    for question in questions:
        if question['status'] == 0 and not user:
            continue
        if user and question['user'] != user:
            answered = False
            for aid in question['answer']:
                answer = db['answer'].find_one({'_id': ObjectId(aid)})
                if answer['user'] == user:
                    answered = True
                    break

            if not answered:
                continue

        tmp = {}
        tmp['qid'] = str(question['_id'])
        tmp['user'] = question['user']
        tmp['title'] = question['title']
        tmp['time'] = question['time']
        tmp['desp'] = question['desp']
        tmp['status'] = question['status']

        tmp = {}
        tmp['qid'] = str(question['_id'])
        tmp['user'] = question['user']
        tmp['title'] = question['title']
        tmp['time'] = question['time']
        tmp['desp'] = question['desp']
        tmp['status'] = question['status']

        if user:
            tmp['dockerId'] = question['dockerId']

        res.append(tmp)
    return {'status': 'ok', 'questions': res}


@app.route('/question/create')
def createQuestion():
    user = request.args.get('user')
    title = request.args.get('title')
    desp = ''
    dockerId = new_docker_id()

    question = {}
    question['user'] = user
    question['title'] = title
    question['time'] = datetime.now()
    question['desp'] = desp
    question['dockerId'] = dockerId
    question['status'] = 0
    question['answer'] = []

    res = db['question'].insert_one(question)

    return {'status': 'ok', 'qid': str(question['_id']), 'dockerId': dockerId}


@app.route('/question/save')
def saveQuestion(final=0):
    qid = request.args.get('qid')
    title = request.args.get('title')
    desp = request.args.get('desp')

    question = {}
    question['title'] = title
    question['time'] = datetime.now()
    question['desp'] = desp
    if final == 1:
        question['status'] = 1

    res = db['question'].update_one({'_id': ObjectId(qid)}, {'$set': question})
    update_qid_search(qid)

    return {'status': 'ok'}


@app.route('/question/submit')
def submitQuestion():
    return saveQuestion(1)


@app.route('/login')
def login():
    username = request.args.get('username')
    password = request.args.get('password')
    res = db['user'].find({'username': username, 'password': password}).count()

    return {'status': 'ok' if res else 'error'}


@app.route('/signin')
def signin():
    username = request.args.get('username')
    password = request.args.get('password')
    res = db['user'].insert({'username': username, 'password': password})

    return {'status': 'ok'}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
