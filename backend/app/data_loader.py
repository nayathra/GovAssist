import os
from pathlib import Path

import pandas as pd

from app.database import get_schemes_collection


DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "updated_data.csv"


def _clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.drop(columns=["_id"], errors="ignore")
    df = df.dropna(axis=1, how="all")
    return df.fillna("")


def load_schemes() -> pd.DataFrame:
    """
    Load schemes from MongoDB when configured, otherwise use the local CSV.

    The CSV fallback keeps local development working before MongoDB is set up.
    """
    if os.getenv("MONGODB_URI", "").strip():
        collection = get_schemes_collection()
        documents = list(collection.find({}, {"_id": 0}))
        if not documents:
            raise RuntimeError(
                "MongoDB is connected, but the schemes collection is empty. "
                "Run the scheme migration script first."
            )
        return _clean_dataframe(pd.DataFrame(documents))

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Scheme dataset not found at: {DATA_PATH}"
        )

    return _clean_dataframe(pd.read_csv(DATA_PATH))


def get_scheme_count() -> int:
    """Return the total number of schemes."""
    return len(load_schemes())
