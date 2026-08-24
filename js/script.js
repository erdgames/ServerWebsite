// ============================================
// NoName SMP – Minecraft Server Website
// ============================================

const SERVER_IP = "mc.hexcat.at";
const BEDROCK_IP = "mcb.hexcat.at";

// ============================================
// Konfiguration
// ============================================

// Karten-URL – hier später die echte Karten-URL eintragen, z.B.:
// "http://mc.hexcat.at:8123/" (Dynmap)
// "http://mc.hexcat.at:8100/" (BlueMap)
// "http://mc.hexcat.at:8080/" (Pl3xMap/Squaremap)
const MAP_URL = ""; // Leer = Karte bleibt versteckt

// Intervall für Karten-Refresh (10 Minuten)
const MAP_REFRESH_INTERVAL = 10 * 60 * 1000;

// Intervall für Server-Status-Refresh (30 Sekunden)
const STATUS_REFRESH_INTERVAL = 30 * 1000;

// ============================================
// Toast-Funktion
// ============================================

let toastTimeout;

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// ============================================
// IP kopieren
// ============================================

async function copyIp() {
    try {
        // Neuere API bevorzugt, Fallback auf execCommand
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(SERVER_IP);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = SERVER_IP;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
        showToast("✓ Serveradresse wurde kopiert!");
    } catch (err) {
        console.error("Kopieren fehlgeschlagen:", err);
        showToast(`Konnte nicht kopiert werden – Adresse: ${SERVER_IP}`);
    }
}

async function copyBedrockIp() {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(BEDROCK_IP);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = BEDROCK_IP;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
        showToast("✓ Bedrock-Adresse wurde kopiert!");
    } catch (err) {
        console.error("Kopieren fehlgeschlagen:", err);
        showToast(`Konnte nicht kopiert werden – Adresse: ${BEDROCK_IP}`);
    }
}

// Machen copyIp global verfügbar (für onclick-Attribute)
window.copyIp = copyIp;
window.copyBedrockIp = copyBedrockIp;

// ============================================
// Mobile Navigation (Hamburger-Menü)
// ============================================

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        hamburger.classList.toggle("open", isOpen);
        hamburger.setAttribute("aria-expanded", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Menü schließen, wenn ein Link geklickt wird
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            hamburger.classList.remove("open");
            document.body.style.overflow = "";
        });
    });

    // Menü schließen bei Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            navLinks.classList.remove("open");
            hamburger.classList.remove("open");
            document.body.style.overflow = "";
        }
    });
}

// ============================================
// Navbar – Hintergrund & aktive Links beim Scrollen
// ============================================

const navbar = document.getElementById("navbar");
const sections = document.querySelectorAll("section[id], header[id]");
const navLinkElements = document.querySelectorAll(".nav-link");

function updateNavbar() {
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
}

function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
            const id = section.getAttribute("id");
            navLinkElements.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${id}`;
                link.classList.toggle("active", isActive);
            });
        }
    });
}

window.addEventListener("scroll", () => {
    updateNavbar();
    updateActiveLink();
});

// ============================================
// Server-Status, Ping & Spielerzahl prüfen
// ============================================

const statusEl = document.getElementById("server-status");
const statusDot = document.querySelector(".status-dot");
const playerCountEl = document.getElementById("stat-players");
const pingBadgeEl = document.getElementById("ping-badge");
const joinStatusDot = document.getElementById("join-status-dot");

// Elemente der Online-Sektion
const onlineStatusDot = document.getElementById("online-status-dot");
const onlineCountText = document.getElementById("online-count-text");
const onlineNumber = document.getElementById("online-number");
const lastUpdatedEl = document.getElementById("last-updated");

function setServerStatus(state, text) {
    if (statusEl) {
        statusEl.textContent = text;
    }
    [statusDot, joinStatusDot].forEach((dot) => {
        if (!dot) return;
        dot.classList.remove("online", "offline");
        if (state === "online") {
            dot.classList.add("online");
        } else if (state === "offline") {
            dot.classList.add("offline");
        }
    });

    // IP-Adressen (Java & Bedrock) farblich an den Serverstatus anpassen
    document.querySelectorAll(".ip-text").forEach((ip) => {
        ip.classList.remove("online", "offline");
        if (state === "online") {
            ip.classList.add("online");
        } else if (state === "offline") {
            ip.classList.add("offline");
        }
    });
}

function setPing(ping) {
    if (!pingBadgeEl) return;

    if (typeof ping === "number" && ping > 0) {
        pingBadgeEl.textContent = `${ping}ms`;
        pingBadgeEl.classList.remove("hidden", "high", "critical");

        // Ping-Kategorien
        if (ping > 200) {
            pingBadgeEl.classList.add("critical");
        } else if (ping > 100) {
            pingBadgeEl.classList.add("high");
        }
    } else {
        pingBadgeEl.classList.add("hidden");
    }
}

function updateLastUpdated() {
    if (!lastUpdatedEl) return;
    const now = new Date();
    const time = now.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    lastUpdatedEl.textContent = `Zuletzt aktualisiert um ${time}`;
}

function renderOnlineSection(playerCount, isOnline) {
    if (!onlineNumber || !onlineCountText) return;

    // Anzahl der Spieler anzeigen
    const count = typeof playerCount === "number" ? playerCount : 0;
    onlineNumber.textContent = count;

    // Punkt & Text an den Serverstatus koppeln (grün = online, rot = offline)
    if (onlineStatusDot) {
        onlineStatusDot.classList.remove("online", "offline");
        if (isOnline) {
            onlineStatusDot.classList.add("online");
        } else {
            onlineStatusDot.classList.add("offline");
        }
    }

    if (isOnline) {
        if (count === 0) {
            onlineCountText.textContent = "Server ist online";
        } else {
            onlineCountText.textContent = count === 1 ? "1 Spieler ist online" : `${count} Spieler sind online`;
        }
    } else {
        onlineCountText.textContent = "Server ist offline";
    }

    updateLastUpdated();
}

let firstStatusCheck = true;

async function checkServerStatus() {
    if (!statusEl) return;

    // Nur beim ersten Check "prüft..." anzeigen, um Flicker bei Refresh zu vermeiden
    if (firstStatusCheck) {
        setServerStatus("checking", "Server wird geprüft...");
        firstStatusCheck = false;
    }

    try {
        // Öffentliche MC-Status-API (kein API-Key nötig)
        // mcstatus.io cached nur 60 Sekunden (mcsrvstat.us cached 5 Minuten)
        // AbortController für Timeout (kompatibel mit allen Browsern)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_IP}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.online) {
            setServerStatus("online", "Server ist online");
            setPing(null);

            if (playerCountEl && typeof data.players?.online === "number") {
                playerCountEl.textContent = data.players.online;
            }

            renderOnlineSection(data.players?.online, true);
        } else {
            setServerStatus("offline", "Server ist offline");
            setPing(null);
            if (playerCountEl) {
                playerCountEl.textContent = "0";
            }
            renderOnlineSection(0, false);
        }
    } catch (err) {
        console.warn("Serverstatus konnte nicht abgerufen werden:", err);
        setServerStatus("offline", "Status nicht verfügbar");
        setPing(null);
        renderOnlineSection(0, false);
    }
}

// Beim Laden prüfen und danach alle 30 Sekunden aktualisieren
checkServerStatus();
setInterval(checkServerStatus, STATUS_REFRESH_INTERVAL);

// ============================================
// Karten-Sektion (versteckt, wird später aktiviert)
// ============================================

const mapSection = document.getElementById("map");
const mapNavLink = document.querySelector(".nav-map");
const mapFrame = document.getElementById("map-frame");
const mapLoading = document.getElementById("map-loading");

function initMap() {
    // Wenn keine Karten-URL konfiguriert ist, bleibt alles versteckt
    if (!MAP_URL || !mapSection || !mapFrame) return;

    // Karten-Sektion und Nav-Link sichtbar machen
    mapSection.classList.remove("hidden");
    if (mapNavLink) {
        mapNavLink.classList.remove("hidden");
    }

    // iframe-URL setzen
    mapFrame.src = MAP_URL;

    // Lade-Overlay ausblenden, sobald die Karte geladen ist
    mapFrame.addEventListener("load", () => {
        if (mapLoading) {
            mapLoading.classList.add("hidden");
        }
    });

    // Karte alle 10 Minuten neu laden (nur wenn sichtbar)
    setInterval(() => {
        if (mapSection && !mapSection.classList.contains("hidden")) {
            if (mapLoading) {
                mapLoading.classList.remove("hidden");
            }
            // iframe neu laden (Cache umgehen)
            mapFrame.src = MAP_URL;
        }
    }, MAP_REFRESH_INTERVAL);
}

initMap();

// ============================================
// Sanftes Scrollen für Anker-Links (Fallback)
// ============================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId.length > 1) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                history.pushState(null, "", targetId);
            }
        }
    });
});

// ============================================
// Einblend-Animation beim Scrollen
// ============================================

// IntersectionObserver für sanfte Einblend-Effekte
const revealElements = document.querySelectorAll(
    ".feature-card, .gamemode-card, .command-card, .gallery-carousel, .join-box, .sword-image, .about-text"
);

if ("IntersectionObserver" in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Leicht versetzte Animation für gestaffelte Effekte
                    setTimeout(() => {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition =
            "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        observer.observe(el);
    });
}

// ============================================
// Bildergalerie (Server-Bilder Karussell)
// ============================================

// Manuelles Array aller Bilder im assets/pictures/ Ordner
// Füge hier einfach deine Bilder hinzu - Format: { file: "assets/pictures/deinbild.png", title: "Dein Titel" }
const GALLERY_IMAGES = [
  { file: "assets/pictures/image.png", title: "Server Bild 1" },
  { file: "assets/pictures/image1.png", title: "Server Bild 2" },
  { file: "assets/pictures/image3.png", title: "Server Bild 3" },
  { file: "assets/pictures/image4.png", title: "Server Bild 4" },
  { file: "assets/pictures/image5.png", title: "Server Bild 5" },
  { file: "assets/pictures/image6.png", title: "Server Bild 6" },
  { file: "assets/pictures/image7.png", title: "Server Bild 7" },
  { file: "assets/pictures/image8.png", title: "Server Bild 8" },
  { file: "assets/pictures/image9.png", title: "Server Bild 9" },
  { file: "assets/pictures/image10.png", title: "Server Bild 10" },
  { file: "assets/pictures/image11.png", title: "Server Bild 11" },
  { file: "assets/pictures/image12.png", title: "Server Bild 12" },
  { file: "assets/pictures/image14.png", title: "Server Bild 13" }
];

// Leere Funktion für Kompatibilität mit bestehendem Code
async function loadGalleryImages() {
  // Bilder sind bereits im GALLERY_IMAGES Array definiert
  return Promise.resolve();
}

const galleryCarousel = document.getElementById("gallery-carousel");
const gallerySlides = document.getElementById("gallery-slides");
const galleryLoading = document.getElementById("gallery-loading");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");
const galleryDots = document.getElementById("gallery-dots");
const galleryHint = document.getElementById("gallery-hint");

let currentSlideIndex = 0;
let galleryInterval = null;

// --- Galerie initialisieren ---
function initGallery() {
  if (!galleryCarousel || !gallerySlides) return;

  // Bilder laden
  loadGalleryImages().then(() => {
    // Lade-Overlay ausblenden
    if (galleryLoading) {
      galleryLoading.classList.add("hidden");
    }

    // Wenn keine Bilder vorhanden sind, Hinweis anzeigen
    if (GALLERY_IMAGES.length === 0) {
      if (galleryHint) {
        galleryHint.style.display = "block";
      }
      return;
    }

    // Slides erstellen
    buildGallerySlides();
    // Dots erstellen
    buildGalleryDots();
    // Event-Listener hinzufügen
    setupGalleryControls();
    // Automatisches Wechseln starten
    startGalleryAutoplay();
    // Ersten Slide anzeigen
    showSlide(0);
  });
}

// --- Slides erstellen ---
function buildGallerySlides() {
  if (!gallerySlides) return;
  gallerySlides.innerHTML = "";

  GALLERY_IMAGES.forEach((image, index) => {
    const slide = document.createElement("div");
    slide.className = "gallery-slide";
    slide.dataset.index = index;

    const img = document.createElement("img");
    img.src = image.file;
    img.alt = image.title || `Server Bild ${index + 1}`;
    img.loading = "lazy";

    slide.appendChild(img);
    gallerySlides.appendChild(slide);
  });
}

// --- Dots erstellen ---
function buildGalleryDots() {
  if (!galleryDots) return;
  galleryDots.innerHTML = "";

  GALLERY_IMAGES.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "gallery-dot";
    dot.dataset.index = index;
    dot.setAttribute("aria-label", `Bild ${index + 1}`);

    dot.addEventListener("click", () => {
      showSlide(index);
      resetGalleryAutoplay();
    });

    galleryDots.appendChild(dot);
  });
}

// --- Controls einrichten ---
function setupGalleryControls() {
  if (galleryPrev) {
    galleryPrev.addEventListener("click", () => {
      prevSlide();
      resetGalleryAutoplay();
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener("click", () => {
      nextSlide();
      resetGalleryAutoplay();
    });
  }

  // Tastatur-Navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      resetGalleryAutoplay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resetGalleryAutoplay();
    }
  });
}

// --- Slide anzeigen ---
function showSlide(index) {
  if (index < 0 || index >= GALLERY_IMAGES.length) return;

  currentSlideIndex = index;

  // Slides aktualisieren
  const slides = gallerySlides?.querySelectorAll(".gallery-slide");
  slides?.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });

  // Dots aktualisieren
  const dots = galleryDots?.querySelectorAll(".gallery-dot");
  dots?.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// --- Nächster / Vorheriger Slide ---
function nextSlide() {
  const nextIndex = (currentSlideIndex + 1) % GALLERY_IMAGES.length;
  showSlide(nextIndex);
}

function prevSlide() {
  const prevIndex = (currentSlideIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  showSlide(prevIndex);
}

// --- Autoplay ---
function startGalleryAutoplay() {
  // Intervall alle 5 Sekunden
  galleryInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function stopGalleryAutoplay() {
  if (galleryInterval) {
    clearInterval(galleryInterval);
    galleryInterval = null;
  }
}

function resetGalleryAutoplay() {
  stopGalleryAutoplay();
  startGalleryAutoplay();
}

// ============================================
// Minecraft Musik (Hintergrundmusik & Playlist)
// ============================================

// Standard-Playlist (Fallback, wenn der Server-Endpoint nicht erreichbar ist,
// z.B. wenn die Website direkt per Doppelklick (file://) geöffnet wird)
const DEFAULT_MUSIC_TRACKS = [
    { file: "audio/01 Calm 1.mp3", title: "Calm 1" },
    { file: "audio/02 Calm 2.mp3", title: "Calm 2" },
    { file: "audio/03 Calm 3.mp3", title: "Calm 3" },
    { file: "audio/04 Piano 1.mp3", title: "Piano 1" },
    { file: "audio/05 Piano 2.mp3", title: "Piano 2" },
    { file: "audio/06 Piano 3.mp3", title: "Piano 3" },
    { file: "audio/07 Boo.mp3", title: "Boo" },
    { file: "audio/08 Hal 1.mp3", title: "Hal 1" },
    { file: "audio/09 Hal 2.mp3", title: "Hal 2" },
    { file: "audio/10 Hal 3.mp3", title: "Hal 3" },
    { file: "audio/11 Hal 4.mp3", title: "Hal 4" },
    { file: "audio/12 Nuance 1.mp3", title: "Nuance 1" },
    { file: "audio/13 Nuance 2.mp3", title: "Nuance 2" },
    { file: "audio/14 13 (Gold LP).mp3", title: "13 (Gold LP)" },
    { file: "audio/15 Cat (Green LP).mp3", title: "Cat (Green LP)" },
    { file: "audio/16 Minecraft Is Acid.mp3", title: "Minecraft Is Acid" },
    { file: "audio/17 Chicken Freestyle.mp3", title: "Chicken Freestyle" },
    { file: "audio/music.mp3", title: "Music" }
];

// Aktive Playlist – wird beim Start vom Server geladen (Fallback: Standard-Playlist)
let MUSIC_TRACKS = [];

// Alle MP3-Dateien vom Server laden.
// Dadurch erscheinen auch neue Songs im audio/-Ordner automatisch im Player,
// ohne dass js/script.js angepasst werden muss.
async function loadMusicTracks() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch("/api/tracks", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            MUSIC_TRACKS = data.filter(
                (track) => track && typeof track.file === "string" && typeof track.title === "string"
            );
            return;
        }
    } catch (err) {
        console.warn("Trackliste konnte nicht vom Server geladen werden – verwende Standard-Playlist:", err);
    }

    MUSIC_TRACKS = DEFAULT_MUSIC_TRACKS.slice();
}

const bgMusic = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");
const musicBtnIcon = document.getElementById("music-btn-icon");
const musicBtnLabel = document.getElementById("music-btn-label");
const musicListBtn = document.getElementById("music-list-btn");
const musicPanel = document.getElementById("music-panel");
const musicPanelClose = document.getElementById("music-panel-close");
const musicPrevBtn = document.getElementById("music-prev-btn");
const musicPlayBtn = document.getElementById("music-play-btn");
const musicNextBtn = document.getElementById("music-next-btn");
const musicTrackTitle = document.getElementById("music-track-title");
const musicPlaylist = document.getElementById("music-playlist");

const MUSIC_STORAGE_KEY = "noname-music";
const MUSIC_TRACK_KEY = "noname-music-track";
const MUSIC_PANEL_KEY = "noname-music-panel";

let currentTrackIndex = 0;

// --- Playlist rendern ---
function buildPlaylist() {
    if (!musicPlaylist) return;
    musicPlaylist.innerHTML = "";

    MUSIC_TRACKS.forEach((track, index) => {
        const li = document.createElement("li");
        li.className = "music-playlist-item";
        li.textContent = track.title;
        li.tabIndex = 0;

        li.addEventListener("click", () => {
            playTrack(index);
            if (bgMusic && !bgMusic.paused && musicBtn) {
                musicBtn.classList.add("playing");
            }
        });
        li.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                li.click();
            }
        });

        musicPlaylist.appendChild(li);
    });
}

// --- Titel abspielen ---
function playTrack(index) {
    if (!bgMusic) return;
    if (index < 0 || index >= MUSIC_TRACKS.length) return;

    currentTrackIndex = index;
    const track = MUSIC_TRACKS[currentTrackIndex];

    bgMusic.src = track.file;
    bgMusic.loop = false;
    bgMusic.play().catch(() => {
        showToast("Musik konnte nicht abgespielt werden");
    });

    if (musicTrackTitle) {
        musicTrackTitle.textContent = track.title;
    }
    if (musicPlayBtn) {
        musicPlayBtn.textContent = "⏸";
    }

    // Aktiven Eintrag in der Playlist markieren
    if (musicPlaylist) {
        musicPlaylist.querySelectorAll(".music-playlist-item").forEach((item, i) => {
            item.classList.toggle("active", i === currentTrackIndex);
        });
    }

    try {
        localStorage.setItem(MUSIC_TRACK_KEY, String(currentTrackIndex));
    } catch (e) {
        // localStorage ignorieren
    }

    updateMusicButton();
}

// --- Nächster / Vorheriger Titel ---
function nextTrack() {
    playTrack((currentTrackIndex + 1) % MUSIC_TRACKS.length);
}

function prevTrack() {
    playTrack((currentTrackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
}

// --- Button-Zustand aktualisieren ---
function updateMusicButton() {
    if (!bgMusic) return;
    const playing = !bgMusic.paused && !bgMusic.ended;

    if (musicBtnIcon) {
        musicBtnIcon.textContent = playing ? "🔊" : "🔇";
    }
    if (musicBtnLabel) {
        musicBtnLabel.textContent = playing ? "Musik aus" : "Musik an";
    }
    if (musicPlayBtn) {
        musicPlayBtn.textContent = playing ? "⏸" : "▶";
    }

    if (musicBtn) {
        musicBtn.classList.toggle("playing", playing);
        musicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    }

    try {
        localStorage.setItem(MUSIC_STORAGE_KEY, playing ? "on" : "off");
    } catch (e) {
        // localStorage ist evtl. deaktiviert – dann einfach ignorieren
    }
}

// --- Playlist-Panel öffnen/schließen ---
function openMusicPanel() {
    if (!musicPanel) return;
    musicPanel.classList.add("open");
    try {
        localStorage.setItem(MUSIC_PANEL_KEY, "open");
    } catch (e) {
        // ignorieren
    }
}

function closeMusicPanel() {
    if (!musicPanel) return;
    musicPanel.classList.remove("open");
    try {
        localStorage.setItem(MUSIC_PANEL_KEY, "closed");
    } catch (e) {
        // ignorieren
    }
}

function toggleMusicPanel() {
    if (musicPanel && musicPanel.classList.contains("open")) {
        closeMusicPanel();
    } else {
        openMusicPanel();
    }
}

// Musik-Panel schließen, wenn woanders auf die Website getippt wird
document.addEventListener("click", (e) => {
    if (!musicPanel || !musicPanel.classList.contains("open")) return;
    if (musicPanel.contains(e.target) ||
        (musicListBtn && musicListBtn.contains(e.target))) {
        return;
    }
    closeMusicPanel();
});

// --- Initialisierung ---
async function initMusic() {
    // Alle MP3-Dateien vom Server laden (Fallback: Standard-Playlist)
    await loadMusicTracks();

    buildPlaylist();

    if (!bgMusic) return;
    bgMusic.volume = 0.5;

    // Haupt-Button: Musik ein-/ausschalten
    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            if (bgMusic.paused) {
                if (!bgMusic.src) {
                    // Noch kein Titel geladen → ersten Titel verwenden
                    playTrack(currentTrackIndex);
                } else {
                    bgMusic.play().catch(() => {
                        showToast("Musik konnte nicht abgespielt werden");
                    });
                }
            } else {
                bgMusic.pause();
            }
        });
    }

    // Playlist-Button & Panel
    if (musicListBtn) {
        musicListBtn.addEventListener("click", toggleMusicPanel);
    }
    if (musicPanelClose) {
        musicPanelClose.addEventListener("click", closeMusicPanel);
    }

    // Controls
    if (musicPrevBtn) {
        musicPrevBtn.addEventListener("click", prevTrack);
    }
    if (musicPlayBtn) {
        musicPlayBtn.addEventListener("click", () => {
            if (bgMusic.paused) {
                if (!bgMusic.src) {
                    playTrack(currentTrackIndex);
                } else {
                    bgMusic.play().catch(() => {
                        showToast("Musik konnte nicht abgespielt werden");
                    });
                }
            } else {
                bgMusic.pause();
            }
        });
    }
    if (musicNextBtn) {
        musicNextBtn.addEventListener("click", nextTrack);
    }

    // Button-Zustand an Play/Pause-Events koppeln
    bgMusic.addEventListener("play", updateMusicButton);
    bgMusic.addEventListener("pause", updateMusicButton);

    // Automatisch zum nächsten Titel springen, wenn einer endet
    bgMusic.addEventListener("ended", () => {
        nextTrack();
    });

    // Gespeicherten Track wiederherstellen
    let savedTrackIndex = 0;
    try {
        const saved = localStorage.getItem(MUSIC_TRACK_KEY);
        if (saved !== null) {
            const parsed = parseInt(saved, 10);
            if (!isNaN(parsed) && parsed >= 0 && parsed < MUSIC_TRACKS.length) {
                savedTrackIndex = parsed;
            }
        }
    } catch (e) {
        // localStorage nicht verfügbar
    }
    currentTrackIndex = savedTrackIndex;

    // Titel in der UI anzeigen
    if (musicTrackTitle) {
        musicTrackTitle.textContent = MUSIC_TRACKS[currentTrackIndex].title;
    }
    if (musicPlaylist) {
        musicPlaylist.querySelectorAll(".music-playlist-item").forEach((item, i) => {
            item.classList.toggle("active", i === currentTrackIndex);
        });
    }

    // Autoplay-Versuch (Browser blockiert das evtl. – dann startet die Musik per Button)
    let savedMusic = null;
    try {
        savedMusic = localStorage.getItem(MUSIC_STORAGE_KEY);
    } catch (e) {
        // localStorage nicht verfügbar
    }

    if (savedMusic !== "off") {
        bgMusic.src = MUSIC_TRACKS[currentTrackIndex].file;
        bgMusic.play().catch(() => {
            // Autoplay blockiert – kein Problem, Button dafür nutzen
        });
    }

    // Panel-Zustand wiederherstellen
    let savedPanel = null;
    try {
        savedPanel = localStorage.getItem(MUSIC_PANEL_KEY);
    } catch (e) {
        // ignorieren
    }

    if (savedPanel === "open") {
        openMusicPanel();
    }

    updateMusicButton();
}

// ============================================
// Minecraft Easter Eggs
// ============================================

const creeperOverlay = document.getElementById("creeper-overlay");
const creeperParticles = document.getElementById("creeper-particles");
const herobrineEl = document.getElementById("herobrine");

// --- Konami-Code → Creeper-Overlay ---
const KONAMI_CODE = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
];
let konamiIndex = 0;

document.addEventListener("keydown", (e) => {
    const key = e.key;
    const expected = KONAMI_CODE[konamiIndex];

    if (key === expected) {
        konamiIndex++;
        if (konamiIndex === KONAMI_CODE.length) {
            konamiIndex = 0;
            triggerCreeper();
        }
    } else {
        konamiIndex = key === KONAMI_CODE[0] ? 1 : 0;
    }
});

function triggerCreeper() {
    if (!creeperOverlay) return;

    creeperOverlay.classList.remove("hidden");

    // Partikel beim Zünden spawnen
    if (creeperParticles) {
        creeperParticles.innerHTML = "";
        for (let i = 0; i < 24; i++) {
            const p = document.createElement("span");
            p.style.cssText = `
                position: absolute;
                width: ${6 + Math.random() * 8}px;
                height: ${6 + Math.random() * 8}px;
                background: #4daf4a;
                border-radius: 2px;
                left: ${20 + Math.random() * 60}%;
                top: ${20 + Math.random() * 60}%;
                --tx: ${(Math.random() - 0.5) * 300}px;
                --ty: ${(Math.random() - 0.5) * 300}px;
                animation: particle-fly ${0.6 + Math.random() * 0.8}s ease-out forwards;
            `;
            creeperParticles.appendChild(p);
        }
    }

    document.body.style.overflow = "hidden";

    setTimeout(() => {
        creeperOverlay.classList.add("hidden");
        document.body.style.overflow = "";
    }, 1800);
}

// Overlay per Klick schließen
if (creeperOverlay) {
    creeperOverlay.addEventListener("click", () => {
        creeperOverlay.classList.add("hidden");
        document.body.style.overflow = "";
    });
}

// --- Herobrine: Logo 5x klicken ---
let logoClicks = 0;
let logoClickTimer = null;

document.querySelectorAll(".logo").forEach((logo) => {
    logo.addEventListener("click", () => {
        logoClicks++;
        clearTimeout(logoClickTimer);
        logoClickTimer = setTimeout(() => { logoClicks = 0; }, 2500);

        if (logoClicks >= 5) {
            logoClicks = 0;
            spawnHerobrine();
        }
    });
});

// --- Herobrine zufällig für kurze Zeit einblenden ---
function spawnHerobrine() {
    if (!herobrineEl) return;

    // Zufällige Seite
    herobrineEl.style.left = Math.random() > 0.5 ? `${2 + Math.random() * 8}%` : `${85 + Math.random() * 10}%`;

    herobrineEl.classList.remove("hidden");
    showToast("👁️ Hast du das gesehen?");

    setTimeout(() => {
        herobrineEl.classList.add("hidden");
    }, 4000);
}

// Seltenes zufälliges Erscheinen (erst nach 45 Sekunden, dann alle 60–180 Sekunden) - DEAKTIVIERT
// setTimeout(() => {
//     setInterval(() => {
//         if (Math.random() < 0.5) {
//             spawnHerobrine();
//         }
//     }, 60000 + Math.random() * 120000);
// }, 45000);

// ============================================
// Initialisierung
// ============================================

updateNavbar();
updateActiveLink();
initMusic();
initGallery();
