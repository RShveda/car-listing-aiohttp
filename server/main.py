import asyncio
from aiohttp import web
from motor.motor_asyncio import AsyncIOMotorClient
from routes import setup_routes

from aiohttp_middlewares import cors_middleware


async def setup_db():
    db = AsyncIOMotorClient().car_list
    return db

loop = asyncio.get_event_loop()
db = loop.run_until_complete(setup_db())
app = web.Application(
    middlewares=[cors_middleware(allow_all=True)]
)
setup_routes(app)
app['db'] = db

web.run_app(app)

