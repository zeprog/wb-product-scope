from app.crud import (
    create_product,
    get_products,
    delete_product,
    delete_products_by_ids,
    delete_products_by_filters,
    get_product_by_wb_id,
)
from app.schemas import ProductCreate

def test_crud_basic(db_session):
    pc = ProductCreate(wb_id=42, name="Foo", price=1000, discount_price=800, rating=4.7, reviews=150)
    prod = create_product(db_session, pc)
    assert prod.id is not None
    assert prod.wb_id == 42

    fetched = get_product_by_wb_id(db_session, 42)
    assert fetched is not None
    assert fetched.name == "Foo"

    lst = get_products(db_session, min_price=900, max_price=1200, min_rating=4.5, min_reviews=100)
    assert len(lst) == 1

    ok = delete_product(db_session, prod.id)
    assert ok is True
    assert delete_product(db_session, prod.id) is False

def test_delete_multiple_and_by_filter(db_session):
    items = [
        ProductCreate(wb_id=1, name="A", price=500, discount_price=400, rating=4.0, reviews= 50),
        ProductCreate(wb_id=2, name="B", price=1500, discount_price=1200, rating=4.5, reviews=200),
        ProductCreate(wb_id=3, name="C", price=2500, discount_price=2000, rating=3.5, reviews= 20),
    ]
    for p in items:
        create_product(db_session, p)

    count = delete_products_by_ids(db_session, [1, 3])
    assert count == 2

    remaining = get_products(db_session)
    assert len(remaining) == 1
    
    assert remaining[0].wb_id == 2
    count2 = delete_products_by_filters(db_session, min_price=1000)
    assert count2 == 1
    assert get_products(db_session) == []