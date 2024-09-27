import asyncio

class DataManager:
    def __init__(self):
        self.data_queue = asyncio.Queue()
        self.observers = []

    async def update_data(self, new_data):
        await self.data_queue.put(new_data)
        await self.notify_observers(new_data)

    async def get_latest_data(self):
        return await self.data_queue.get()

    def register_observer(self, observer):
        self.observers.append(observer)

    async def notify_observers(self, data):
        for observer in self.observers:
            await observer.update(data)


data_manager = DataManager()
