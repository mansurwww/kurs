import asyncio
import json
import logging
import aio_pika
from config import settings
from tasks import handle_ai_generate_quiz, handle_ai_evaluate_answer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("worker")


async def main():
    logger.info("RabbitMQ Background Worker іске қосылуда...")

    connection = None
    while connection is None:
        try:
            connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
            logger.info("RabbitMQ брокеріне сәтті қосылды!")
        except Exception as e:
            logger.warning(f"RabbitMQ әзірге қолжетімсіз ({e}), 5 секундтан кейін қайта көреміз...")
            await asyncio.sleep(5)

    async with connection:
        channel = await connection.channel()
        await channel.set_qos(prefetch_count=5)

        queue = await channel.declare_queue(settings.QUEUE_NAME, durable=True)
        logger.info(f"'{settings.QUEUE_NAME}' кезегі тыңдалуда. Тапсырмаларды күтуде...")

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    try:
                        data = json.loads(message.body.decode())
                        task_type = data.get("task_type")
                        payload = data.get("payload", {})
                        logger.info(f"Жаңа тапсырма қабылданды: {task_type}")

                        if task_type == "generate_quiz":
                            res = await handle_ai_generate_quiz(payload)
                            logger.info(f"Тапсырма орындалды: {res.get('status')}")
                        elif task_type == "evaluate_answer":
                            res = await handle_ai_evaluate_answer(payload)
                            logger.info(f"Тапсырма орындалды: {res.get('status')}")
                        else:
                            logger.warning(f"Белгісіз тапсырма түрі: {task_type}")
                    except Exception as err:
                        logger.error(f"Тапсырманы өңдеу қатесі: {err}")


if __name__ == "__main__":
    asyncio.run(main())

