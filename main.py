import asyncio
from aiohttp import web
from motor.motor_asyncio import AsyncIOMotorClient
import json
from bson import json_util, ObjectId



async def setup_db():
    db = AsyncIOMotorClient().car_list
    return db


async def cars_list(request):
    # Retrieve the long-lived database handle.
    db = request.app['db']
    cursor = db.cars.find()
    json_docs = []
    for doc in await cursor.to_list(length=100):
        json_doc = json.dumps(doc, default=json_util.default)
        json_docs.append(json_doc)

    if not cars_list:
        return web.HTTPNotFound(text='No pages found!')

    return web.json_response(json_docs)
    # return web.Response(status=200, body=json.dumps(json_docs), content_type='application/json')


async def search(request):
    db = request.app['db']
    query = await request.json()
    cursor = await db.cars.find({'model': query["model"]}).to_list(length=100)
    json_doc = json_util.dumps(cursor, default=json_util.default)
    return web.json_response(json_doc)


async def get_car(request):
    db = request.app['db']
    _id = request.match_info.get('id')
    cursor = await db.cars.find_one({'_id': ObjectId(_id)})
    json_doc = json_util.dumps(cursor)
    return web.json_response(json_doc)


async def update_car(request):
    db = request.app['db']
    _id = request.match_info.get('id')
    data = await request.json()
    new_document = await db.cars.replace_one({'_id': ObjectId(_id)}, data)
    return web.Response(status=200)


async def new_car(request):
    # await db.cars.insert_one({'manufacturer': 'Toyota',
    #                            'model': "Siena",
    #                            'year': 2001,
    #                            'color': "Blue",
    #                            'VIN': "fed243edwe"})
    document = {'key': 'value'}
    result = await db.cars.insert_one(document)
    print('result %s' % repr(result.inserted_id))
    return web.Response(status=200)


async def delete_car(request):
    db = request.app['db']
    _id = request.match_info.get('id')
    await db.cars.delete_many({'_id': ObjectId(_id)})


async def hello(request):
    return web.Response(text="Hello, world")


loop = asyncio.get_event_loop()
db = loop.run_until_complete(setup_db())
app = web.Application()
app.add_routes([web.get('/', hello)])
app.add_routes([web.get('/cars', cars_list)])
app.add_routes([web.post('/cars', search)])
app.add_routes([web.get('/cars/{id}', get_car)])
app.add_routes([web.put('/cars/{id}', update_car)])
app.add_routes([web.delete('/cars/{id}', delete_car)])
app.add_routes([web.post('/cars/new', new_car)])
app['db'] = db
# Route requests to the page_handler() coroutine.
# app.router.add_get('/pages/{page_name}', page_handler)
web.run_app(app)


web.run_app(app)
