"""
Main module of the app. Optionally it accepts Mongo DB host address as positional arg.
Usage examples:
python main.py - app connects to local DB
python main.py mongo - app connects to "mongo" docker image
"""


import asyncio
from aiohttp import web
from motor.motor_asyncio import AsyncIOMotorClient
from routes import setup_routes
from aiohttp_middlewares import cors_middleware
import sys


async def setup_db(db_host):
    db = AsyncIOMotorClient(db_host, 27017).car_list
    return db

try:
    db_host = sys.argv[1]
except IndexError:
    db_host = 'localhost'


loop = asyncio.get_event_loop()
db = loop.run_until_complete(setup_db(db_host))
app = web.Application(
    middlewares=[cors_middleware(allow_all=True)]
)
setup_routes(app)
app['db'] = db

web.run_app(app)

