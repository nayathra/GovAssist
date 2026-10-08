from pathlib import Path
import sys

import pandas as pd

# Allow the script to import the backend app package when run from /backend.
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import get_schemes_collection


DATA_PATH = BACKEND_DIR / "data" / "updated_data.csv"


def main() -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")

    collection = get_schemes_collection()

    df = pd.read_csv(DATA_PATH)
    df = df.dropna(axis=1, how="all").fillna("")

    records = df.to_dict(orient="records")

    if not records:
        raise RuntimeError("The CSV contains no scheme records.")

    collection.delete_many({})

    result = collection.insert_many(records)

    # Slugs in the source dataset are not guaranteed to be unique.
    # Keep a normal index so search/detail lookups remain fast without
    # rejecting legitimate duplicate source records.
    collection.create_index("slug")
    collection.create_index("schemeCategory")
    collection.create_index("level")

    print(f"Imported {len(result.inserted_ids)} schemes into MongoDB.")
    print(f"Database: {collection.database.name}")
    print(f"Collection: {collection.name}")


if __name__ == "__main__":
    main()
