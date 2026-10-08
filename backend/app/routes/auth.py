import hashlib
import secrets
import sqlite3
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "govassist.db"


class AuthRequest(BaseModel):
    name: str = ""
    email: str
    password: str


def _get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def _init_db():
    with _get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL
            )
            """
        )
        connection.commit()


def _hash_password(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        120_000,
    ).hex()


_init_db()


@router.post("/register")
def register(request: AuthRequest):
    name = request.name.strip()
    email = request.email.strip().lower()
    password = request.password

    if not name:
        raise HTTPException(status_code=400, detail="Name is required.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    salt = secrets.token_hex(16)
    password_hash = _hash_password(password, salt)

    try:
        with _get_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO users (name, email, password_hash, salt)
                VALUES (?, ?, ?, ?)
                """,
                (name, email, password_hash, salt),
            )
            user_id = cursor.lastrowid
            connection.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    return {
        "message": "Account created successfully.",
        "user": {"id": user_id, "name": name, "email": email},
    }


@router.post("/login")
def login(request: AuthRequest):
    email = request.email.strip().lower()

    with _get_connection() as connection:
        user = connection.execute(
            "SELECT id, name, email, password_hash, salt FROM users WHERE email = ?",
            (email,),
        ).fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    password_hash = _hash_password(request.password, user["salt"])

    if not secrets.compare_digest(password_hash, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return {
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
        },
    }
