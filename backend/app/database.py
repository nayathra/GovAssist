import os

from pymongo import MongoClient
from pymongo.collection import Collection

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # pragma: no cover - optional during initial setup
    pass


_client: MongoClient | None = None


def get_schemes_collection() -> Collection:
    global _client

    uri = os.getenv("MONGODB_URI", "").strip()
    if not uri:
        raise RuntimeError(
            "MONGODB_URI is not configured. Add it to backend/.env."
        )

    database_name = os.getenv("MONGODB_DB", "govassist").strip() or "govassist"

    if _client is None:
        _client = MongoClient(uri, serverSelectionTimeoutMS=5000)

    return _client[database_name]["schemes"]


def ping_database() -> bool:
    collection = get_schemes_collection()
    collection.database.client.admin.command("ping")
    return True
