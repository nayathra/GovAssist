import re

from fastapi import APIRouter, HTTPException, Query

from app.database import get_schemes_collection


router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

SEARCH_FIELDS = [
    "scheme_name",
    "details",
    "benefits",
    "eligibility",
    "tags",
]


def _text_filter(value: str) -> dict:
    escaped = re.escape(value.strip())
    return {
        "$regex": escaped,
        "$options": "i",
    }


@router.get("")
def get_schemes(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query("", max_length=100),
    category: str = Query("", max_length=100),
    level: str = Query("", max_length=50),
):
    collection = get_schemes_collection()

    filters: list[dict] = []

    if search.strip():
        search_filter = {
            "$or": [
                {field: _text_filter(search)}
                for field in SEARCH_FIELDS
            ]
        }
        filters.append(search_filter)

    if category.strip():
        filters.append({"schemeCategory": _text_filter(category)})

    if level.strip():
        filters.append({"level": _text_filter(level)})

    query = {"$and": filters} if filters else {}

    total = collection.count_documents(query)
    skip = (page - 1) * limit

    documents = list(
        collection.find(query, {"_id": 0})
        .sort("scheme_name", 1)
        .skip(skip)
        .limit(limit)
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "count": len(documents),
        "schemes": documents,
    }


@router.get("/filters")
def get_filters():
    collection = get_schemes_collection()

    categories = sorted(
        {
            str(value).strip()
            for value in collection.distinct("schemeCategory")
            if str(value).strip()
        }
    )

    levels = sorted(
        {
            str(value).strip()
            for value in collection.distinct("level")
            if str(value).strip()
        }
    )

    return {
        "categories": categories,
        "levels": levels,
    }


@router.get("/{slug}")
def get_scheme_by_slug(slug: str):
    collection = get_schemes_collection()

    scheme = collection.find_one(
        {"slug": {"$regex": f"^{re.escape(slug)}$", "$options": "i"}},
        {"_id": 0},
    )

    if scheme is None:
        raise HTTPException(
            status_code=404,
            detail="Scheme not found",
        )

    return {
        "scheme": scheme
    }
