from fastapi import APIRouter, HTTPException, Query

from app.data_loader import load_schemes


router = APIRouter(prefix="/api/schemes", tags=["Schemes"])


@router.get("")
def get_schemes(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query("", max_length=100),
    category: str = Query("", max_length=100),
    level: str = Query("", max_length=50),
):
    df = load_schemes()

    # Search across important text fields
    if search.strip():
        search_text = search.strip().lower()

        searchable_columns = [
            "scheme_name",
            "details",
            "benefits",
            "eligibility",
            "tags",
        ]

        mask = False

        for column in searchable_columns:
            if column in df.columns:
                mask = mask | df[column].astype(str).str.contains(
                    search_text,
                    case=False,
                    na=False,
                    regex=False,
                )

        df = df[mask]

    # Category filter
    if category.strip() and "schemeCategory" in df.columns:
        df = df[
            df["schemeCategory"]
            .astype(str)
            .str.contains(category.strip(), case=False, na=False, regex=False)
        ]

    # Central / State filter
    if level.strip() and "level" in df.columns:
        df = df[
            df["level"]
            .astype(str)
            .str.contains(level.strip(), case=False, na=False, regex=False)
        ]

    total = len(df)

    start = (page - 1) * limit
    end = start + limit

    schemes = df.iloc[start:end].to_dict(orient="records")

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "count": len(schemes),
        "schemes": schemes,
    }

@router.get("/filters")
def get_filters():
    df = load_schemes()

    categories = sorted(
        {
            str(value).strip()
            for value in df["schemeCategory"].tolist()
            if str(value).strip()
        }
    )

    levels = sorted(
        {
            str(value).strip()
            for value in df["level"].tolist()
            if str(value).strip()
        }
    )

    return {
        "categories": categories,
        "levels": levels,
    }

@router.get("/{slug}")
def get_scheme_by_slug(slug: str):
    df = load_schemes()

    matches = df[
        df["slug"].astype(str).str.lower() == slug.lower()
    ]

    if matches.empty:
        raise HTTPException(
            status_code=404,
            detail="Scheme not found",
        )

    scheme = matches.iloc[0].to_dict()

    return {
        "scheme": scheme
    }