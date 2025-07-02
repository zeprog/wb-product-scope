import httpx
import asyncio
from typing import List

from app.schemas import ProductCreate
from app.database import SessionLocal
from app.crud import create_product, get_product_by_wb_id

WB_SEARCH_URL = "https://search.wb.ru/exactmatch/ru/common/v13/search"

async def fetch_products_v13(
    query: str,
    page: int = 1,
    per_page: int = 30
) -> List[ProductCreate]:
    params = {
        "ab_testing": "false",
        "appType": "1",
        "curr": "rub",
        "dest": "-1257786",
        "hide_dtype": "13",
        "lang": "ru",
        "page": str(page),
        "query": query,
        "resultset": "catalog",
        "sort": "popular",
        "spp": str(per_page),
        "suppressSpellcheck": "false",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(WB_SEARCH_URL, params=params)
        resp.raise_for_status()
        payload = resp.json()

    products = payload.get("data", {}).get("products", [])
    result: List[ProductCreate] = []

    for item in products:
        wb_id = item.get("id")
        name = item.get("name", "").strip()
        rating = item.get("reviewRating", 0.0)
        reviews = item.get("feedbacks", 0)

        # берём цену из первого размера
        price = 0
        discount_price = 0
        sizes = item.get("sizes") or []
        if sizes:
            price_obj = sizes[0].get("price", {})
            price = price_obj.get("basic", 0) // 100
            discount_price = price_obj.get("product", 0) // 100

        result.append(ProductCreate(
            wb_id=wb_id,
            name=name,
            price=price,
            discount_price=discount_price,
            rating=rating,
            reviews=reviews,
        ))

    return result

def save_products(products: List[ProductCreate]) -> int:
    """
    Сохраняет только те товары, которых нет в базе (по wb_id).
    Возвращает число реально добавленных новых записей.
    """
    db = SessionLocal()
    try:
        new_count = 0
        for p in products:
            if get_product_by_wb_id(db, p.wb_id) is None:
                create_product(db, p)
                new_count += 1
        return new_count
    finally:
        db.close()

def parse_and_save_v13(
    query: str,
    pages: int = 1,
    per_page: int = 30
):
    all_items: List[ProductCreate] = []
    for pg in range(1, pages + 1):
        items = asyncio.run(fetch_products_v13(query, page=pg, per_page=per_page))
        all_items.extend(items)

    saved = save_products(all_items)
    print(f"Parsed & saved {saved} new item(s) out of {len(all_items)} fetched.")
