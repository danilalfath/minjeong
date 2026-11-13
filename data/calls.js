/* ============================================================
   ISI APP PHONE — data di bawah hanya CONTOH.

   contacts : daftar kontak. `id` dipakai di recents & voicemail.
              Kalau id-nya sama dengan id chat di data/messages.js,
              tombol "message" di kartu kontak membuka chat itu.
              Nomor di sini sengaja nomor palsu (010-0000-xxxx).
   recents  : riwayat panggilan, yang terbaru di atas.
              who   : id kontak, atau nomor tak dikenal ("010-0000-2931")
              type  : "missed" (merah) | "in" (masuk) | "out" (keluar)
              when  : "-0 03:04" = hari ini 03:04, "-1 21:40" = kemarin,
                      atau tanggal pasti "2026-11-12 21:40"
              count : jumlah panggilan beruntun, tampil sebagai (2)
              kind  : "FaceTime Audio" / "FaceTime Video" (kosong = telepon biasa)
   voicemail: pesan suara.
              duration   : detik
              heard      : false → ada titik biru (belum didengar)
              transcript : isi pesan yang tampil saat dibuka
              audio      : path file suara (opsional), mis. "assets/audio/vm1.mp3"
   ============================================================ */
window.CALLS = {
  contacts: [
    {
      id: "jiminie",
      name: "Jiminie",
      number: "010-0000-0411",
      label: "mobile",
      avatar: "assets/img/avatars/jimin-img.jpg",
      favorite: true,
    },
    { id: "eomma", name: "Eomma", number: "010-0000-0101", label: "home", avatar: "", favorite: true },
    { id: "manager", name: "Manager", number: "010-0000-0700", label: "work", avatar: "" },
  ],

  recents: [
    { who: "jiminie", type: "missed", when: "-0 03:04", count: 2 },
    { who: "jiminie", type: "out", when: "-1 21:40", kind: "FaceTime Audio" },
    { who: "eomma", type: "in", when: "-1 18:35" },
    { who: "010-0000-2931", type: "missed", when: "-2 14:12", place: "Seoul" },
    { who: "manager", type: "in", when: "-3 10:02" },
    { who: "jiminie", type: "in", when: "-4 23:51" },
    { who: "eomma", type: "out", when: "-6 19:26" },
  ],

  voicemail: [
    {
      who: "jiminie",
      when: "-0 03:05",
      duration: 21,
      heard: false,
      transcript: "Halo… kamu udah tidur ya? Gapapa. Aku cuma mau denger suara kamu sebentar. Besok aku telepon lagi.",
      audio: "",
    },
    {
      who: "eomma",
      when: "-6 19:20",
      duration: 14,
      heard: true,
      transcript: "Minjeong-ah, eomma kirim lauk ke dorm ya. Jangan lupa dimakan.",
      audio: "",
    },
  ],
};
