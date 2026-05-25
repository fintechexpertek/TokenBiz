# Token Marketplace — Backend

FastAPI бекенд для маркетплейсу бізнес-токенів на Solana.

## Вимоги

- Python 3.12+
- Docker (для PostgreSQL)
- Node.js 18+ (для фронтенду)

---

## Запуск

### 1. Клонуйте / розпакуйте проект

Папки проекту:
```
elena/          ← фронтенд (React)
elena-backend/  ← бекенд (FastAPI)
```

### 2. Запустіть базу даних

```bash
cd elena-backend
docker compose up db -d
```

### 3. Запустіть бекенд

```bash
cd elena-backend
python3 -m venv venv
source venv/bin/activate        # Linux/Mac
# або venv\Scripts\activate     # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

API буде доступне на: **http://localhost:8000**  
Swagger документація: **http://localhost:8000/docs**

### 4. Запустіть фронтенд (в окремому терміналі)

```bash
cd elena
npm install
npm run dev
```

Сайт буде доступний на: **http://localhost:5173**

---

## API ендпоінти

| Метод | URL | Опис |
|-------|-----|------|
| POST | /auth/register | Реєстрація |
| POST | /auth/login | Логін → JWT токен |
| GET | /users/me | Поточний користувач |
| GET | /projects/ | Список токенів |
| POST | /projects/ | Створити проект |
| POST | /transactions/ | Купити/продати токен |
| POST | /buybacks/ | Запит на викуп |
| POST | /complaints/ | Подати скаргу |
| PATCH | /users/{id}/verification | Змінити статус (ADMIN) |

Повний список: **http://localhost:8000/docs**

---

## Ролі користувачів

| Роль | Опис |
|------|------|
| BUSINESS | Бізнес з юридичною особою |
| INDIVIDUAL | Фіз особа, хоче оформити компанію |
| BUYER | Покупець токенів |
| ADMIN | Адміністратор платформи |

## Статуси верифікації

`not_verified` → `under_review` → `verified` (або `blocked`)

Статус змінює адміністратор через адмін панель або API.
