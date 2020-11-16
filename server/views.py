import asyncio
from aiohttp import web
import json
import bson
from bson import json_util, ObjectId
from pymongo import errors


class CarListView(web.View):

    async def get(self):
        """List car items"""
        db = self.request.app['db']
        query = self.request.rel_url.query
        if query:
            try:
                cursor = await db.cars.find({'model': query["model"]}).to_list(None)
            except KeyError:
                return web.HTTPNotFound(text='Wrong query format!')
        else:
            cursor = await db.cars.find().to_list(None)
        json_docs = json_util.dumps(cursor, default=json_util.default)
        if not json_docs:
            return web.HTTPNotFound(text='No pages found!')
        return web.json_response(json_docs)
        # return web.Response(status=200, body=json.dumps(json_docs), content_type='application/json')

    async def post(self):
        """
        Create new car item
        {'manufacturer': 'Toyota',
        'model': "Siena",
        'year': 2001,
        'color': "Blue",
        'VIN': "fed243edwe"}
        """
        db = self.request.app['db']
        document = await self.request.json()
        try:
            result = await db.cars.insert_one(document)
            if not result.inserted_id:
                return web.HTTPNotFound(text='Could not create new item!')
        except errors.DuplicateKeyError as e:
            return web.HTTPBadRequest(text=str(e))
        return web.Response(status=201)


class CarView(web.View):

    async def get(self):
        """View car item"""
        db = self.request.app['db']
        _id = self.request.match_info.get('id')
        try:
            doc_id = ObjectId(_id)
            cursor = await db.cars.find_one({'_id': doc_id})
            json_doc = json_util.dumps(cursor)
            return web.json_response(json_doc)
        except Exception as e:
            print(e)
            return web.HTTPNotFound(text='No page found!')

    async def post(self):
        """Edit car item"""
        db = self.request.app['db']
        _id = self.request.match_info.get('id')
        try:
            data = await self.request.json()
            result = await db.cars.replace_one({'_id': ObjectId(_id)}, data)
            if not result.matched_count:
                return web.HTTPNotFound(text='Could not create new item!')
        except Exception as e:
            return web.HTTPBadRequest(text=str(e))
        return web.Response(status=200)

    async def delete(self):
        """Delete car item"""
        db = self.request.app['db']
        _id = self.request.match_info.get('id')
        try:
            result = await db.cars.delete_many({'_id': ObjectId(_id)})
            if not result.deleted_count:
                return web.HTTPBadRequest(text='Could not delete an item!')
        except Exception as e:
            return web.HTTPBadRequest(text=str(e))
        return web.Response(status=200)