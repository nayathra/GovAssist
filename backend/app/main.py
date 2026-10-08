from fastapi import FastAPI

from app.data_loader import load_schemes
from app.routes.schemes import router as schemes_router
from app.routes.recommendations import router as recommendations_router
from app.routes.assistant import router as assistant_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="GovAssist API",
    description="Backend API for Government Scheme Recommendation & AI Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(schemes_router)
app.include_router(recommendations_router)
app.include_router(assistant_router)


@app.get("/")
def root():
    return {
        "message": "GovAssist API is running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }