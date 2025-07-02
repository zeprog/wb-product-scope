import pytest


def test_read_no_matches_with_tight_filter(client):
	"""
	Если в базе что-то уже есть, убедимся, что фильтр всё равно может вернуть пустой список.
	"""
	r = client.get("/api/products/?min_price=100000000")
	assert r.status_code == 200
	assert r.json() == []


def test_parse_and_read(client):
	resp = client.post("/api/products/parse/foo")
	assert resp.status_code == 202
	parsed = resp.json().get("parsed")
	assert isinstance(parsed, int)
	r2 = client.get("/api/products/?min_price=0&min_rating=0&min_reviews=0")
	assert r2.status_code == 200
	assert isinstance(r2.json(), list)


@pytest.mark.parametrize(
	"payload, expected_count",
	[
		(
			{
				"wb_id": 100,
				"name": "X",
				"price": 10,
				"discount_price": 5,
				"rating": 3.0,
				"reviews": 1,
			},
			1,
		),
	],
)
def test_add_and_delete_single(client, payload, expected_count):

	r = client.post("/api/products/", json=payload)
	assert r.status_code == 201
	body = r.json()
	assert body["wb_id"] == payload["wb_id"]
	prod_id = body["id"]
	r2 = client.delete(f"/api/products/{prod_id}")
	assert r2.status_code == 204
	all_products = client.get("/api/products/").json()
	wb_ids = [p["wb_id"] for p in all_products]
	assert payload["wb_id"] not in wb_ids


def test_bulk_delete_all(client):
	for i in (201, 202):
		client.post(
			"/api/products/",
			json={
				"wb_id": i,
				"name": "N",
				"price": 1,
				"discount_price": 1,
				"rating": 1.0,
				"reviews": 0,
			},
		)
	r = client.delete("/api/products/")
	assert r.status_code == 200
	assert r.json().get("deleted") >= 2

	assert client.get("/api/products/").json() == []
