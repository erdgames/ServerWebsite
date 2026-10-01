// ============================================
// NoName SMP – Minecraft Server Website
// ============================================
"use strict";

// ---------- Konfiguration ----------
const SERVER_IP = "mc.hexcat.at";
const BEDROCK_IP = "mcb.hexcat.at";
const FALLBACK_VERSION = "26.2";

// Karten-URL – leer lassen = Karten-Bereich bleibt versteckt. Beispiele:
// "http://mc.hexcat.at:8123/" (Dynmap) · "http://mc.hexcat.at:8100/" (BlueMap)
const MAP_URL = "";

const STATUS_REFRESH_INTERVAL = 30 * 1000;      // Serverstatus alle 30 s
const MODS_REFRESH_INTERVAL = 60 * 1000;        // mods/mods.txt alle 60 s
const MAP_REFRESH_INTERVAL = 10 * 60 * 1000;    // Karte alle 10 min

const LANGUAGE_STORAGE_KEY = "noname-language";
const MUSIC_STORAGE_KEY = "noname-music";
const MUSIC_TRACK_KEY = "noname-music-track";
const MUSIC_VOLUME_KEY = "noname-music-volume";

document.documentElement.classList.add("js");

// ---------- Sicherer localStorage-Zugriff ----------
const store = {
    get(key) {
        try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); } catch { /* ignorieren */ }
    }
};

const $ = (id) => document.getElementById(id);

// ============================================
// Übersetzungen
// ============================================

const translations = {
    de: {
        "meta.title": "NoName SMP | Minecraft Server",
        "meta.description": "NoName SMP – entspannter Survival-Server für Minecraft Java & Bedrock. Jetzt beitreten unter mc.hexcat.at",
        "nav.skip": "Zum Inhalt springen",
        "nav.features": "Features",
        "nav.commands": "Befehle",
        "nav.map": "Karte",
        "nav.online": "Online",
        "nav.mods": "Mods",
        "nav.howto": "Beitreten",
        "nav.about": "Über uns",
        "nav.languageSelect": "Sprache auswählen",
        "nav.menu": "Menü öffnen",
        "nav.join": "Jetzt beitreten",
        "hero.badge": "Minecraft Java & Bedrock · Survival",
        "hero.titlePrefix": "Willkommen auf",
        "hero.subtitle": "Dein neues Zuhause in der Blockwelt – entspanntes Survival, faire Regeln und eine Community, die zusammen baut.",
        "hero.ipHelp": "Klicke auf eine Adresse, um sie zu kopieren.",
        "hero.ctaJoin": "So trittst du bei",
        "hero.statPlayers": "Spieler online",
        "hero.statStable": "Online & stabil",
        "hero.statVersion": "Version",
        "hero.statMods": "Server-Mods",
        "hero.players": "{count}/{max} online",
        "features.tag": "Warum NoName SMP?",
        "features.title": "Features",
        "features.desc": "Alles, was dein Herz als Minecraft-Spieler begehrt – an einem Ort.",
        "features.card1.title": "Freundlich & chillig",
        "features.card1.text": "Eine entspannte Community – hilfsbereit, ohne Drama und offen für Gespräche.",
        "features.card2.title": "Klein & wachsend",
        "features.card2.text": "Ein kleiner Server mit einer echten, aktiven Community – frühe Spieler prägen die Atmosphäre.",
        "features.card3.title": "Bedrock + Java",
        "features.card3.text": "Konsole, Handy oder PC – alle spielen gemeinsam in derselben Welt.",
        "features.card4.title": "Claims & Teleports",
        "features.card4.text": "Schütze deine Basis und teleportiere dich zu Freunden.",
        "features.card5.title": "24/7 Betrieb",
        "features.card5.text": "Rund um die Uhr online – du kannst jederzeit vorbeischauen.",
        "features.card6.title": "Verbundener Chat",
        "features.card6.text": "Minecraft- und Discord-Chat sind miteinander verbunden.",
        "features.card7.title": "Anti-Cheat",
        "features.card7.text": "Kein X-Ray, keine Kill-Aura und keine Abkürzungen.",
        "features.card8.title": "Voice Chat",
        "features.card8.text": "Mit Simple Voice Chat redest du direkt im Spiel mit Spielern in deiner Nähe.",
        "gamemodes.badge": "Spielmodus",
        "gamemodes.modeTitle": "Survival",
        "gamemodes.modeText": "Das klassische Überlebensabenteuer – mit Community, Claims und einem fair gestalteten Marktplatz. Baue, kämpfe und überlebe gemeinsam mit deinen Freunden.",
        "gamemodes.point1": "Eigene Claims für deine Basis",
        "gamemodes.point2": "Spieler-Wirtschaft mit /pay",
        "gamemodes.point3": "Homes, Warps & TPA",
        "gamemodes.link": "Jetzt spielen →",
        "commands.tag": "Server-Befehle",
        "commands.title": "Nützliche <span class=\"accent\">Befehle</span>",
        "commands.desc": "Die wichtigsten Spielerbefehle auf einen Blick. Klicke auf einen Befehl, um ihn zu kopieren.",
        "commands.search": "Befehl suchen …",
        "commands.noResults": "Kein Befehl gefunden.",
        "commands.teleport.title": "Teleportation",
        "commands.teleport.spawn": "Teleportiert dich zum Server-Spawn.",
        "commands.teleport.home": "Teleportiert dich zu einem deiner Homes.",
        "commands.teleport.sethome": "Erstellt ein Home an deinem aktuellen Standort.",
        "commands.teleport.delhome": "Löscht eines deiner Homes.",
        "commands.teleport.homes": "Listet alle deine Homes auf.",
        "commands.teleport.tpa": "Sendet eine Teleport-Anfrage an einen Spieler.",
        "commands.teleport.tpaccept": "Akzeptiert eine Teleport-Anfrage.",
        "commands.teleport.tpdeny": "Lehnt eine Teleport-Anfrage ab.",
        "commands.teleport.back": "Kehrt zu deinem vorherigen Standort zurück.",
        "commands.teleport.warp": "Teleportiert zu einem öffentlichen Warp.",
        "commands.teleport.warps": "Listet verfügbare Warps auf.",
        "commands.chat.title": "Chat & Kommunikation",
        "commands.chat.msg": "Sendet eine private Nachricht.",
        "commands.chat.reply": "Antwortet auf die letzte private Nachricht.",
        "commands.chat.r": "Kurzform von /reply.",
        "commands.chat.ignore": "Ignoriert die privaten Nachrichten eines Spielers.",
        "commands.chat.voicechat": "Öffnet das Simple-Voice-Chat-Menü.",
        "commands.economy.title": "Wirtschaft",
        "commands.economy.pay": "Sendet Geld an einen anderen Spieler.",
        "commands.economy.balance": "Zeigt deinen aktuellen Kontostand.",
        "commands.economy.bal": "Kurzform von /balance.",
        "commands.claims.title": "Land-Claims",
        "commands.claims.claim": "Erstellt einen Land-Claim.",
        "commands.claims.unclaim": "Entfernt einen Claim.",
        "commands.claims.claims": "Listet deine Claims auf.",
        "commands.claims.trust": "Gibt einem Spieler Zugriff auf deinen Claim.",
        "commands.claims.untrust": "Entfernt den Zugriff eines Spielers.",
        "commands.claims.claiminfo": "Zeigt Informationen über den Claim, in dem du stehst.",
        "commands.hint": "Hinweis: Einige Befehle können je nach Server-Setup leicht abweichen.",
        "map.tag": "Live-Karte",
        "map.title": "Serverkarte",
        "map.desc": "Erkunde die Welt von NoName SMP in Echtzeit.",
        "map.loading": "Karte wird geladen...",
        "map.hint": "Tipp: Die Karte wird alle 10 Minuten automatisch aktualisiert.",
        "online.tag": "Live-Übersicht",
        "online.title": "Wer ist gerade <span class=\"accent\">online?</span>",
        "online.loading": "Spielerzahl wird geladen...",
        "online.label": "Spieler gerade online",
        "online.playersTitle": "Spieler",
        "online.noPlayers": "Gerade ist niemand online – sei der Erste!",
        "online.listHidden": "Der Server zeigt die Spielerliste gerade nicht an.",
        "online.offlineHint": "Der Server ist gerade nicht erreichbar. Schau gleich nochmal vorbei!",
        "online.versionLabel": "Version",
        "online.motdLabel": "MOTD",
        "online.lastUpdated": "Zuletzt aktualisiert um {time}",
        "online.status.online": "Server ist online",
        "online.status.onlineOne": "1 Spieler ist online",
        "online.status.onlineMany": "{count} Spieler sind online",
        "online.status.offline": "Server ist offline",
        "mods.tag": "Modpack",
        "mods.title": "Modliste",
        "mods.desc": "Alle Mods, die auf dem Server laufen – mit Link zu Modrinth. Zum Spielen brauchst du keine davon.",
        "mods.minecraftLabel": "Minecraft",
        "mods.loaderLabel": "Loader",
        "mods.countLabel": "Anzahl",
        "mods.search": "Mod suchen …",
        "mods.empty": "Keine Mods gefunden.",
        "mods.open": "{name} auf Modrinth öffnen",
        "join.tag": "In 4 Schritten",
        "join.title": "Bereit für dein <span class=\"accent\">Abenteuer?</span>",
        "join.desc": "Der Server hat eine Whitelist. So bist du in ein paar Minuten dabei:",
        "join.step1Title": "Discord beitreten",
        "join.step1": "Tritt unserem Discord-Server bei.",
        "join.step2Title": "Whitelist anfragen",
        "join.step2": "Schreibe deinen Minecraft-Namen in den Kanal <strong>#whitelist</strong>.",
        "join.step3Title": "Kurz warten",
        "join.step3": "Ein Teammitglied schaltet dich frei.",
        "join.step4Title": "Losspielen",
        "join.step4": "Server-Adresse kopieren, in Minecraft hinzufügen und joinen! 🎮",
        "join.boxTitle": "Server-Adressen",
        "join.infoVersion": "Version",
        "join.infoWhitelist": "Whitelist",
        "join.infoWhitelistValue": "Ja – über Discord",
        "join.infoCrossplay": "Crossplay",
        "join.infoCrossplayValue": "PC, Konsole & Handy",
        "join.infoMods": "Mods nötig?",
        "join.infoModsValue": "Nein – Voice Chat optional",
        "join.hint": "Adresse anklicken, um sie zu kopieren – dann in Minecraft unter „Server hinzufügen“ einfügen.",
        "discord.cardTitle": "NoName SMP Community",
        "discord.cardText": "Auf unserem Discord bekommst du die Whitelist, Hilfe, Ankündigungen und Events.",
        "discord.feature1": "🎮 Events",
        "discord.feature2": "📢 Ankündigungen",
        "discord.feature3": "✅ Whitelist",
        "discord.feature4": "🛠️ Support",
        "discord.button": "Discord beitreten",
        "discord.hint": "Kostenlos – einfach auf den Button klicken.",
        "about.tag": "Über uns",
        "about.title": "Wer steckt hinter <span class=\"accent\">NoName SMP?</span>",
        "about.text1": "NoName SMP ist ein kleiner, communitygetriebener Minecraft-Server – von Spielern für Spieler.",
        "about.text2": "Wir verbessern den Server laufend, hören auf Feedback aus der Community und sorgen dafür, dass jeder eine gute Zeit hat.",
        "about.check1": "Aktive Moderatoren & Admins",
        "about.check2": "Transparente Regeln & Fairness",
        "about.check3": "Regelmäßige Updates & neue Inhalte",
        "about.button": "Werde Teil der Community",
        "faq.q1": "Wie komme ich auf den Server?",
        "faq.a1": "Tritt unserem Discord bei und schreibe deinen Minecraft-Namen in den Kanal #whitelist. Sobald ein Teammitglied dich freigeschaltet hat, kannst du joinen.",
        "faq.q2": "Kann ich mit Handy oder Konsole spielen?",
        "faq.a2": "Ja. Bedrock-Spieler (Handy, Konsole, Windows-Edition) verbinden sich über mcb.hexcat.at und spielen in derselben Welt wie Java-Spieler.",
        "faq.q3": "Brauche ich Mods?",
        "faq.a3": "Nein, ein normaler Minecraft-Client reicht. Für den Voice Chat kannst du optional die Mod „Simple Voice Chat“ installieren.",
        "faq.q4": "Welche Version brauche ich?",
        "faq.a4": "Der Server läuft auf Minecraft 26.2. Am besten spielst du mit der aktuellen Version.",
        "faq.q5": "Wie schütze ich meine Basis?",
        "faq.a5": "Mit /claim sicherst du dein Gebiet, mit /trust <spieler> gibst du Freunden Zugriff. Alle Befehle findest du oben unter „Befehle“.",
        "faq.q6": "Ich habe ein Problem – wen frage ich?",
        "faq.a6": "Melde dich im Discord. Dort helfen dir das Team und die Community weiter.",
        "nav.faq": "FAQ",
        "faq.tag": "FAQ",
        "faq.title": "Häufige Fragen",
        "nav.statusOnline": "{count} online",
        "nav.statusOffline": "Offline",
        "cta.title": "Die Blöcke warten auf dich! 🧱",
        "cta.text": "Schnapp dir die Adresse, sag Hallo im Discord und bau deine eigene Geschichte.",
        "footer.brand": "Entspanntes Survival für Java & Bedrock. 24/7 online – wir sehen uns im Spiel!",
        "footer.serverTitle": "Server",
        "footer.contactTitle": "Kontakt",
        "footer.discord": "Discord-Community",
        "footer.ipTitle": "Server-IP",
        "footer.copyright": "© 2026 NoName SMP · Nicht mit Mojang oder Microsoft verbunden. Minecraft ist eine Marke von Mojang AB.",
        "music.openPlaylist": "Musik-Player öffnen",
        "music.panelTitle": "Musik-Player",
        "music.close": "Player schließen",
        "music.nowPlaying": "Aktueller Titel",
        "music.noTrack": "Kein Titel ausgewählt",
        "music.seek": "Position",
        "music.prev": "Vorheriger Titel",
        "music.playPause": "Wiedergabe starten oder pausieren",
        "music.next": "Nächster Titel",
        "music.volume": "Lautstärke",
        "easter.creeper": "Zisch... 💥",
        "server.status.checking": "Server wird geprüft...",
        "server.status.online": "Server ist online",
        "server.status.offline": "Server ist offline",
        "server.status.unavailable": "Status nicht verfügbar",
        "toast.copySuccess": "✓ Java-Adresse kopiert!",
        "toast.copyBedrockSuccess": "✓ Bedrock-Adresse kopiert!",
        "toast.copyCommand": "✓ {cmd} kopiert!",
        "toast.copyError": "Kopieren nicht möglich – Adresse: {address}",
        "toast.musicError": "Musik konnte nicht abgespielt werden"
    },
    en: {
        "meta.title": "NoName SMP | Minecraft Server",
        "meta.description": "NoName SMP – a relaxed survival server for Minecraft Java & Bedrock. Join now at mc.hexcat.at",
        "nav.skip": "Skip to content",
        "nav.features": "Features",
        "nav.commands": "Commands",
        "nav.map": "Map",
        "nav.online": "Online",
        "nav.mods": "Mods",
        "nav.howto": "Join",
        "nav.about": "About",
        "nav.languageSelect": "Select language",
        "nav.menu": "Open menu",
        "nav.join": "Join now",
        "hero.badge": "Minecraft Java & Bedrock · Survival",
        "hero.titlePrefix": "Welcome to",
        "hero.subtitle": "Your new home in the block world — relaxed survival, fair rules and a community that builds together.",
        "hero.ipHelp": "Click an address to copy it.",
        "hero.ctaJoin": "How to join",
        "hero.statPlayers": "Players online",
        "hero.statStable": "Online & stable",
        "hero.statVersion": "Version",
        "hero.statMods": "Server mods",
        "hero.players": "{count}/{max} online",
        "features.tag": "Why NoName SMP?",
        "features.title": "Features",
        "features.desc": "Everything your Minecraft heart could want — all in one place.",
        "features.card1.title": "Friendly & chill",
        "features.card1.text": "A relaxed community — helpful, low-drama, and easy to talk to.",
        "features.card2.title": "Small & growing",
        "features.card2.text": "A small server building a real, active community — early players shape the vibe.",
        "features.card3.title": "Bedrock + Java",
        "features.card3.text": "Console, mobile, or PC — everyone plays together in the same world.",
        "features.card4.title": "Claims & TPAs",
        "features.card4.text": "Protect your base, teleport to friends.",
        "features.card5.title": "24/7 runtime",
        "features.card5.text": "Online around the clock, hop on whenever.",
        "features.card6.title": "Synced chat",
        "features.card6.text": "Minecraft & Discord chat are linked.",
        "features.card7.title": "Anti-cheat",
        "features.card7.text": "No x-ray, no killaura, no shortcuts.",
        "features.card8.title": "Voice chat",
        "features.card8.text": "With Simple Voice Chat you can talk in-game to players near you.",
        "gamemodes.badge": "Gamemode",
        "gamemodes.modeTitle": "Survival",
        "gamemodes.modeText": "The classic survival adventure — with community, claims, and a fair marketplace. Build, fight, and survive together with your friends.",
        "gamemodes.point1": "Claims to protect your base",
        "gamemodes.point2": "Player economy with /pay",
        "gamemodes.point3": "Homes, warps & TPA",
        "gamemodes.link": "Play now →",
        "commands.tag": "Server commands",
        "commands.title": "Useful <span class=\"accent\">commands</span>",
        "commands.desc": "The most important player commands at a glance. Click a command to copy it.",
        "commands.search": "Search commands …",
        "commands.noResults": "No command found.",
        "commands.teleport.title": "Teleportation",
        "commands.teleport.spawn": "Teleports you to the server spawn.",
        "commands.teleport.home": "Teleports you to one of your homes.",
        "commands.teleport.sethome": "Creates a home at your current location.",
        "commands.teleport.delhome": "Deletes one of your homes.",
        "commands.teleport.homes": "Lists all of your homes.",
        "commands.teleport.tpa": "Sends a teleport request to a player.",
        "commands.teleport.tpaccept": "Accepts a teleport request.",
        "commands.teleport.tpdeny": "Declines a teleport request.",
        "commands.teleport.back": "Returns you to your previous location.",
        "commands.teleport.warp": "Teleports you to a public warp.",
        "commands.teleport.warps": "Lists available warps.",
        "commands.chat.title": "Chat & communication",
        "commands.chat.msg": "Sends a private message.",
        "commands.chat.reply": "Replies to the last private message.",
        "commands.chat.r": "Short form of /reply.",
        "commands.chat.ignore": "Ignores a player's private messages.",
        "commands.chat.voicechat": "Opens the Simple Voice Chat menu.",
        "commands.economy.title": "Economy",
        "commands.economy.pay": "Sends money to another player.",
        "commands.economy.balance": "Shows your current balance.",
        "commands.economy.bal": "Short form of /balance.",
        "commands.claims.title": "Land claims",
        "commands.claims.claim": "Creates a land claim.",
        "commands.claims.unclaim": "Removes a claim.",
        "commands.claims.claims": "Lists your claims.",
        "commands.claims.trust": "Grants a player access to your claim.",
        "commands.claims.untrust": "Removes a player's access.",
        "commands.claims.claiminfo": "Shows information about the claim you are standing in.",
        "commands.hint": "Note: Some commands may work slightly differently depending on the server setup.",
        "map.tag": "Live map",
        "map.title": "Server map",
        "map.desc": "Explore the world of NoName SMP in real time.",
        "map.loading": "Map is loading...",
        "map.hint": "Tip: The map updates automatically every 10 minutes.",
        "online.tag": "Live overview",
        "online.title": "Who's <span class=\"accent\">online?</span>",
        "online.loading": "Loading player count...",
        "online.label": "Players online right now",
        "online.playersTitle": "Players",
        "online.noPlayers": "Nobody is online right now — be the first!",
        "online.listHidden": "The server isn't sharing its player list right now.",
        "online.offlineHint": "The server can't be reached right now. Check back soon!",
        "online.versionLabel": "Version",
        "online.motdLabel": "MOTD",
        "online.lastUpdated": "Last updated at {time}",
        "online.status.online": "Server is online",
        "online.status.onlineOne": "1 player is online",
        "online.status.onlineMany": "{count} players are online",
        "online.status.offline": "Server is offline",
        "mods.tag": "Modpack",
        "mods.title": "Mod list",
        "mods.desc": "Every mod running on the server, with a link to Modrinth. You don't need any of them to play.",
        "mods.minecraftLabel": "Minecraft",
        "mods.loaderLabel": "Loader",
        "mods.countLabel": "Count",
        "mods.search": "Search mods …",
        "mods.empty": "No mods found.",
        "mods.open": "Open {name} on Modrinth",
        "join.tag": "In 4 steps",
        "join.title": "Ready for your <span class=\"accent\">adventure?</span>",
        "join.desc": "The server uses a whitelist. Here's how to get in within a few minutes:",
        "join.step1Title": "Join Discord",
        "join.step1": "Join our Discord server.",
        "join.step2Title": "Request whitelist",
        "join.step2": "Post your Minecraft username in the <strong>#whitelist</strong> channel.",
        "join.step3Title": "Wait a moment",
        "join.step3": "A team member will whitelist you.",
        "join.step4Title": "Start playing",
        "join.step4": "Copy the server address, add it in Minecraft and join! 🎮",
        "join.boxTitle": "Server addresses",
        "join.infoVersion": "Version",
        "join.infoWhitelist": "Whitelist",
        "join.infoWhitelistValue": "Yes – via Discord",
        "join.infoCrossplay": "Crossplay",
        "join.infoCrossplayValue": "PC, console & mobile",
        "join.infoMods": "Mods required?",
        "join.infoModsValue": "No – voice chat is optional",
        "join.hint": "Click an address to copy it, then paste it under “Add Server” in Minecraft.",
        "discord.cardTitle": "NoName SMP Community",
        "discord.cardText": "Our Discord is where you get whitelisted, find help, announcements and events.",
        "discord.feature1": "🎮 Events",
        "discord.feature2": "📢 Announcements",
        "discord.feature3": "✅ Whitelist",
        "discord.feature4": "🛠️ Support",
        "discord.button": "Join Discord",
        "discord.hint": "Free — just click the button.",
        "about.tag": "About us",
        "about.title": "Who is behind <span class=\"accent\">NoName SMP?</span>",
        "about.text1": "NoName SMP is a small, community-driven Minecraft server — made by players, for players.",
        "about.text2": "We keep improving the server, listen to community feedback and make sure everyone has a good time.",
        "about.check1": "Active moderators & admins",
        "about.check2": "Transparent rules & fairness",
        "about.check3": "Regular updates & new content",
        "about.button": "Become part of the community",
        "faq.q1": "How do I get on the server?",
        "faq.a1": "Join our Discord and post your Minecraft username in the #whitelist channel. Once a team member has whitelisted you, you can join.",
        "faq.q2": "Can I play on mobile or console?",
        "faq.a2": "Yes. Bedrock players (mobile, console, Windows edition) connect via mcb.hexcat.at and play in the same world as Java players.",
        "faq.q3": "Do I need mods?",
        "faq.a3": "No, a normal Minecraft client is enough. For voice chat you can optionally install the “Simple Voice Chat” mod.",
        "faq.q4": "Which version do I need?",
        "faq.a4": "The server runs Minecraft 26.2. It's best to play on the latest version.",
        "faq.q5": "How do I protect my base?",
        "faq.a5": "Use /claim to secure your area and /trust <player> to give friends access. All commands are listed above under “Commands”.",
        "faq.q6": "I have a problem – who do I ask?",
        "faq.a6": "Reach out on Discord. The team and the community will help you.",
        "nav.faq": "FAQ",
        "faq.tag": "FAQ",
        "faq.title": "Frequently asked questions",
        "nav.statusOnline": "{count} online",
        "nav.statusOffline": "Offline",
        "cta.title": "The blocks are waiting for you! 🧱",
        "cta.text": "Grab the address, say hi on Discord and build your own story.",
        "footer.brand": "Relaxed survival for Java & Bedrock. 24/7 online — see you in-game!",
        "footer.serverTitle": "Server",
        "footer.contactTitle": "Contact",
        "footer.discord": "Discord community",
        "footer.ipTitle": "Server IP",
        "footer.copyright": "© 2026 NoName SMP · Not affiliated with Mojang or Microsoft. Minecraft is a trademark of Mojang AB.",
        "music.openPlaylist": "Open music player",
        "music.panelTitle": "Music player",
        "music.close": "Close player",
        "music.nowPlaying": "Now playing",
        "music.noTrack": "No track selected",
        "music.seek": "Position",
        "music.prev": "Previous track",
        "music.playPause": "Play or pause",
        "music.next": "Next track",
        "music.volume": "Volume",
        "easter.creeper": "Sss... 💥",
        "server.status.checking": "Checking server status...",
        "server.status.online": "Server is online",
        "server.status.offline": "Server is offline",
        "server.status.unavailable": "Status unavailable",
        "toast.copySuccess": "✓ Java address copied!",
        "toast.copyBedrockSuccess": "✓ Bedrock address copied!",
        "toast.copyCommand": "✓ {cmd} copied!",
        "toast.copyError": "Could not copy — address: {address}",
        "toast.musicError": "Music could not be played"
    },
    ja: {
        "meta.title": "NoName SMP | Minecraftサーバー",
        "meta.description": "NoName SMP – Java & Bedrock対応のまったりサバイバルサーバー。mc.hexcat.at で今すぐ参加",
        "nav.skip": "本文へスキップ",
        "nav.features": "特徴",
        "nav.commands": "コマンド",
        "nav.map": "マップ",
        "nav.online": "オンライン",
        "nav.mods": "Mods",
        "nav.howto": "参加方法",
        "nav.about": "概要",
        "nav.languageSelect": "言語を選択",
        "nav.menu": "メニューを開く",
        "nav.join": "今すぐ参加",
        "hero.badge": "Minecraft Java & Bedrock · サバイバル",
        "hero.titlePrefix": "ようこそ",
        "hero.subtitle": "ブロックの世界の新しい家 — まったりサバイバル、公平なルール、一緒に建築するコミュニティ。",
        "hero.ipHelp": "アドレスをクリックしてコピーできます。",
        "hero.ctaJoin": "参加方法",
        "hero.statPlayers": "オンライン",
        "hero.statStable": "24時間安定稼働",
        "hero.statVersion": "バージョン",
        "hero.statMods": "サーバーMod",
        "hero.players": "{count}/{max} オンライン",
        "features.tag": "なぜNoName SMP？",
        "features.title": "特徴",
        "features.desc": "Minecraftプレイヤーが欲しいものが、ひとつの場所に。",
        "features.card1.title": "フレンドリー & まったり",
        "features.card1.text": "穏やかなコミュニティ — 助け合い、ドラマが少なく、話しやすいです。",
        "features.card2.title": "小さくても成長中",
        "features.card2.text": "小さなサーバーですが、本物のコミュニティを育てています。早い参加者が雰囲気を作ります。",
        "features.card3.title": "Bedrock + Java",
        "features.card3.text": "コンソール、モバイル、PC — みんなが同じ世界で遊べます。",
        "features.card4.title": "保護 & テレポート",
        "features.card4.text": "拠点を守り、友達のところへテレポートできます。",
        "features.card5.title": "24時間稼働",
        "features.card5.text": "24時間いつでも参加できます。",
        "features.card6.title": "チャット連携",
        "features.card6.text": "MinecraftとDiscordのチャットがつながっています。",
        "features.card7.title": "アンチチート",
        "features.card7.text": "X-ray、キルオーラ、ズルはなし。",
        "features.card8.title": "ボイスチャット",
        "features.card8.text": "Simple Voice Chatで近くのプレイヤーとゲーム内で話せます。",
        "gamemodes.badge": "ゲームモード",
        "gamemodes.modeTitle": "サバイバル",
        "gamemodes.modeText": "コミュニティ、土地保護、公平なマーケットを備えたクラシックなサバイバル。友達と一緒に建築し、戦い、生き延びよう。",
        "gamemodes.point1": "拠点を守る土地保護",
        "gamemodes.point2": "/pay によるプレイヤー経済",
        "gamemodes.point3": "ホーム、ワープ & TPA",
        "gamemodes.link": "今すぐプレイ →",
        "commands.tag": "サーバーコマンド",
        "commands.title": "便利な<span class=\"accent\">コマンド</span>",
        "commands.desc": "重要なプレイヤーコマンドを一覧で。クリックするとコピーできます。",
        "commands.search": "コマンドを検索 …",
        "commands.noResults": "コマンドが見つかりません。",
        "commands.teleport.title": "テレポート",
        "commands.teleport.spawn": "サーバーのスポーンへテレポートします。",
        "commands.teleport.home": "ホームのひとつへテレポートします。",
        "commands.teleport.sethome": "現在地にホームを作成します。",
        "commands.teleport.delhome": "ホームを1つ削除します。",
        "commands.teleport.homes": "ホームを一覧表示します。",
        "commands.teleport.tpa": "プレイヤーにテレポート依頼を送ります。",
        "commands.teleport.tpaccept": "テレポート依頼を承認します。",
        "commands.teleport.tpdeny": "テレポート依頼を拒否します。",
        "commands.teleport.back": "直前の場所に戻ります。",
        "commands.teleport.warp": "公開ワープへテレポートします。",
        "commands.teleport.warps": "利用可能なワープを一覧表示します。",
        "commands.chat.title": "チャット",
        "commands.chat.msg": "プライベートメッセージを送信します。",
        "commands.chat.reply": "最後のプライベートメッセージに返信します。",
        "commands.chat.r": "/reply の短縮形です。",
        "commands.chat.ignore": "プレイヤーのプライベートメッセージを無視します。",
        "commands.chat.voicechat": "Simple Voice Chat のメニューを開きます。",
        "commands.economy.title": "経済",
        "commands.economy.pay": "別のプレイヤーにお金を送ります。",
        "commands.economy.balance": "現在の残高を表示します。",
        "commands.economy.bal": "/balance の短縮形です。",
        "commands.claims.title": "土地保護",
        "commands.claims.claim": "土地保護を作成します。",
        "commands.claims.unclaim": "保護を解除します。",
        "commands.claims.claims": "保護した土地を一覧表示します。",
        "commands.claims.trust": "プレイヤーに保護地へのアクセス権を与えます。",
        "commands.claims.untrust": "プレイヤーのアクセス権を削除します。",
        "commands.claims.claiminfo": "今いる保護地の情報を表示します。",
        "commands.hint": "注: サーバー構成によって一部のコマンドの動作が異なる場合があります。",
        "map.tag": "ライブマップ",
        "map.title": "サーバーマップ",
        "map.desc": "NoName SMPの世界をリアルタイムで探索しよう。",
        "map.loading": "マップを読み込み中...",
        "map.hint": "ヒント: マップは10分ごとに自動更新されます。",
        "online.tag": "ライブ概要",
        "online.title": "今<span class=\"accent\">オンライン</span>なのは？",
        "online.loading": "プレイヤー数を読み込み中...",
        "online.label": "現在オンラインのプレイヤー",
        "online.playersTitle": "プレイヤー",
        "online.noPlayers": "今は誰もいません — 一番乗りしよう！",
        "online.listHidden": "サーバーは現在プレイヤーリストを公開していません。",
        "online.offlineHint": "現在サーバーに接続できません。しばらくしてからもう一度確認してください。",
        "online.versionLabel": "バージョン",
        "online.motdLabel": "MOTD",
        "online.lastUpdated": "最終更新: {time}",
        "online.status.online": "サーバーはオンラインです",
        "online.status.onlineOne": "1人がオンラインです",
        "online.status.onlineMany": "{count}人がオンラインです",
        "online.status.offline": "サーバーはオフラインです",
        "mods.tag": "Modpack",
        "mods.title": "Modリスト",
        "mods.desc": "サーバーで動いているすべてのMod（Modrinthリンク付き）。プレイに必要なものはありません。",
        "mods.minecraftLabel": "Minecraft",
        "mods.loaderLabel": "ローダー",
        "mods.countLabel": "個数",
        "mods.search": "Modを検索 …",
        "mods.empty": "Modが見つかりません。",
        "mods.open": "{name} をModrinthで開く",
        "join.tag": "4ステップ",
        "join.title": "<span class=\"accent\">冒険</span>の準備はできた？",
        "join.desc": "サーバーはホワイトリスト制です。数分で参加できます：",
        "join.step1Title": "Discordに参加",
        "join.step1": "Discordサーバーに参加してください。",
        "join.step2Title": "ホワイトリスト申請",
        "join.step2": "<strong>#whitelist</strong> チャンネルにMinecraftのユーザー名を書いてください。",
        "join.step3Title": "少し待つ",
        "join.step3": "チームメンバーが追加します。",
        "join.step4Title": "プレイ開始",
        "join.step4": "アドレスをコピーしてMinecraftに追加し、参加しよう！ 🎮",
        "join.boxTitle": "サーバーアドレス",
        "join.infoVersion": "バージョン",
        "join.infoWhitelist": "ホワイトリスト",
        "join.infoWhitelistValue": "あり – Discordで申請",
        "join.infoCrossplay": "クロスプレイ",
        "join.infoCrossplayValue": "PC・コンソール・モバイル",
        "join.infoMods": "Modは必要？",
        "join.infoModsValue": "不要（ボイスチャットは任意）",
        "join.hint": "アドレスをクリックしてコピーし、Minecraftの「サーバーを追加」に貼り付けてください。",
        "discord.cardTitle": "NoName SMPコミュニティ",
        "discord.cardText": "Discordではホワイトリスト申請、サポート、お知らせ、イベントがあります。",
        "discord.feature1": "🎮 イベント",
        "discord.feature2": "📢 お知らせ",
        "discord.feature3": "✅ ホワイトリスト",
        "discord.feature4": "🛠️ サポート",
        "discord.button": "Discordに参加",
        "discord.hint": "無料 — ボタンを押すだけ。",
        "about.tag": "概要",
        "about.title": "<span class=\"accent\">NoName SMP</span>について",
        "about.text1": "NoName SMPは、プレイヤーがプレイヤーのために作った小さなコミュニティ主導のMinecraftサーバーです。",
        "about.text2": "コミュニティの声を聞きながらサーバーを改善し続け、みんなが楽しく過ごせるようにしています。",
        "about.check1": "アクティブなモデレーター & 管理者",
        "about.check2": "透明なルール & 公平性",
        "about.check3": "定期的なアップデート & 新コンテンツ",
        "about.button": "コミュニティに参加",
        "faq.q1": "サーバーに入るには？",
        "faq.a1": "Discordに参加し、#whitelist チャンネルにMinecraftのユーザー名を書いてください。チームメンバーが追加したら参加できます。",
        "faq.q2": "スマホやコンソールでも遊べますか？",
        "faq.a2": "はい。Bedrock版（スマホ、コンソール、Windows版）は mcb.hexcat.at から接続し、Java版プレイヤーと同じ世界で遊べます。",
        "faq.q3": "Modは必要ですか？",
        "faq.a3": "いいえ、通常のMinecraftで遊べます。ボイスチャットを使う場合は「Simple Voice Chat」Modを任意で導入できます。",
        "faq.q4": "必要なバージョンは？",
        "faq.a4": "サーバーはMinecraft 26.2で動いています。最新バージョンでのプレイがおすすめです。",
        "faq.q5": "拠点を守るには？",
        "faq.a5": "/claim で土地を保護し、/trust <プレイヤー> で友達にアクセス権を与えます。コマンド一覧は上の「コマンド」にあります。",
        "faq.q6": "困ったときは誰に聞けばいい？",
        "faq.a6": "Discordで連絡してください。チームとコミュニティがサポートします。",
        "nav.faq": "FAQ",
        "faq.tag": "FAQ",
        "faq.title": "よくある質問",
        "nav.statusOnline": "{count}人オンライン",
        "nav.statusOffline": "オフライン",
        "cta.title": "ブロックが待っている！ 🧱",
        "cta.text": "アドレスをコピーして、Discordで挨拶して、自分だけの物語を作ろう。",
        "footer.brand": "Java & Bedrock対応のまったりサバイバル。24時間オンライン — ゲームで会おう！",
        "footer.serverTitle": "サーバー",
        "footer.contactTitle": "お問い合わせ",
        "footer.discord": "Discordコミュニティ",
        "footer.ipTitle": "サーバーIP",
        "footer.copyright": "© 2026 NoName SMP · MojangおよびMicrosoftとは関係ありません。MinecraftはMojang ABの商標です。",
        "music.openPlaylist": "音楽プレイヤーを開く",
        "music.panelTitle": "音楽プレイヤー",
        "music.close": "プレイヤーを閉じる",
        "music.nowPlaying": "再生中",
        "music.noTrack": "トラックが選択されていません",
        "music.seek": "再生位置",
        "music.prev": "前のトラック",
        "music.playPause": "再生/一時停止",
        "music.next": "次のトラック",
        "music.volume": "音量",
        "easter.creeper": "シュー... 💥",
        "server.status.checking": "サーバーを確認中...",
        "server.status.online": "サーバーはオンラインです",
        "server.status.offline": "サーバーはオフラインです",
        "server.status.unavailable": "ステータスを取得できません",
        "toast.copySuccess": "✓ Javaアドレスをコピーしました！",
        "toast.copyBedrockSuccess": "✓ Bedrockアドレスをコピーしました！",
        "toast.copyCommand": "✓ {cmd} をコピーしました！",
        "toast.copyError": "コピーできませんでした — アドレス: {address}",
        "toast.musicError": "音楽を再生できませんでした"
    }
};

const LOCALES = { de: "de-DE", en: "en-US", ja: "ja-JP" };
let currentLanguage = "de";

function getPreferredLanguage() {
    const stored = store.get(LANGUAGE_STORAGE_KEY);
    if (stored && translations[stored]) return stored;
    const browser = (navigator.languages && navigator.languages[0]) || navigator.language || "de";
    if (browser.startsWith("en")) return "en";
    if (browser.startsWith("ja")) return "ja";
    return "de";
}

function t(key, params = {}) {
    const dict = translations[currentLanguage] || translations.de;
    const text = dict[key] ?? translations.de[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (match, name) => (params[name] ?? match));
}

// Elemente mit dynamischem Text merken sich Schlüssel + Parameter,
// damit sie beim Sprachwechsel korrekt neu übersetzt werden.
function setText(el, key, params) {
    if (!el) return;
    el.dataset.dynKey = key;
    el.dataset.dynParams = params ? JSON.stringify(params) : "";
    el.textContent = t(key, params);
}

function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });
    // Nur für eigene, vertrauenswürdige Übersetzungen mit <span>/<strong>
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
        el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        el.dataset.i18nAttr.split(";").forEach((binding) => {
            const [attr, key] = binding.split(":").map((s) => s && s.trim());
            if (attr && key) el.setAttribute(attr, t(key));
        });
    });
    document.querySelectorAll("[data-dyn-key]").forEach((el) => {
        const params = el.dataset.dynParams ? JSON.parse(el.dataset.dynParams) : {};
        el.textContent = t(el.dataset.dynKey, params);
    });

    const select = $("language-select");
    if (select) select.value = currentLanguage;

    if (lastStatusTime) updateLastUpdated();
    if (modsData) renderModsList();
    if (musicTracks.length) updateTrackTitle();
}

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;
    store.set(LANGUAGE_STORAGE_KEY, lang);
    applyTranslations();
}

// ============================================
// Toast & Kopieren
// ============================================

let toastTimeout;
function showToast(message, isError = false) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 2400);
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }
    // Fallback für http:// oder ältere Browser
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    if (!ok) throw new Error("execCommand copy failed");
}

function flashCopied(el) {
    if (!el) return;
    el.classList.add("copied");
    setTimeout(() => el.classList.remove("copied"), 1200);
}

async function copyAddress(type, sourceEl) {
    const address = type === "bedrock" ? BEDROCK_IP : SERVER_IP;
    try {
        await copyText(address);
        flashCopied(sourceEl);
        showToast(t(type === "bedrock" ? "toast.copyBedrockSuccess" : "toast.copySuccess"));
    } catch (err) {
        console.warn("Kopieren fehlgeschlagen:", err);
        showToast(t("toast.copyError", { address }), true);
    }
}

// Für alte onclick-Aufrufe weiterhin verfügbar
window.copyIp = () => copyAddress("java");
window.copyBedrockIp = () => copyAddress("bedrock");

document.addEventListener("click", (e) => {
    const addressBtn = e.target.closest("[data-copy]");
    if (addressBtn) {
        copyAddress(addressBtn.dataset.copy, addressBtn);
        return;
    }
    const cmdBtn = e.target.closest(".cmd[data-cmd]");
    if (cmdBtn) {
        const cmd = cmdBtn.dataset.cmd;
        copyText(cmd)
            .then(() => { flashCopied(cmdBtn); showToast(t("toast.copyCommand", { cmd })); })
            .catch(() => showToast(cmd, true));
    }
});

// ============================================
// Navigation
// ============================================

const navbar = $("navbar");
const hamburger = $("hamburger");
const navLinks = $("nav-links");

function setMenu(open) {
    if (!hamburger || !navLinks) return;
    navLinks.classList.toggle("open", open);
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
}

hamburger?.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
window.matchMedia("(min-width: 961px)").addEventListener?.("change", (e) => { if (e.matches) setMenu(false); });

function updateNavbar() {
    navbar?.classList.toggle("scrolled", window.scrollY > 30);
    // Musik-Button erst nach dem Startbereich zeigen (verdeckt sonst auf dem Handy die IP-Karte)
    const fab = $("music-list-btn");
    if (fab) fab.classList.toggle("visible", window.scrollY > window.innerHeight * 0.6 || fab.classList.contains("playing") || fab.getAttribute("aria-expanded") === "true");
}
window.addEventListener("scroll", updateNavbar, { passive: true });

// Aktiven Navigationspunkt per IntersectionObserver bestimmen
const navLinkEls = [...document.querySelectorAll(".nav-link")];
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinkEls.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id], header[id]").forEach((s) => sectionObserver.observe(s));
}

// ============================================
// Einblend-Animationen
// ============================================

(function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            // Geschwister leicht versetzt einblenden
            const siblings = [...entry.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
            const delay = Math.min(siblings.indexOf(entry.target), 6) * 70;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add("is-visible");
            entry.target.addEventListener("transitionend", () => { entry.target.style.transitionDelay = ""; }, { once: true });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => observer.observe(el));
})();

// ============================================
// Befehle durchsuchen
// ============================================

const commandSearch = $("command-search");
commandSearch?.addEventListener("input", () => {
    const q = commandSearch.value.trim().toLowerCase();
    let visibleTotal = 0;
    document.querySelectorAll("#commands-grid .command-card").forEach((card) => {
        let visible = 0;
        card.querySelectorAll(".command-item").forEach((item) => {
            const match = !q || item.textContent.toLowerCase().includes(q);
            item.classList.toggle("hidden", !match);
            if (match) visible++;
        });
        card.classList.toggle("hidden", visible === 0);
        visibleTotal += visible;
    });
    $("commands-empty")?.classList.toggle("hidden", visibleTotal > 0);
});

// ============================================
// Serverstatus & Spieler (mcstatus.io)
// ============================================

const statusEl = $("server-status");
const statusDots = [$("status-dot"), $("hero-status-dot"), $("join-status-dot"), $("nav-status-dot")];
const navStatusText = $("nav-status-text");
const heroPlayersEl = $("hero-players");
const statPlayersEl = $("stat-players");
const statVersionEl = $("stat-version");
const onlineDot = $("online-status-dot");
const onlineCountText = $("online-count-text");
const onlineNumberEl = $("online-number");
const onlineMaxEl = $("online-max");
const onlineBarFill = $("online-bar-fill");
const playerListEl = $("player-list");
const playerEmptyEl = $("player-empty");
const onlineVersionEl = $("online-version");
const onlineMotdEl = $("online-motd");
const lastUpdatedEl = $("last-updated");

let lastStatusTime = null;
let firstStatusCheck = true;

function setDots(state) {
    [...statusDots, onlineDot].forEach((dot) => {
        if (!dot) return;
        dot.classList.remove("online", "offline");
        if (state === "online" || state === "offline") dot.classList.add(state);
    });
}

function updateLastUpdated() {
    if (!lastUpdatedEl || !lastStatusTime) return;
    const time = lastStatusTime.toLocaleTimeString(LOCALES[currentLanguage] || "de-DE", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    lastUpdatedEl.textContent = t("online.lastUpdated", { time });
}

function renderPlayers(list, count, isOnline) {
    if (!playerListEl || !playerEmptyEl) return;
    playerListEl.innerHTML = "";
    const players = Array.isArray(list) ? list : [];

    players.forEach((p) => {
        const name = p.name_clean || p.name_raw || p.name || "?";
        const chip = document.createElement("span");
        chip.className = "player-chip";
        const img = document.createElement("img");
        img.alt = "";
        img.loading = "lazy";
        img.width = 24; img.height = 24;
        img.src = `https://mc-heads.net/avatar/${encodeURIComponent(p.uuid || name)}/24`;
        img.onerror = () => img.remove();
        chip.append(img, document.createTextNode(name));
        playerListEl.appendChild(chip);
    });

    playerListEl.classList.toggle("hidden", players.length === 0);
    playerEmptyEl.classList.toggle("hidden", players.length > 0);
    if (players.length === 0) {
        const key = !isOnline ? "online.offlineHint" : count > 0 ? "online.listHidden" : "online.noPlayers";
        setText(playerEmptyEl, key);
    }
}

function renderStatus(data) {
    const isOnline = Boolean(data && data.online);
    const count = isOnline && typeof data.players?.online === "number" ? data.players.online : 0;
    const max = isOnline && typeof data.players?.max === "number" ? data.players.max : 0;

    setDots(isOnline ? "online" : "offline");
    setText(statusEl, data ? (isOnline ? "server.status.online" : "server.status.offline") : "server.status.unavailable");

    if (statPlayersEl) statPlayersEl.textContent = isOnline ? String(count) : "0";
    if (navStatusText) {
        if (!data) { delete navStatusText.dataset.dynKey; navStatusText.textContent = "–"; }
        else setText(navStatusText, isOnline ? "nav.statusOnline" : "nav.statusOffline", isOnline ? { count } : undefined);
    }
    if (heroPlayersEl) {
        heroPlayersEl.classList.toggle("hidden", !isOnline || !max);
        if (isOnline && max) setText(heroPlayersEl, "hero.players", { count, max });
    }

    const version = data?.version?.name_clean || data?.version?.name;
    // Nur eine "saubere" Versionsnummer übernehmen (z. B. "26.2" statt "Fabric 26.2-26.2.1")
    const cleanVersion = version && (version.match(/\d+\.\d+(?:\.\d+)?/) || [])[0];
    if (statVersionEl) statVersionEl.textContent = cleanVersion || FALLBACK_VERSION;
    const joinVersionEl = $("join-version");
    if (joinVersionEl) joinVersionEl.textContent = `Java & Bedrock ${cleanVersion || FALLBACK_VERSION}`;
    if (onlineVersionEl) onlineVersionEl.textContent = isOnline && version ? version : "–";
    if (onlineMotdEl) onlineMotdEl.textContent = isOnline && data.motd?.clean ? data.motd.clean.trim() : "–";

    if (onlineNumberEl) onlineNumberEl.textContent = String(count);
    if (onlineMaxEl) onlineMaxEl.textContent = isOnline && max ? `/${max}` : "";
    if (onlineBarFill) onlineBarFill.style.width = max ? `${Math.min(100, (count / max) * 100)}%` : "0%";

    if (onlineCountText) {
        if (!isOnline) setText(onlineCountText, "online.status.offline");
        else if (count === 0) setText(onlineCountText, "online.status.online");
        else if (count === 1) setText(onlineCountText, "online.status.onlineOne");
        else setText(onlineCountText, "online.status.onlineMany", { count });
    }

    renderPlayers(isOnline ? data.players?.list : [], count, isOnline);
    lastStatusTime = new Date();
    updateLastUpdated();
}

async function checkServerStatus() {
    if (firstStatusCheck) {
        setText(statusEl, "server.status.checking");
        firstStatusCheck = false;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    try {
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${encodeURIComponent(SERVER_IP)}`, {
            signal: controller.signal
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        renderStatus(await response.json());
    } catch (err) {
        console.warn("Serverstatus konnte nicht abgerufen werden:", err);
        renderStatus(null);
    } finally {
        clearTimeout(timeoutId);
    }
}

// ============================================
// Mods (aus mods/mods.txt)
// ============================================

const MODS_DATA_URL = "mods/mods.txt";

// Reserve, falls mods/mods.txt nicht geladen werden kann (z. B. bei file://).
// Bitte bei Änderungen an mods/mods.txt hier ebenfalls anpassen.
const DEFAULT_MODS_DATA = {
    minecraft: "26.2",
    loader: "Fabric",
    mods: [
        { name: "Alternative", file: "alternative-125.0-fabric-1.21.7.jar", url: "https://modrinth.com/mod/alternative" },
        { name: "Alternate Current", file: "alternate-current-mc26.2-1.19.0.jar", url: "https://modrinth.com/mod/alternate-current" },
        { name: "AntiXray", file: "antixray-fabric-1.4.18+1.21.jar", url: "https://modrinth.com/mod/antixray" },
        { name: "Architectury API", file: "architectury-fabric-16.0.2.jar", url: "https://modrinth.com/mod/architectury-api" },
        { name: "C2ME", file: "c2me-fabric-mc26.2-0.3.4+beta.1.6.jar", url: "https://modrinth.com/mod/c2me-fabric" },
        { name: "ClaimMod", file: "ClaimMod-1.9.5.jar", url: "https://modrinth.com/mod/claimmod" },
        { name: "Cloth Config", file: "cloth-config-28.2.15.jar", url: "https://modrinth.com/mod/cloth-config" },
        { name: "Clumps", file: "Clumps-fabric-26.2.0.2.jar", url: "https://modrinth.com/mod/clumps" },
        { name: "Discord Integration", file: "dcintegration-fabric-MC26.2-3.2.0.jar", url: "https://modrinth.com/mod/dcintegration" },
        { name: "DSBugFix", file: "dsbugfix-26.2.0.0.jar", url: "" },
        { name: "EconomyRAL", file: "economyral-fabric-1.8.1_26.2.jar", url: "https://modrinth.com/mod/economyral" },
        { name: "Essential Commands", file: "essential_commands-0.49.0+mc1.26.2.jar", url: "https://modrinth.com/mod/essential-commands" },
        { name: "Fabric API", file: "fabric-api-0.158.0+26.2.1.jar", url: "https://modrinth.com/mod/fabric-api" },
        { name: "Carpet", file: "fabric-carpet-26.2+v20250716.jar", url: "https://modrinth.com/mod/carpet" },
        { name: "Fabric Language Kotlin", file: "fabric-language-kotlin-1.13.13+kotlin.2.4.10.jar", url: "https://modrinth.com/mod/fabric-language-kotlin" },
        { name: "Fabric Resource Pack API", file: "fabric-rp-1.8.0.jar", url: "" },
        { name: "FerriteCore", file: "ferritecore-9.0.8-fabric.jar", url: "https://modrinth.com/mod/ferrite-core" },
        { name: "Floodgate", file: "floodgate-fabric-2.2.8-b67.jar", url: "https://modrinth.com/plugin/floodgate" },
        { name: "Forge Config API Port", file: "ForgeConfigAPIPort-v26.2.1-mc26.2.5-fabric.jar", url: "https://modrinth.com/mod/forge-config-api-port" },
        { name: "Geyser", file: "Geyser-Fabric.jar", url: "https://modrinth.com/plugin/geyser" },
        { name: "JEI", file: "jei-26.2-fabric-20.19.0.173.jar", url: "https://modrinth.com/mod/jei" },
        { name: "ImmediatelyFast", file: "immediatelyfast-1.28.6-fabric-1.26.2.jar", url: "https://modrinth.com/mod/immediatelyfast" },
        { name: "Lithium", file: "lithium-fabric-0.25.1+mc26.2.jar", url: "https://modrinth.com/mod/lithium" },
        { name: "LuckPerms", file: "LuckPerms-Fabric-5.5.57.jar", url: "https://modrinth.com/mod/luckperms" },
        { name: "Packet Fixer", file: "packetfixer-fabric-2.3.5+26.2.jar", url: "https://modrinth.com/mod/packet-fixer" },
        { name: "Resourceful Config", file: "ResourcefulConfig-5.6.9.jar", url: "https://modrinth.com/mod/resourceful-config" },
        { name: "ScalableLux", file: "ScalableLux-0.2.1-fabric+26.0.5.48+1.21.jar", url: "https://modrinth.com/mod/scalablelux" },
        { name: "Structure Layout Optimizer", file: "structure_layout_optimizer-1.14-26.1-fabric.jar", url: "https://modrinth.com/mod/structure-layout-optimizer" },
        { name: "Styled Chat", file: "styled-chat-1.21.3-26.2.jar", url: "https://modrinth.com/mod/styled-chat" },
        { name: "TalkBalloons", file: "TalkBalloons-fabric-1.5.4+26.2.jar", url: "https://modrinth.com/mod/talk-balloons" },
        { name: "Trade Cycling", file: "trade-cycling-fabric-1.9.2+26.2.jar", url: "https://modrinth.com/mod/trade-cycling" },
        { name: "VMP", file: "vmp-fabric-mc26.2-rc.2+26.2-beta.7235-d1.jar", url: "https://modrinth.com/mod/vmp-fabric" },
        { name: "Simple Voice Chat", file: "voicechat-fabric-2.6.2+26.2.jar", url: "https://modrinth.com/mod/simple-voice-chat" },
        { name: "XEnderChest", file: "xenderchest-1.1.8.jar", url: "https://modrinth.com/mod/xenderchest" }
    ]
};

let modsData = null;
let modsRaw = "";
const modsListEl = $("mods-list");
const modsSearch = $("mods-search");

function isHttpUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
}

function modColor(name) {
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
    return `hsl(${h} 45% 38%)`;
}

const EXTERNAL_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>';

function renderModsList() {
    if (!modsListEl || !modsData) return;
    const q = (modsSearch?.value || "").trim().toLowerCase();
    const mods = (Array.isArray(modsData.mods) ? modsData.mods : [])
        .filter((m) => m && typeof m.name === "string")
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
        .filter((m) => !q || m.name.toLowerCase().includes(q) || (m.file || "").toLowerCase().includes(q));

    modsListEl.replaceChildren(...mods.map((mod) => {
        const li = document.createElement("li");
        li.className = "mod-row";

        const avatar = document.createElement("span");
        avatar.className = "mod-avatar";
        avatar.style.background = modColor(mod.name);
        avatar.textContent = mod.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 1).toUpperCase() || "?";
        avatar.setAttribute("aria-hidden", "true");

        const info = document.createElement("div");
        info.className = "mod-info";
        const name = document.createElement("span");
        name.className = "mod-name";
        name.textContent = mod.name;
        const file = document.createElement("span");
        file.className = "mod-file";
        file.textContent = mod.file || "";
        file.title = mod.file || "";
        info.append(name, file);
        li.append(avatar, info);

        const url = typeof mod.url === "string" ? mod.url.trim() : "";
        if (isHttpUrl(url)) {
            const a = document.createElement("a");
            a.className = "mod-link";
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.setAttribute("aria-label", t("mods.open", { name: mod.name }));
            a.title = "Modrinth";
            a.innerHTML = EXTERNAL_ICON;
            li.append(a);
        }
        return li;
    }));

    $("mods-empty")?.classList.toggle("hidden", mods.length > 0);
}

function renderModsData(data) {
    if (!data || typeof data !== "object") return;
    modsData = data;
    const count = Array.isArray(data.mods) ? data.mods.length : 0;
    const set = (id, value) => { const el = $(id); if (el) el.textContent = value; };
    set("mods-minecraft", typeof data.minecraft === "string" ? data.minecraft : "–");
    set("mods-loader", typeof data.loader === "string" ? data.loader : "–");
    set("mods-count", String(count));
    set("stat-mods", String(count));
    renderModsList();
}

async function loadModsData() {
    try {
        const response = await fetch(`${MODS_DATA_URL}?t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // BOM entfernen, sonst scheitert JSON.parse
        const text = (await response.text()).replace(/^﻿/, "").trim();
        if (text === modsRaw) return;
        const parsed = JSON.parse(text);
        modsRaw = text;
        renderModsData(parsed);
    } catch (err) {
        if (!modsData) {
            console.info("mods/mods.txt nicht erreichbar oder ungültig – zeige Offline-Stand.", err);
            renderModsData(DEFAULT_MODS_DATA);
        } else {
            console.warn("mods/mods.txt konnte nicht aktualisiert werden:", err);
        }
    }
}

modsSearch?.addEventListener("input", renderModsList);

// ============================================
// Karte
// ============================================

function initMap() {
    const mapSection = $("map");
    const mapFrame = $("map-frame");
    const mapLoading = $("map-loading");
    if (!MAP_URL || !mapSection || !mapFrame) return;

    mapSection.classList.remove("hidden");
    document.querySelector(".nav-map")?.classList.remove("hidden");
    mapFrame.addEventListener("load", () => mapLoading?.classList.add("hidden"));
    mapFrame.src = MAP_URL;

    setInterval(() => {
        mapLoading?.classList.remove("hidden");
        const url = new URL(MAP_URL);
        url.searchParams.set("_", Date.now());
        mapFrame.src = url.toString();
    }, MAP_REFRESH_INTERVAL);
}

// ============================================
// Musik-Player
// ============================================

// Fallback-Playlist, falls /api/tracks (serve.ps1) nicht erreichbar ist
const DEFAULT_MUSIC_TRACKS = [
    "01 Calm 1", "02 Calm 2", "03 Calm 3", "04 Piano 1", "05 Piano 2", "06 Piano 3",
    "07 Boo", "08 Hal 1", "09 Hal 2", "10 Hal 3", "11 Hal 4", "12 Nuance 1", "13 Nuance 2",
    "14 13 (Gold LP)", "15 Cat (Green LP)", "16 Minecraft Is Acid", "17 Chicken Freestyle", "music"
].map((name) => ({ file: `audio/${name}.mp3`, title: name.replace(/^\d+\s*/, "") }));

let musicTracks = [];
let currentTrackIndex = 0;
let isSeeking = false;

const bgMusic = $("bg-music");
const musicFab = $("music-list-btn");
const musicPanel = $("music-panel");
const musicPlayBtn = $("music-play-btn");
const musicTrackTitle = $("music-track-title");
const musicPlaylist = $("music-playlist");
const musicSeek = $("music-seek");
const musicTime = $("music-time");
const musicDuration = $("music-duration");
const musicVolume = $("music-volume");

async function loadMusicTracks() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    try {
        const response = await fetch("api/tracks", { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        // PowerShell liefert bei genau einem Titel ein Objekt statt eines Arrays
        const list = (Array.isArray(data) ? data : [data])
            .filter((tr) => tr && typeof tr.file === "string" && typeof tr.title === "string");
        if (list.length) return list;
    } catch {
        // Kein serve.ps1 → Standard-Playlist verwenden
    } finally {
        clearTimeout(timeoutId);
    }
    return DEFAULT_MUSIC_TRACKS.slice();
}

function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
}

function updateTrackTitle() {
    if (!musicTrackTitle) return;
    const track = musicTracks[currentTrackIndex];
    if (track) {
        delete musicTrackTitle.dataset.i18n;
        musicTrackTitle.textContent = track.title;
    }
}

function markActiveTrack() {
    musicPlaylist?.querySelectorAll(".music-playlist-item").forEach((item, i) => {
        const active = i === currentTrackIndex;
        item.classList.toggle("active", active);
        item.setAttribute("aria-current", active ? "true" : "false");
    });
}

function buildPlaylist() {
    if (!musicPlaylist) return;
    musicPlaylist.replaceChildren(...musicTracks.map((track, index) => {
        const li = document.createElement("li");
        li.className = "music-playlist-item";
        li.tabIndex = 0;
        li.setAttribute("role", "button");
        const num = document.createElement("span");
        num.className = "num";
        num.textContent = String(index + 1).padStart(2, "0");
        li.append(num, document.createTextNode(track.title));
        li.addEventListener("click", () => playTrack(index));
        li.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); playTrack(index); }
        });
        return li;
    }));
}

function loadTrack(index) {
    if (!bgMusic || !musicTracks.length) return;
    currentTrackIndex = (index + musicTracks.length) % musicTracks.length;
    bgMusic.src = encodeURI(musicTracks[currentTrackIndex].file);
    store.set(MUSIC_TRACK_KEY, String(currentTrackIndex));
    updateTrackTitle();
    markActiveTrack();
}

function play() {
    if (!bgMusic) return;
    if (!bgMusic.getAttribute("src")) loadTrack(currentTrackIndex);
    bgMusic.play().catch((err) => {
        if (err && err.name !== "AbortError") showToast(t("toast.musicError"), true);
    });
}

function playTrack(index) {
    loadTrack(index);
    play();
}

function updatePlayState() {
    const playing = bgMusic && !bgMusic.paused && !bgMusic.ended;
    if (musicPlayBtn) musicPlayBtn.textContent = playing ? "⏸" : "▶";
    musicFab?.classList.toggle("playing", Boolean(playing));
    updateNavbar();
}

function setPanel(open) {
    if (!musicPanel) return;
    musicPanel.classList.toggle("open", open);
    musicFab?.setAttribute("aria-expanded", String(open));
    updateNavbar();
}

async function initMusic() {
    if (!bgMusic) return;
    musicTracks = await loadMusicTracks();
    buildPlaylist();

    const savedIndex = parseInt(store.get(MUSIC_TRACK_KEY), 10);
    currentTrackIndex = Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < musicTracks.length ? savedIndex : 0;
    updateTrackTitle();
    markActiveTrack();

    const savedVolume = parseFloat(store.get(MUSIC_VOLUME_KEY));
    bgMusic.volume = isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.4;
    if (musicVolume) musicVolume.value = String(bgMusic.volume);

    musicFab?.addEventListener("click", (e) => { e.stopPropagation(); setPanel(!musicPanel.classList.contains("open")); });
    $("music-panel-close")?.addEventListener("click", () => setPanel(false));
    $("music-prev-btn")?.addEventListener("click", () => playTrack(currentTrackIndex - 1));
    $("music-next-btn")?.addEventListener("click", () => playTrack(currentTrackIndex + 1));
    musicPlayBtn?.addEventListener("click", () => (bgMusic.paused ? play() : bgMusic.pause()));

    musicVolume?.addEventListener("input", () => {
        bgMusic.volume = parseFloat(musicVolume.value);
        store.set(MUSIC_VOLUME_KEY, musicVolume.value);
    });

    musicSeek?.addEventListener("input", () => {
        isSeeking = true;
        if (isFinite(bgMusic.duration)) musicTime.textContent = formatTime((musicSeek.value / 100) * bgMusic.duration);
    });
    musicSeek?.addEventListener("change", () => {
        if (isFinite(bgMusic.duration)) bgMusic.currentTime = (musicSeek.value / 100) * bgMusic.duration;
        isSeeking = false;
    });

    bgMusic.addEventListener("timeupdate", () => {
        if (isSeeking || !isFinite(bgMusic.duration)) return;
        musicSeek.value = String((bgMusic.currentTime / bgMusic.duration) * 100 || 0);
        musicTime.textContent = formatTime(bgMusic.currentTime);
    });
    bgMusic.addEventListener("loadedmetadata", () => { musicDuration.textContent = formatTime(bgMusic.duration); });
    bgMusic.addEventListener("play", () => { updatePlayState(); store.set(MUSIC_STORAGE_KEY, "on"); });
    bgMusic.addEventListener("pause", () => { updatePlayState(); if (!bgMusic.ended) store.set(MUSIC_STORAGE_KEY, "off"); });
    bgMusic.addEventListener("ended", () => playTrack(currentTrackIndex + 1));
    bgMusic.addEventListener("error", () => {
        // Defekte/fehlende Datei überspringen (aber nicht endlos)
        if (musicTracks.length > 1 && !bgMusic.paused) playTrack(currentTrackIndex + 1);
    });

    // Panel schließen bei Klick außerhalb oder Escape
    document.addEventListener("click", (e) => {
        if (musicPanel.classList.contains("open") && !musicPanel.contains(e.target) && !musicFab.contains(e.target)) setPanel(false);
    });

    // Wer die Musik zuletzt anhatte, bekommt sie bei der ersten Interaktion wieder
    // (Browser blockieren Autoplay ohne Klick).
    if (store.get(MUSIC_STORAGE_KEY) === "on") {
        const resume = (e) => {
            if (e.target.closest && e.target.closest("#music-panel, #music-list-btn")) return;
            play();
        };
        document.addEventListener("pointerdown", resume, { once: true });
    }
    updatePlayState();
}

// ============================================
// Easter Egg: Konami-Code
// ============================================

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;
const creeperOverlay = $("creeper-overlay");

function closeCreeper() {
    creeperOverlay?.classList.add("hidden");
    document.body.classList.remove("no-scroll");
}

function triggerCreeper() {
    if (!creeperOverlay) return;
    const particles = $("creeper-particles");
    if (particles) {
        particles.replaceChildren(...Array.from({ length: 28 }, () => {
            const p = document.createElement("span");
            const size = 6 + Math.random() * 10;
            p.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${Math.random() > 0.5 ? "#4daf4a" : "#2d6e2a"};left:${20 + Math.random() * 60}%;top:${20 + Math.random() * 60}%;--tx:${(Math.random() - 0.5) * 400}px;--ty:${(Math.random() - 0.5) * 400}px;animation:particle-fly ${0.6 + Math.random() * 0.8}s ease-out forwards`;
            return p;
        }));
    }
    creeperOverlay.classList.remove("hidden");
    document.body.classList.add("no-scroll");
    setTimeout(closeCreeper, 1800);
}

creeperOverlay?.addEventListener("click", closeCreeper);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        setMenu(false);
        setPanel(false);
        closeCreeper();
    }
    if (e.target.matches && e.target.matches("input, textarea, select")) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === KONAMI.length) { konamiIndex = 0; triggerCreeper(); }
    } else {
        konamiIndex = key === KONAMI[0] ? 1 : 0;
    }
});

// ============================================
// Start
// ============================================

$("language-select")?.addEventListener("change", (e) => setLanguage(e.target.value));
currentLanguage = getPreferredLanguage();
applyTranslations();
updateNavbar();

checkServerStatus();
setInterval(() => { if (!document.hidden) checkServerStatus(); }, STATUS_REFRESH_INTERVAL);
document.addEventListener("visibilitychange", () => { if (!document.hidden) checkServerStatus(); });

loadModsData();
setInterval(() => { if (!document.hidden) loadModsData(); }, MODS_REFRESH_INTERVAL);

initMap();
initMusic();
