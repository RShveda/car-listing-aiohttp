"""
Module that create a mongodb collection and pre-populate it with dummy data. Optionally it accepts Mongo DB
host address as positional arg.
"""

from motor.motor_asyncio import AsyncIOMotorClient


async def generate_data(db_host):
    """
    This func perform few operations: 1) create a DB named "car_list" 2) clear "cars" table (in case it exist)
    3) creates unique index for "vin" attr 4) generate dummy data to populate db.car_list.cars
    """
    print(db_host)
    db = AsyncIOMotorClient(db_host, 27017).car_list
    cars = db.cars
    await cars.drop()
    await cars.create_index("vin", name="vin", unique=True)
    documents = [{
            'brand': 'Toyota',
            'model': 'Sienna',
            'year': 2018,
            'color': 'Blue',
            'vin': 'LLDWXZLG77VK2LUUF'
        },
        {
            'brand': 'Ford',
            'model': 'Fiesta',
            'year': 2010,
            'color': 'Silver',
            'vin': '5LTPW18567FJ08131'
        },
        {
            'brand': 'Renault',
            'model': 'Megane',
            'year': 2011,
            'color': 'Black',
            'vin': '1C3EL55R84N215284'
        }]

    for document in documents:
        try:
            result = await db.cars.insert_one(document)
            if not result.inserted_id:
                print('Could not create new item!')
            else:
                print("Success")
        except Exception as e:
            return e

if __name__ == '__main__':
    import asyncio
    import sys

    # resolving DB host
    try:
        host = sys.argv[1]
    except IndexError:
        host = '127.0.0.1'

    loop = asyncio.get_event_loop()
    loop.run_until_complete(generate_data(host))
