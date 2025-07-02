from fastapi import FastAPI
from app.database import engine, Base
from app.routers.products import router as products_router

app = FastAPI(
  title="WB Analytics Service",
  description="Сервис парсинга и аналитики товаров Wildberries",
  version="1.0.0"
)

@app.on_event("startup")
def on_startup():
  Base.metadata.create_all(bind=engine)

app.include_router(products_router)
