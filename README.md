# Akıllı Kampüs Uygulaması

Üniversite öğrencileri için kapsamlı mobil kampüs uygulaması.

## 🚀 Özellikler

- **Ders Programları**: Kişisel ders programı görüntüleme ve bildirimler
- **Duyurular**: Kategori bazında filtrelenebilir duyurular
- **Etkinlikler**: Kampüs etkinlikleri ve hatırlatmalar
- **Ulaşım Bilgileri**: Ring sefer saatleri ve toplu taşıma
- **Yemek Listesi**: Günlük/haftalık yemekhane menüsü
- **Kampüs Haritası**: İnteraktif harita ve lokasyon işaretleri
- **Teknik Destek**: Sorun bildirimi ve takip sistemi
- **Not Paylaşımı**: Öğrenciler arası kaynak paylaşımı
- **Push Bildirimler**: Anlık bildirimler
- **AI Chatbot**: Sıkça sorulan soruları yanıtlayan akıllı asistan

## 🛠 Teknoloji Yığını

### Backend
- Node.js + Express.js
- PostgreSQL veritabanı
- JWT Authentication
- Firebase Admin SDK (Push Notifications)
- Multer (Dosya yükleme)

### Mobile App
- React Native
- React Navigation
- Redux Toolkit (State Management)
- React Native Push Notification
- React Native Maps

### Chatbot
- Dialogflow ES
- Webhook entegrasyonu

## 📁 Proje Yapısı

```
akilli-kampus/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── redux/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── app.json
├── chatbot/
│   ├── dialogflow/
│   └── webhook/
└── docs/
    ├── api/
    ├── database/
    └── deployment/
```

## 🚀 Kurulum

### Backend Kurulumu
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

### Mobile App Kurulumu
```bash
cd mobile
npm install
# iOS için
cd ios && pod install && cd ..
npx react-native run-ios

# Android için
npx react-native run-android
```

## 📋 Özellik Listesi

- [x] Proje yapısı oluşturuldu
- [ ] Backend API geliştirme
- [ ] Veritabanı şeması tasarımı
- [ ] Mobile app geliştirme
- [ ] Chatbot entegrasyonu
- [ ] Push notification sistemi
- [ ] Test ve deployment

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
