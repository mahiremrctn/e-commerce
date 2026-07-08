# E-Ticaret Urun Sergileme ve Katalog Yonetim Sistemi

Node.js, Express ve MongoDB ile gelistirilmis bir e-ticaret katalog API'sidir. Musteriler urunleri ve kategorileri giris yapmadan listeleyebilir. Admin kullanicilar JWT ile giris yaparak kategori ve urun yonetimi yapabilir.

## Teknolojiler

- Node.js
- Express 5
- MongoDB ve Mongoose
- JWT access token ve refresh token
- bcryptjs ile sifre hashleme
- express-validator
- Helmet, CORS, rate limiting
- Swagger dokumantasyonu

## Kurulum

1. Bagimliliklari yukleyin:

```bash
npm install
```

2. `.env.example` dosyasini `.env` olarak kopyalayip kendi degerlerinizle doldurun.

3. Gelistirme modunda calistirin:

```bash
npm run dev
```

4. API dokumantasyonunu acin:

```text
http://localhost:5000/api-docs
```

## Ortam Degiskenleri

```env
PORT=5000
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/e-commerce
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

Iyzico odeme denemeleri icin ayrica `IYZICO_API_KEY`, `IYZICO_SECRET_KEY` ve `IYZICO_BASE_URL` kullanilabilir.

## Ilk Admin Kaydi

Kurulumda ilk admin kullaniciyi olusturmak icin `/api/auth/register` endpoint'ine `role: "admin"` gonderilebilir. Veritabaninda admin olustuktan sonra ayni endpoint yeni admin uretmez; sonraki kayitlar `user` rolune duser. Bu tercih, admin kaydini sistem kurulumuna ozel ve kontrollu tutmak icindir.

Ornek:

```json
{
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

## Auth Akisi

- `POST /api/auth/register`: Kullanici kaydi. Ilk admin bu endpoint ile olusturulabilir.
- `POST /api/auth/login`: Email ve sifre ile giris yapar, access token ve refresh token dondurur.
- `POST /api/auth/refresh-token`: Gecerli refresh token ile yeni token cifti uretir.
- `POST /api/auth/logout`: Refresh tokeni veritabanindan silerek cikis yapar.

Admin endpoint'lerinde `Authorization: Bearer <accessToken>` header'i gereklidir.

## Public Endpointler

- `GET /api/products`: Urunleri sayfalama, kategori, fiyat ve siralama filtreleriyle listeler.
- `GET /api/products/:productId`: Tek urun detayini getirir.
- `GET /api/products/by-categories?categories=Posterler,Peyzaj`: Kategori adlarina gore urun listeler.
- `GET /api/categories`: Kategorileri listeler.
- `POST /api/cart/whatsapp`: Sepetteki urunler icin WhatsApp siparis linki olusturur.

## Admin Endpointleri

- `POST /api/products`: Yeni urun ekler.
- `PUT /api/products/:productId`: Urun gunceller.
- `DELETE /api/products/:productId`: Urun siler.
- `POST /api/categories`: Yeni kategori ekler.
- `PUT /api/categories/:id`: Kategori gunceller.
- `DELETE /api/categories/:id`: Kategori siler.
- `GET /api/users`, `POST /api/users`, `PUT /api/users`, `DELETE /api/users/:userId`: Admin korumali kullanici yonetimi.

## Guvenlik ve Hata Yonetimi

- Helmet temel HTTP guvenlik header'larini ekler.
- CORS sadece izin verilen React origin'lerine aciktir.
- Urun endpoint'lerinde rate limiting uygulanir.
- Sifreler bcryptjs ile hashlenir.
- Access token ile rol tabanli yetkilendirme yapilir.
- Refresh tokenler MongoDB'de saklanir ve logout/refresh sirasinda iptal edilir.
- Global error handler ve dosya tabanli request/error loglama bulunur.

## Urun Modeli

Urunler asagidaki ana alanlardan olusur:

- `name`: Urun adi
- `description`: Urun aciklamasi
- `price`: Urun fiyati
- `oldPrice`: Indirim oncesi eski fiyat
- `discountPrice`: Kampanyali satis fiyati
- `image`: Urun gorsel URL'si
- `category`: MongoDB ObjectId ile kategori referansi

Listeleme endpoint'lerinde kategori bilgisi `populate` ile urun cevabina eklenir.

## Indirim Sistemi

Urunlerde `oldPrice` ve `discountPrice` alanlari opsiyoneldir. Indirimli urunlerde frontend `oldPrice` alanini ustu cizili eski fiyat olarak, `discountPrice` alanini kampanyali fiyat olarak gosterebilir. `discountPrice` gonderildiginde `oldPrice` da gonderilmeli ve indirimli fiyat eski fiyattan dusuk olmalidir.

WhatsApp sepet entegrasyonu indirimli urunlerde toplam tutari `discountPrice` uzerinden hesaplar. Indirim yoksa normal `price` alani kullanilir.

## WhatsApp Sepet Entegrasyonu

React tarafinda sepet tutulur, backend'e sadece urun id ve adet bilgisi gonderilir. Backend urun fiyatlarini MongoDB'den tekrar okuyarak toplam tutari hesaplar ve URL encoded WhatsApp linki uretir. Boylece fiyat bilgisi frontend'den manipule edilse bile siparis mesaji veritabanindaki guncel fiyatlarla hazirlanir.

Ornek istek:

```json
{
  "items": [
    {
      "productId": "64f1b2c3d4e5f67890123456",
      "quantity": 2
    },
    {
      "productId": "64f1b2c3d4e5f67890123457",
      "quantity": 1
    }
  ],
  "customerName": "Ayse Yilmaz",
  "note": "Mumkunse hafta sonu teslim almak istiyorum."
}
```

Ornek cevap:

```json
{
  "success": true,
  "data": {
    "items": [],
    "totalPrice": 1500,
    "message": "Merhaba...",
    "encodedMessage": "Merhaba%2C...",
    "whatsappUrl": "https://wa.me/905551112233?text=Merhaba%2C..."
  }
}
```

## Kontrol

Kod kalitesi kontrolu icin:

```bash
npx eslint .
```
