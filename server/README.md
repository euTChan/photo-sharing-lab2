# Photo App - Lab 2

## 1. Cai dat
Mo terminal tai thu muc `server` va chay:

```bash
npm install
```

## 2. Cau hinh MongoDB
Tao database MongoDB Atlas, sao chep `.env.example` thanh `.env`, sau do thay `DB_URL` bang connection string cua database.

## 3. Nap du lieu mau
Chay lenh sau tai thu muc `server`:

```bash
npm run load-db
```

Lenh nay xoa du lieu cu trong cac collection Users, Photos, SchemaInfos va nap lai du lieu mau tu `modelData/models.js`.

## 4. Chay backend
```bash
npm start
```

Backend mac dinh chay tai `http://localhost:8081`.

## 5. API theo yeu cau Lab 2
- `GET /user/list`
- `GET /user/:id`
- `GET /photosOfUser/:id`

Frontend React goi API thong qua `src/lib/fetchModelData.js`.
