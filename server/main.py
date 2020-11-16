import asyncio
from aiohttp import web
from motor.motor_asyncio import AsyncIOMotorClient
from routes import setup_routes


async def setup_db():
    db = AsyncIOMotorClient().car_list
    return db

loop = asyncio.get_event_loop()
db = loop.run_until_complete(setup_db())
app = web.Application()
setup_routes(app)
app['db'] = db

web.run_app(app)

