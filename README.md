# wb-product-scope

## WB Product Scope - Backend

FastAPI-сервис для парсинга и аналитики товаров с Wildberries.
Позволяет парсить товары по поисковому запросу, фильтровать их по цене, рейтингу и отзывам, сохранять в БД и управлять ими через API.

### Стек

* Python 3.11
* FastAPI
* SQLAlchemy
* PostgreSQL
* Docker / docker-compose

---

### Быстрый старт

#### 1. Клонировать репозиторий

```bash
git clone https://github.com/username/wb-product-scope-backend.git
cd wb-product-scope-backend
```

#### 2. Поднять сервисы

```bash
docker-compose up --build
```

Сервис поднимется на [http://localhost:8000](http://localhost:8000)

---

### Переменные окружения

Создаем `.env` в корне:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/postgres
```

---

### Основные эндпоинты

| Метод    | URL                           | Описание                                          |
| -------- | ----------------------------- | --------------------------------------------------|
| `GET`    | `/api/products/`              | Получить список товаров с фильтрами               |
| `POST`   | `/api/products/parse/{query}` | Спарсить первые уникальные 100 товаров по запросу |
| `POST`   | `/api/products/`              | Добавить товар вручную                            |
| `DELETE` | `/api/products/{id}`          | Удалить товар по ID                               |
| `DELETE` | `/api/products/`              | Удалить по фильтру / всем товарам                 |

Примеры запросов:

```
GET /api/products/?min_price=1000&min_rating=4.5&min_reviews=100
POST /api/products/parse/футболка
```

---

### Особенности

* Уникальность товаров по `wb_id`, чтобы избежать дублей
* Парсинг из официального API WB v13
* Удобное расширение фильтров
* Поддержка удаления по фильтрам, списку ID или всех записей

---

### Структура

```
app/
├── crud.py         # Логика взаимодействия с БД
├── database.py     # Подключение и сессии SQLAlchemy
├── models.py       # SQLAlchemy модели
├── schemas.py      # Pydantic схемы
├── config.py       # Настройки из .env
├── main.py         # Точка входа
├── routers/
│   └── products.py # Роуты продуктов
└── parsers/
    └── wildberries.py # Парсер WB
```

---

### TODO

* [x] Парсинг товаров
* [x] Фильтрация и API
* [x] Удаление товаров
* [x] Юнит-тесты
* [x] CI/CD через GitHub Actions

## WB Product Scope - Frontend

Интерфейс аналитики товаров на React + Vite + TypeScript. Поддерживает поиск, фильтрацию, сортировку, пагинацию и визуализацию данных по товарам с Wildberries.

### Стек

* React + TypeScript
* Vite
* Axios
* Recharts
* Docker

---

### Запуск фронтенда вручную (без Docker)

#### 1. Установите зависимости:

```bash
cd frontend
npm install
```

#### 2. Запустите дев-сервер:

```bash
npm run dev
```

Фронтенд поднимется на [http://localhost:5173](http://localhost:5173)

---

### Переменные окружения для фронта

Создайте `.env.development` в папке `frontend`:

```env
VITE_BACKEND_URL=http://localhost:8000
```

---

### Возможности

* Поиск по названию товара
* Фильтрация по:

  * цене (min-max)
  * рейтингу (от N)
  * количеству отзывов (от N)
* Графики: цена, рейтинг, отзывы
* Парсинг товаров по ключевому слову (до 100 уникальных)
* Таблица с сортировкой и пагинацией

---

### Docker-сборка (фронт + бэк + БД)

Оба сервиса запускаются из общего `docker-compose.yml`:

```bash
docker-compose up --build
```

После запуска:

* Бэкенд: [http://localhost:8000](http://localhost:8000)
* Фронтенд: [http://localhost:5173](http://localhost:5173)

---

### TODO (Frontend)

* [x] Таблица товаров с пагинацией
* [x] Фильтры по цене, рейтингу, отзывам
* [x] Сортировка по полям
* [x] Графики по товарам
* [x] Подключение к API
* [x] Парсинг из WB
* [x] CI/CD для Docker-сборки