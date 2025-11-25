# GMod Loading Screen

Bu proje, Garry's Mod sunucuları için modern ve özelleştirilebilir bir yükleme ekranı sağlar.

## Özellikler

- **Dinamik Arka Plan:** Yapılandırılabilir bir resim listesiyle slayt gösterisi.
- **Sunucu Bilgileri:** Sunucu adını, oyun modunu ve haritayı otomatik olarak gösterir.
- **Gerçek Zamanlı İlerleme:** Garry's Mod tarafından sağlanan dosya indirme durumunu ve ilerlemesini gösterir.
- **Sahte İlerleme:** GMod verisi mevcut olmadığında (örneğin tarayıcıda doğrudan açıldığında) ilerlemeyi simüle eder.
- **Müzik Çalar:** Arka plan müziği, ses ayarı ve duraklatma/oynatma kontrolü.
- **Özelleştirilebilir İpuçları:** Belirlediğiniz aralıklarla değişen ipuçları gösterir.
- **Kolay Yapılandırma:** Tüm ayarlar `assets/js/config.js` dosyası üzerinden kolayca değiştirilebilir.
- **Modern Tasarım:** Duyarlı ve şık bir görünüm için CSS Flexbox ve değişkenler kullanılmıştır.
- **Tema Değiştirme (Koyu/Açık):** Arayüzdeki butonla CSS değişkenleri üzerinden anında geçiş.
- **URL Parametre Fallback:** GMod JS fonksiyonlarını çağırmazsa `?map=de_dust2&gamemode=sandbox&hostname=Sunucu` gibi parametreler okunur.
- **Arka Plan ve Müzik Ön Yükleme:** İlk görsel `preload`, domain'lere `preconnect` ile daha hızlı başlangıç.

## Kurulum ve Kullanım

### 1. GitHub Pages'e Yükleme

1. Bu projeyi bir GitHub deposuna yükleyin.
2. Deponuzun **Settings** > **Pages** bölümüne gidin.
3. **Source** olarak `main` (veya `master`) branch'inizi seçin ve **Save**'e tıklayın.
4. GitHub size `https://<kullaniciadiniz>.github.io/<depoadiniz>/` gibi bir URL verecektir. Bu URL'yi kopyalayın.

### 2. Garry's Mod Sunucusuna Ekleme

1. Sunucunuzun `server.cfg` veya `autoexec.cfg` dosyasına aşağıdaki satırı ekleyin:

   ```
   sv_loadingurl "https://<kullaniciadiniz>.github.io/<depoadiniz>/?steamid=%s&map=%m"
   ```

   - `<kullaniciadiniz>` ve `<depoadiniz>` kısımlarını kendi bilgilerinizle değiştirin.
   - `?steamid=%s&map=%m` eklemek, oyuncu bilgilerinin yükleme ekranına iletilmesini sağlar.

2. Sunucuyu yeniden başlatın. Artık oyuncular sunucuya katılırken bu yükleme ekranını görecekler.

## Özelleştirme

Tüm özelleştirmeler `assets/js/config.js` dosyası üzerinden yapılır:

- `serverName`: GMod'dan veri gelmediğinde gösterilecek varsayılan sunucu adı.
- `backgrounds`: Arka plan resimlerinin URL'lerini içeren bir dizi.
- `backgroundInterval`: Resimlerin değişme hızı (milisaniye).
- `music`: Arka plan müziği dosyasının URL'si.
- `defaultVolume`: Varsayılan müzik sesi (0.0 - 1.0).
- `tips`: Gösterilecek ipuçlarını içeren bir dizi.
- `tipInterval`: İpuçlarının değişme hızı (milisaniye).
- `fakeLoadingTime`: Sahte ilerleme barının dolma süresi (saniye).

Tasarımı değiştirmek için `assets/css/style.css` dosyasını düzenleyebilirsiniz. Renkler, yazı tipleri ve diğer görsel öğeler CSS değişkenleri kullanılarak kolayca ayarlanabilir.

### Tema Değiştirme
Footer bölümündeki "Tema: Koyu" butonu ile açık temaya geçiş yapılır. Açık tema için `body.light` sınıfı altında değişken override'ları kullanılır.

### URL Parametreleri
Garry's Mod `%m` ve `%s` yerleştirmelerinin yanında manuel test için tarayıcıda aşağıdaki örnekle açabilirsiniz:

```
index.html?map=gm_construct&gamemode=sandbox&hostname=Test%20Sunucu
```

### Performans İyileştirmeleri
- İlk büyük arka plan görseli `link rel="preload"` ile önden getiriliyor.
- Harici hostlara `preconnect` kullanıldı.
- Progress bar güncellemeleri easing + `requestAnimationFrame` ile daha akıcı.

## Önerilen Gelişmiş Eklemeler (İleride)
## Yerel Medya Kullanımı

Arka plan görsellerinizi `assets/media/backgrounds/` dizinine koyun (örnek: `bg-01.webp`, `bg-02.webp`, `bg-03.jpg`). Müzik dosyasını `assets/media/music/ambient-loop.ogg` olarak ekleyin ve `config.js` dizilerini buna göre güncelleyin.

Önerilen formatlar:
- Görseller: WebP (tercihen), gerekirse JPEG (kalite 72–80). PNG sadece şeffaflık gereken durumlarda.
- Müzik: OGG Vorbis (q4–q5). MP3 fallback isterseniz fazladan bir giriş ekleyebilirsiniz.

`index.html` içinde ilk görsel ve müzik için preload zaten eklenmiştir; dosya isimlerini değiştirirseniz burada da güncelleyin.

- Oyuncu listesi (harici bir API gerektirir; GitHub Pages tek başına sunucu query yapamaz).
- Çok dillilik: `language` parametresine göre ipuçları seti seçmek.
- WebP veya AVIF formatında optimize edilmiş yerel arka plan görselleri.
- Müzik için `canplaythrough` event'i dinleyip preload göstergesi.
- LocalStorage ile tema ve ses ayarlarının kalıcı hale getirilmesi.
