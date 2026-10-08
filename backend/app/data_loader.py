from pathlib import Path

import pandas as pd


# backend/data/updated_data.csv
DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "updated_data.csv"


def load_schemes() -> pd.DataFrame:
    """Load the government scheme dataset."""
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Scheme dataset not found at: {DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    # Remove completely empty columns such as "Unnamed: 9"
    df = df.dropna(axis=1, how="all")

    # Replace NaN values with empty strings
    df = df.fillna("")

    return df


def get_scheme_count() -> int:
    """Return the total number of schemes."""
    return len(load_schemes())