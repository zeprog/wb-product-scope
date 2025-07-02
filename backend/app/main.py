from fastapi import FastAPI
from app.database import engine, Base
from app.routers.products import router as products_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
  title="WB Analytics Service",
  description="Сервис парсинга и аналитики товаров Wildberries",
  version="1.0.0"
)

app.include_router(products_router)
