/* ============================================================
   ISI APP MESSAGES — semua teks di bawah hanya CONTOH, ganti
   dengan ceritamu sendiri.

   Satu baris pesan:
     ["d", "Yesterday 9:12 PM"]            pemisah waktu
     ["t", "teks"]                         dari DIA  (kiri, abu-abu)
     ["m", "teks"]                         dari KAMU (kanan, biru)
     ["t", { img: "path/foto.jpg" }]       foto (boleh ditambah text: "...")

   unread : jumlah pesan terakhir dari dia yang belum dibaca.
            Pesan itu tampil sebagai notifikasi di lock screen
            dan jadi angka merah di ikon Messages.
   time   : jam / hari yang tampil di daftar chat.
   status : tulisan kecil di bawah pesan terakhirmu ("Delivered", "Read 9:20 PM").

   script : bagian INTERAKTIF. Tiap langkah berisi pilihan balasan
            yang bisa diketuk pembaca; `reply` = balasan dia.
              { choices: [ { say: "...", reply: ["...", "..."] }, ... ] }
            Tambahan (opsional):
              id: "nama"            nama langkah
              goto: "nama" | "end"  lompat ke langkah lain / selesai
            Tanpa goto, cerita lanjut ke langkah berikutnya.

   incoming : pesan yang masuk sendiri beberapa detik setelah HP dibuka.
   ============================================================ */
window.MESSAGES = {
  chats: [
    {
      id: "jiminie",
      name: "Jiminie",
      avatar: "assets/img/avatars/jimin-img.jpg",
      time: "3:02 AM",
      unread: 2,
      messages: [
        ["d", "Yesterday 9:12 PM"],
        ["t", "udah sampe rumah?"],
        ["m", "udah, baru aja"],
        ["m", { img: "assets/img/gallery/window-rain-day.jpg" }],
        ["m", "hujan terus dari tadi"],
        ["t", "jangan lupa makan ya"],
        ["t", "terus istirahat"],
        ["m", "iyaa"],
        ["d", "Today 3:02 AM"],
        ["t", "kamu udah tidur?"],
        ["t", "1 November. jangan lupa ya 🤍"],
      ],
      script: [
        {
          choices: [
            {
              say: "belum, kenapa?",
              reply: ["gapapa", "cuma kepikiran aja"],
            },
            {
              say: "baru bangun 😭",
              reply: ["maaf ya kebangun", "tidur lagi aja"],
              goto: "end",
            },
          ],
        },
        {
          choices: [
            { say: "kepikiran apa?", reply: ["besok aja ceritanya", "sekarang kamu tidur dulu"] },
            { say: "aku juga", reply: ["🤍"] },
          ],
        },
      ],
    },
    {
      id: "eomma",
      name: "Eomma",
      avatar: "",
      time: "Yesterday",
      status: "Read Yesterday",
      messages: [
        ["d", "Yesterday 6:40 PM"],
        ["t", "minggu ini pulang?"],
        ["m", "belum tau, jadwalnya padat"],
        ["t", "ya sudah, jaga kesehatan"],
        ["m", "iya eomma 🤍"],
      ],
    },
    {
      id: "manager",
      name: "Manager",
      avatar: "",
      time: "Wednesday",
      messages: [
        ["d", "Wednesday 10:15 AM"],
        ["t", "Besok berangkat jam 7 pagi ya."],
        ["t", "Mobil sudah di depan 10 menit sebelumnya."],
        ["m", "oke, siap"],
      ],
    },
  ],

  /* masuk sendiri setelah HP dibuka: after = detik */
  incoming: [{ after: 20, chat: "jiminie", text: "eh kamu bangun?" }],
};
