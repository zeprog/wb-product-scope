from sqlalchemy.orm import Session
from typing import List, Optional
from app.models import Product
from app.schemas import ProductCreate

def get_product_by_wb_id(db: Session, wb_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.wb_id == wb_id).first()

def create_product(db: Session, product: ProductCreate) -> Product:
  db_obj = Product(**product.dict())
  db.add(db_obj)
  db.commit()
  db.refresh(db_obj)
  return db_obj

def get_products(
  db: Session,
  min_price: int = 0,
  max_price: int | None = None,
  min_rating: float = 0.0,
  min_reviews: int = 0
) -> List[Product]:
  q = db.query(Product).filter(
    Product.price >= min_price,
    Product.rating >= min_rating,
    Product.reviews >= min_reviews
  )
  if max_price is not None:
    q = q.filter(Product.price <= max_price)
  return q.all()

def delete_products_by_filters(
    db: Session,
    min_price: int = 0,
    max_price: Optional[int] = None,
    min_rating: float = 0.0,
    min_reviews: int = 0
) -> int:
    """
    Удалить все товары, у которых
      price >= min_price,
      price <= max_price (если задан max_price),
      rating >= min_rating,
      reviews >= min_reviews.
    Возвращает число удалённых записей.
    """
    q = db.query(Product).filter(
        Product.price >= min_price,
        Product.rating >= min_rating,
        Product.reviews >= min_reviews
    )
    if max_price is not None:
        q = q.filter(Product.price <= max_price)

    deleted_count = q.delete(synchronize_session=False)
    db.commit()
    return deleted_count

def delete_product(db: Session, product_id: int) -> bool:
    obj = db.get(Product, product_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def delete_products_by_ids(db: Session, ids: List[int]) -> int:
    deleted_count = (
        db.query(Product)
          .filter(Product.id.in_(ids))
          .delete(synchronize_session=False)
    )
    db.commit()
    return deleted_count