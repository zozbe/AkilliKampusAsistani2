const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const { menuAPI, transportAPI, scheduleAPI } = require('../../backend/src/services/api');

const app = express();
app.use(express.json());

/**
 * Dialogflow Webhook Handler
 */
app.post('/webhook', async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  // Intent handlers
  const intentMap = new Map();
  intentMap.set('menu.today', handleTodayMenu);
  intentMap.set('menu.tomorrow', handleTomorrowMenu);
  intentMap.set('transport.ring', handleRingSchedule);
  intentMap.set('transport.general', handleTransportInfo);
  intentMap.set('schedule.today', handleTodaySchedule);
  intentMap.set('library.hours', handleLibraryHours);
  intentMap.set('contact.info', handleContactInfo);
  intentMap.set('campus.info', handleCampusInfo);
  intentMap.set('help.general', handleGeneralHelp);

  agent.handleRequest(intentMap);
});

/**
 * Bugünün menüsünü getir
 */
async function handleTodayMenu(agent) {
  try {
    // Bu gerçek implementasyonda backend API'sinden menü verisi çekilecek
    const menuData = {
      lunch: {
        items: ['Mercimek Çorbası', 'Tavuk Sote', 'Pilav', 'Salata', 'Ayran'],
        available: true
      },
      dinner: {
        items: ['Domates Çorbası', 'Et Güveç', 'Bulgur Pilavı', 'Cacık', 'Meyveli Yoğurt'],
        available: true
      }
    };

    let response = '🍽️ **Bugünün Menüsü**\n\n';
    
    if (menuData.lunch.available) {
      response += '**Öğle Yemeği:**\n';
      menuData.lunch.items.forEach(item => {
        response += `• ${item}\n`;
      });
      response += '\n';
    }
    
    if (menuData.dinner.available) {
      response += '**Akşam Yemeği:**\n';
      menuData.dinner.items.forEach(item => {
        response += `• ${item}\n`;
      });
    }

    response += '\n\nAfiyet olsun! 😊';
    agent.add(response);
  } catch (error) {
    agent.add('Menü bilgilerini alırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
  }
}

/**
 * Yarının menüsünü getir
 */
async function handleTomorrowMenu(agent) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    agent.add('Yarının menüsü henüz hazırlanmadı. Genellikle menüler bir gün önceden açıklanır. Lütfen yarın tekrar kontrol edin! 📅');
  } catch (error) {
    agent.add('Menü bilgilerini alırken bir hata oluştu.');
  }
}

/**
 * Ring sefer saatlerini getir
 */
async function handleRingSchedule(agent) {
  try {
    const scheduleData = {
      weekdays: [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00'
      ]
    };

    let response = '🚌 **Kampüs Ring Sefer Saatleri**\n\n';
    response += '**Hafta İçi Sefer Saatleri:**\n';
    
    scheduleData.weekdays.forEach((time, index) => {
      if (index % 3 === 0) response += '\n';
      response += `${time}  `;
    });

    response += '\n\n**Not:** Hafta sonu seferler sınırlıdır. Detaylı bilgi için ulaşım ofisini arayabilirsiniz: (0212) 123-4567';
    
    agent.add(response);
  } catch (error) {
    agent.add('Ring sefer saatlerini alırken bir hata oluştu.');
  }
}

/**
 * Genel ulaşım bilgileri
 */
async function handleTransportInfo(agent) {
  const response = `🚌 **Kampüs Ulaşım Bilgileri**

**Ring Servisi:**
• Kampüs içi ücretsiz ulaşım
• 08:00 - 18:00 arası düzenli sefer
• Hafta sonları sınırlı sefer

**Toplu Taşıma:**
• Metro: Çapa - Vezneciler hattı
• Otobüs: 28, 87T, 55T
• Dolmuş: Eminönü - Çapa hattı

**Özel Araç:**
• Kampüs içi park alanları mevcut
• Ücretli park sistemi
• Öğrenci indirimli park ücreti

Detaylı bilgi için: ulaşım@universite.edu.tr`;

  agent.add(response);
}

/**
 * Bugünün ders programı
 */
async function handleTodaySchedule(agent) {
  // Bu gerçek implementasyonda kullanıcının kimliği ile kişisel program çekilecek
  agent.add('Ders programınızı görmek için lütfen uygulamaya giriş yapın ve "Ders Programım" bölümünü ziyaret edin. 📚');
}

/**
 * Kütüphane saatleri
 */
async function handleLibraryHours(agent) {
  const response = `📚 **Kütüphane Çalışma Saatleri**

**Merkez Kütüphane:**
• Pazartesi - Cuma: 08:00 - 22:00
• Cumartesi: 09:00 - 18:00
• Pazar: 10:00 - 18:00

**Fakülte Kütüphaneleri:**
• Pazartesi - Cuma: 08:00 - 20:00
• Hafta sonu: Kapalı

**24 Saat Çalışma Salonu:**
• Sürekli açık (sınav dönemlerinde)
• Öğrenci kartı ile giriş

**Rezervasyon:**
• Online rezervasyon: kutuphane.universite.edu.tr
• Telefon: (0212) 123-4578`;

  agent.add(response);
}

/**
 * İletişim bilgileri
 */
async function handleContactInfo(agent) {
  const response = `📞 **İletişim Bilgileri**

**Genel Bilgi:**
• Telefon: (0212) 123-4567
• E-posta: bilgi@universite.edu.tr
• Adres: Üniversite Cad. No:1, İstanbul

**Öğrenci İşleri:**
• Telefon: (0212) 123-4568
• E-posta: ogrenci@universite.edu.tr

**Teknik Destek:**
• Telefon: (0212) 123-4569
• E-posta: teknik@universite.edu.tr

**Acil Durum:**
• Güvenlik: (0212) 123-4570
• Sağlık: (0212) 123-4571

**Sosyal Medya:**
• Instagram: @universitesi
• Twitter: @uni_resmi
• Facebook: /universitesi`;

  agent.add(response);
}

/**
 * Kampüs genel bilgileri
 */
async function handleCampusInfo(agent) {
  const response = `🏫 **Kampüs Bilgileri**

**Fakülteler:**
• Mühendislik Fakültesi
• İktisadi ve İdari Bilimler Fakültesi
• Fen-Edebiyat Fakültesi
• Güzel Sanatlar Fakültesi

**Sosyal Tesisler:**
• Öğrenci Merkezi
• Spor Kompleksi
• Konferans Salonu
• Kafeterya ve Restoranlar

**Hizmetler:**
• Sağlık Merkezi
• Bankacılık Hizmetleri
• Kırtasiye ve Fotokopi
• Kitap ve Kıyafet Mağazaları

**Etkinlik Alanları:**
• Açık Hava Tiyatrosu
• Basketbol ve Tenis Kortları
• Yürüyüş Parkurları
• Piknik Alanları`;

  agent.add(response);
}

/**
 * Genel yardım
 */
async function handleGeneralHelp(agent) {
  const response = `🤖 **Nasıl Yardımcı Olabilirim?**

**Sık Sorulan Sorular:**
• "Bugün ne yemek var?" - Günlük menüyü öğrenin
• "Ring saatleri nedir?" - Sefer saatlerini görün
• "Kütüphane kaçta açık?" - Çalışma saatlerini öğrenin
• "İletişim bilgileri" - Telefon ve e-posta adresleri

**Diğer Konular:**
• Kampüs haritası ve yönlendirme
• Etkinlik ve duyuru bilgileri
• Öğrenci hizmetleri
• Teknik destek

Size nasıl yardımcı olabilirim? Soru sormaktan çekinmeyin! 😊`;

  agent.add(response);
}

const PORT = process.env.WEBHOOK_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Dialogflow Webhook server running on port ${PORT}`);
});

module.exports = app; 