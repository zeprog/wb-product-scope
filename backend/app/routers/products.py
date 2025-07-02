from fastapi import APIRouter, Body, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas import DeleteByFilter, DeleteByIds, Product, ProductCreate
from app.crud import create_product, delete_product, delete_products_by_filters, delete_products_by_ids, get_products
from app.database import get_db
from app.parsers.wildberries import fetch_products_v13

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=List[Product])
def read_products(
  min_price: int = Query(0, ge=0),
  max_price: int | None = Query(None, ge=0),
  min_rating: float = Query(0.0, ge=0.0, le=5.0),
  min_reviews: int = Query(0, ge=0),
  db: Session = Depends(get_db)
):
  """
  Фильтрация:
    - min_price — минимальная цена
    - max_price — максимальная цена (опционально)
    - min_rating — минимальный рейтинг
    - min_reviews — минимальное кол-во отзывов
  """
  return get_products(db, min_price, max_price, min_rating, min_reviews)

@router.post("/", response_model=Product, status_code=201)
def add_product(item: ProductCreate, db: Session = Depends(get_db)):
  """Ручное добавление одной записи"""
  return create_product(db, item)

@router.post("/parse/{query}", status_code=202)
async def parse_wb(query: str, db: Session = Depends(get_db)):
  """
  Парсит первые 100 товаров по запросу и сохраняет в БД.
  GET-запрос к WB + сохранение нужных полей.
  """
  items = await fetch_products_v13(query)
  for p in items:
      create_product(db, p)
  return {"parsed": len(items)}

@router.delete(
  "/{product_id}",
  status_code=204,
  summary="Удалить один товар по ID"
)
def remove_one(
  product_id: int,
  db: Session = Depends(get_db)
):
  if not delete_product(db, product_id):
    raise HTTPException(status_code=404, detail="Product not found")
  return

@router.delete(
  "/",
  summary="Массовое удаление: по списку ID, по фильтрам или всех записей"
)
def remove_many(
  by_ids: Optional[DeleteByIds] = Body(None),
  by_filter: Optional[DeleteByFilter] = Body(None),
  db: Session = Depends(get_db)
):
  """
  Способы удаления:
  1) DELETE /api/products/  (без тела) — удаляет все записи
  2) DELETE /api/products/  с { "ids": [1,2,3] }
  3) DELETE /api/products/  с фильтрами:
      {
        "min_price": 5000,
        "max_price": 20000,
        "min_rating": 4.5,
        "min_reviews": 100
      }
  """
  if by_ids and by_filter:
    raise HTTPException(400, "Используйте либо ids, либо filter, не оба сразу")

  if by_ids:
    count = delete_products_by_ids(db, by_ids.ids)

  elif by_filter:
    count = delete_products_by_filters(
      db,
      min_price=by_filter.min_price or 0,
      max_price=by_filter.max_price,
      min_rating=by_filter.min_rating or 0.0,
      min_reviews=by_filter.min_reviews or 0
    )

  else:
    count = delete_products_by_filters(db)

  return {"deleted": count}