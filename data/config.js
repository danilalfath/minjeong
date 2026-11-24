/* ============================================================
   PENGATURAN HP — ubah isi file ini untuk mengatur tampilan.
   (Daftar foto galeri ada di data/photos.js)
   ============================================================ */
window.SITE = {
  /* ---------- pemilik HP ---------- */
  owner: {
    name: "Minjeong",
    initials: "MJ",
    avatar: "assets/img/avatars/me-img.jpg", // foto profil di app Photos ("" = pakai inisial)
  },

  /* ---------- kode kunci ----------
     4 atau 6 angka. Kosongkan ("") kalau HP tidak perlu dikunci. */
  passcode: "1101",

  /* petunjuk kode: muncul di bawah titik-titik setelah 2x salah ("" = tanpa petunjuk).
     Petunjuk utamanya bisa kamu sembunyikan di notifikasi lock screen (data/messages.js)
     atau di gambar wallpaper. */
  passcodeHint: "Petunjuk: tanggal di notifikasi. Bulan dulu, baru tanggal.",

  /* kode untuk album Hidden & Recently Deleted di Photos ("" = sama dengan kode HP) */
  photosCode: "",

  /* ---------- jam ----------
     hour12: true  → 3:17   |  false → 15:17
     fixed : ""    → jam asli pengunjung
             "2026-11-09 21:41" → jam & tanggal HP berhenti di waktu cerita */
  clock: { hour12: true, fixed: "" },

  /* ---------- wallpaper (ukuran ideal 9:19.5, mis. 1179x2556) ---------- */
  wallpaper: {
    lock: "assets/img/lock-wallpaper.jpg",
    home: "assets/img/wallpaper.jpg",
  },

  /* ---------- baterai di status bar (0–100) ---------- */
  battery: 82,

  /* ---------- notifikasi tambahan di lock screen ----------
     Pesan yang belum dibaca di Messages otomatis tampil sendiri (atur di data/messages.js).
     Di sini untuk notifikasi lain, contoh:
     { app: "instagram", title: "Instagram", text: "jiminie menyukai fotomu", time: "2h ago" } */
  lockNotifications: [
    { app: "messages", title: "Jiminie", text: "1 November. jangan lupa ya 🤍", time: "3:02 AM" },
  ],

  /* ---------- home screen, urut kiri → kanan, atas → bawah ----------
     "id-app"                         → ikon app (lihat daftar `apps` di bawah)
     { widget: "path/foto.jpg", label: "Photos" } → widget foto 2x2
     Maksimal 6 baris ikon (widget = 2 baris). */
  home: [
    { widget: "assets/img/gallery/portrait-close-up.jpg", label: "Photos" },
    { widget: "assets/img/gallery/studio-white-dress.jpg", label: "Photos" },
    "notes",
    "clock",
    { widget: "assets/img/gallery/balcony-summer-1.jpg", label: "Photos" },
    "instagram",
    "photos",
    "calendar",
    "weather",
    "settings",
    "appstore",
  ],

  /* ---------- dock (maksimal 4) ---------- */
  dock: ["phone", "messages", "music", "camera"],

  /* ---------- angka merah di pojok ikon ----------
     Angka di ikon Messages dihitung otomatis dari pesan yang belum dibaca. */
  badges: { phone: 2 },

  /* ---------- daftar app: id → [nama, ikon] ----------
     Ikon = gambar persegi tanpa sudut membulat (sudutnya dibulatkan otomatis).
     "clock" dan "calendar" digambar langsung supaya jam & tanggalnya hidup.
     Yang bisa dibuka: photos, messages, notes, phone, instagram.
     Yang lain masih pajangan. */
  apps: {
    phone: ["Phone", "assets/img/icons/phone.png"],
    messages: ["Messages", "assets/img/icons/messages.png"],
    music: ["Music", "assets/img/icons/music.png"],
    camera: ["Camera", "assets/img/icons/camera.png"],
    photos: ["Photos", "assets/img/icons/photos.png"],
    notes: ["Notes", "assets/img/icons/notes.png"],
    clock: ["Clock", "assets/img/icons/clock.png"],
    calendar: ["Calendar", "assets/img/icons/calendar.png"],
    instagram: ["Instagram", "assets/img/icons/instagram.png"],
    weather: ["Weather", "assets/img/icons/weatherIcon.png"],
    settings: ["Settings", "assets/img/icons/settings.png"],
    appstore: ["App Store", "assets/img/icons/appstore.png"],
    safari: ["Safari", "assets/img/icons/safari.png"],
    mail: ["Mail", "assets/img/icons/mail.png"],
    facetime: ["FaceTime", "assets/img/icons/facetime.png"],
    health: ["Health", "assets/img/icons/health.png"],
    wallet: ["Wallet", "assets/img/icons/wallet.png"],
    reminders: ["Reminders", "assets/img/icons/reminders.png"],
    news: ["News", "assets/img/icons/news.png"],
    compass: ["Compass", "assets/img/icons/compass.png"],
  },
};
