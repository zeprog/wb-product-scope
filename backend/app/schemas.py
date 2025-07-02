from typing import List, Optional
from pydantic import BaseModel

class ProductBase(BaseModel):
  wb_id: int
  name: str
  price: int
  discount_price: int
  rating: float
  reviews: int

class ProductCreate(ProductBase):
  pass

class Product(ProductBase):
  id: int

  class Config:
      orm_mode = True

class DeleteByIds(BaseModel):
    ids: List[int]

class DeleteByFilter(BaseModel):
    min_price: Optional[int] = 0
    max_price: Optional[int] = None
    min_rating: Optional[float] = 0.0
    min_reviews: Optional[int] = 0