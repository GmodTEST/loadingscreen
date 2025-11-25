const CONFIG = {
    // Genel Ayarlar
    serverName: "Orpheus Test Sunucusu",
    serverIP: "51.89.178.178:27022",

    // Arka Plan Slaytları (Yerel)
    // Buradaki placeholder dosyaları kendi görüntülerinizle değiştirin.
    // Önerilen dizin: assets/media/backgrounds/
    backgrounds: [
        'assets/media/backgrounds/1.jpg',
        'assets/media/backgrounds/2.jpg',
        'assets/media/backgrounds/3.jpg'
    ],
    backgroundInterval: 5000, // ms

    // Müzik Ayarları (Yerel)
    // OGG tercih edilir; MP3 fallback gerekirse ekleyebilirsiniz.
    music: 'assets/media/music/loading.ogg',
    defaultVolume: 0.5,

    // İpuçları
    tips: [
        "Yeniden doğmak için F1'e basın.",
        "Kuralları okumak için !kurallar yazın.",
        "Yardım için admin çağırabilirsiniz.",
        "İyi oyunlar dileriz!",
        "31 çekmeyi ihmal etmeyin.",
        
    ],
    tipInterval: 4000,

    // Sahte İlerleme Barı
    fakeLoadingTime: 20,
};
