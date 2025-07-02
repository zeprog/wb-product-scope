from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Product(Base):
  __tablename__ = "products"

  id = Column(Integer, primary_key=True, index=True)
  wb_id = Column(Integer, unique=True, nullable=False, index=True)
  name = Column(String, nullable=False)
  price = Column(Integer, nullable=False)
  discount_price = Column(Integer, nullable=False)
  rating = Column(Float, default=0.0)
  reviews = Column(Integer, default=0)