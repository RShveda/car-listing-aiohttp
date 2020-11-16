from views import CarListView, CarView
from aiohttp import web


def setup_routes(app):
    app.add_routes([web.view('/cars', CarListView)])
    app.add_routes([web.view('/cars/{id}', CarView)])

