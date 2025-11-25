document.addEventListener('DOMContentLoaded', () => {
    // DOM elementlerini seç
    const serverNameElem = document.getElementById('server-name');
    const gamemodeElem = document.getElementById('gamemode');
    const mapNameElem = document.getElementById('map-name');
    const statusElem = document.getElementById('status');
    const downloadFileElem = document.getElementById('download-file');
    const progressBarInner = document.getElementById('progress-bar-inner');
    const tipElem = document.getElementById('tip');
    const backgroundSlider = document.getElementById('background-slider');
    const toggleMusicBtn = document.getElementById('toggle-music');
    const volumeSlider = document.getElementById('volume-slider');

    let gmodDataReceived = false;
    let currentBackground = 0;
    let currentTip = 0;
    let musicAudio;
    let currentProgress = 0;
    let targetProgress = 0;
    let progressAnimating = false;

    // --- Başlangıç Fonksiyonları ---

    function initialize() {
        // Sunucu adını config'den al (GMod verisi gelene kadar)
        serverNameElem.textContent = CONFIG.serverName;

        // Arka plan slaytlarını başlat
        setupBackgroundSlider();

        // İpuçlarını başlat
        setupTips();

        // Müzik çaları ayarla
        setupMusicPlayer();

        // Tema toggle
        setupThemeToggle();

        // URL parametre fallback'i (GMod fonksiyonları gelmezse)
        parseQueryFallback();

        // GMod'dan veri gelmezse sahte ilerleme barını başlat
        setTimeout(() => {
            if (!gmodDataReceived) {
                startFakeLoading();
            }
        }, 1000);
    }

    // --- GMOD Arayüz Fonksiyonları ---

    // Oyun detayları geldiğinde çağrılır
    window.GameDetails = function(servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language) {
        gmodDataReceived = true;
        serverNameElem.textContent = servername;
        gamemodeElem.textContent = gamemode;
        mapNameElem.textContent = mapname;

        // Oyuncunun ses ayarını uygula
        if (musicAudio) {
            musicAudio.volume = volume;
            volumeSlider.value = volume;
        }
    };

    // İndirme durumu değiştiğinde çağrılır
    window.SetStatusChanged = function(status) {
        gmodDataReceived = true;
        statusElem.textContent = status;
    };

    // İndirilecek toplam dosya sayısı
    let totalFiles = 0;
    window.SetFilesTotal = function(total) {
        gmodDataReceived = true;
        totalFiles = total;
    };

    // Kalan dosya sayısı
    let neededFiles = 0;
    window.SetFilesNeeded = function(needed) {
        gmodDataReceived = true;
        neededFiles = needed;
        if (totalFiles > 0) {
            const percentage = ((totalFiles - neededFiles) / totalFiles) * 100;
            updateProgressBar(percentage);
        }
    };

    // Bir dosya indirilmeye başlandığında
    window.DownloadingFile = function(fileName) {
        gmodDataReceived = true;
        downloadFileElem.textContent = `İndiriliyor: ${fileName}`;
    };

    // --- Arayüz Güncelleme Fonksiyonları ---

    function updateProgressBar(percentage) {
        // Yeni hedefi ayarla ve animasyonu başlat
        targetProgress = Math.min(100, Math.max(0, percentage));
        if (!progressAnimating) {
            progressAnimating = true;
            animateProgress();
        }
    }

    // URL parametrelerini oku ve GMod çağrısı gelmezse bazı alanları doldur
    function parseQueryFallback() {
        const params = new URLSearchParams(window.location.search);
        const map = params.get('map') || params.get('Map');
        const gm = params.get('gamemode') || params.get('mode') || params.get('Gamemode');
        const host = params.get('hostname') || params.get('host');
        if (!gmodDataReceived) {
            if (map) mapNameElem.textContent = map;
            if (gm) gamemodeElem.textContent = gm;
            if (host) serverNameElem.textContent = host;
        }
    }

    function animateProgress() {
        const diff = targetProgress - currentProgress;
        if (Math.abs(diff) < 0.1) {
            currentProgress = targetProgress;
            progressBarInner.style.width = `${currentProgress}%`;
            progressAnimating = false;
            return;
        }
        // Ease: her adımda kalan mesafenin %20'si
        currentProgress += diff * 0.2;
        progressBarInner.style.width = `${currentProgress}%`;
        requestAnimationFrame(animateProgress);
    }

    function startFakeLoading() {
        let fakeProgress = 0;
        const interval = (CONFIG.fakeLoadingTime * 1000) / 100;
        const loadingInterval = setInterval(() => {
            if (gmodDataReceived) {
                clearInterval(loadingInterval);
                return;
            }
            fakeProgress++;
            updateProgressBar(fakeProgress);
            statusElem.textContent = `Sunucuya bağlanılıyor... (${fakeProgress}%)`;
            if (fakeProgress >= 100) {
                clearInterval(loadingInterval);
                statusElem.textContent = "Neredeyse tamamlandı!";
            }
        }, interval);
    }

    // --- Arka Plan Slaytları ---

    function setupBackgroundSlider() {
        if (CONFIG.backgrounds.length === 0) return;
        // Her arka plan için bir slayt div'i oluştur
        CONFIG.backgrounds.forEach((url, i) => {
            const slide = document.createElement('div');
            slide.className = 'bg-slide' + (i === 0 ? ' active' : '');
            slide.style.backgroundImage = `url('${url}')`;
            backgroundSlider.appendChild(slide);
        });
        // Arka planları bellek ön yükleme (görsel geçişinde gecikmeyi azaltır)
        preloadBackgrounds();
        if (CONFIG.backgrounds.length > 1) {
            setInterval(changeBackground, CONFIG.backgroundInterval);
        }
    }

    function changeBackground() {
        const slides = backgroundSlider.querySelectorAll('.bg-slide');
        slides[currentBackground].classList.remove('active');
        currentBackground = (currentBackground + 1) % slides.length;
        slides[currentBackground].classList.add('active');
    }

    function preloadBackgrounds() {
        CONFIG.backgrounds.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // --- İpuçları ---

    function setupTips() {
        if (CONFIG.tips.length === 0) return;
        tipElem.textContent = CONFIG.tips[0];
        if (CONFIG.tips.length > 1) {
            setInterval(changeTip, CONFIG.tipInterval);
        }
    }

    function changeTip() {
        tipElem.classList.remove('fade-in');
        tipElem.classList.add('fade-out');
        setTimeout(() => {
            currentTip = (currentTip + 1) % CONFIG.tips.length;
            tipElem.textContent = CONFIG.tips[currentTip];
            tipElem.classList.remove('fade-out');
            tipElem.classList.add('fade-in');
        }, 300);
    }

    // --- Müzik Çalar ---

    function setupMusicPlayer() {
        if (!CONFIG.music) return;
        musicAudio = new Audio(CONFIG.music);
        musicAudio.volume = CONFIG.defaultVolume;
        volumeSlider.value = CONFIG.defaultVolume;
        musicAudio.loop = true;

        // Tarayıcıların otomatik oynatma kısıtlaması için,
        // kullanıcı etkileşimiyle başlatmayı deneriz.
        document.body.addEventListener('click', playMusicOnce, { once: true });

        toggleMusicBtn.addEventListener('click', () => {
            if (musicAudio.paused) {
                musicAudio.play();
                toggleMusicBtn.textContent = "Müziği Durdur";
            } else {
                musicAudio.pause();
                toggleMusicBtn.textContent = "Müziği Başlat";
            }
        });

        volumeSlider.addEventListener('input', (e) => {
            musicAudio.volume = e.target.value;
        });
    }
    
    function playMusicOnce() {
        if (musicAudio && musicAudio.paused) {
            musicAudio.play().catch(e => console.error("Müzik otomatik başlatılamadı:", e));
        }
    }

    // Tema toggle kurulum
    function setupThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const light = document.body.classList.toggle('light');
            btn.textContent = light ? 'Tema: Açık' : 'Tema: Koyu';
        });
    }

    // Başlat
    initialize();
});
