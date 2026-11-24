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

   bot    : balasan bebas. `replies` dicocokkan berurutan; tiap pilihan
            berisi beberapa gelembung. `fallback` dipakai kalau tidak cocok.

   incoming : pesan yang masuk sendiri beberapa detik setelah HP dibuka.
   ============================================================ */
window.MESSAGES = {
  chats: [
    {
      id: "jiminie",
      name: "Jiminie",
      avatar: "assets/img/avatars/jimin-img.jpg",
      time: "Today",
      unread: 1,
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
        ["d", "Later"],
        ["t", "winnn"],
        ["t", "aku barusan lewat depan gedung dkv nih, kebetulan bgt beli matcha kebanyakan satu 👀"],
        ["t", "kamu masih di dalam gaaa?"],
      ],
      bot: {
        replies: [
          [/\b(?:capek|cape|lelah|ngantuk|pusing|begadang|istirahat)\b/, [
            ["yah mba dkv 😭", "aku temenin aja ya? kamu nggak harus ngobrol kok"],
            ["win, kamu istirahat dulu yaaa", "aku bisa duduk sebelah kamu sambil ngerjain denah"],
          ]],
          [/\b(?:otw|turun|nyusul|tunggu|bentar|lobi|depan)\b/, [
            ["iyaaa aku tunggu di lobi", "santai win, aku sama matchanya nggak ke mana-mana 👀"],
            ["siap mba dkv", "aku deket pintu masuk yaaa, yang bawa tabung gambar segede gaban wkwk"],
          ]],
          [/\b(?:matcha|kopi|minum|manis|es)(?:nya)?\b/, [
            ["matchanya less sugar kok", "aku inget kamu nggak suka kemanisan 👀"],
            ["iyaaa satu buat kamu", "aku kan kebetulan beli dua. kebetulan banget malah wkwk"],
          ]],
          [/\b(?:tugas|revisi|maket|denah|layout|tipografi|gambar|nugas|deadline)(?:nya|ku|mu)?\b/, [
            ["aku juga baru dicoret denahnya 😭", "nugas bareng di kafe depan gerbang yuk, biar nggak stres sendiri-sendiri"],
            ["sini kalo mau tukeran liat progres", "tapi jangan ketawain maket aku yang miring ya win 😭"],
          ]],
          [/\b(?:makan|laper|lapar|roti|kantin)\b/, [
            ["udah makan belummm?", "aku mau ke kantin teknik nih", "kalo kamu mau, aku bawain roti keju juga 🫶"],
            ["aku juga belum makan dari tadi 😭", "ke kantin bareng nggak, win?"],
          ]],
          [/\b(?:udah pulang|pulang|di rumah|nggak bisa|gak bisa|ga bisa|lagi sibuk)\b/, [
            ["gapapa win, lain kali ajaaa", "kamu kabarin aku kalo udah senggang ya"],
            ["yah kelewatan wkwk", "yaudah aku nggak ganggu dulu ya, win"],
          ]],
          [/\b(?:cakep|cantik|lucu|galak|kangen|salting|gemes)\b/, [
            ["ih gitu ya mba dkv", "kamu berani ngomong gitu kalo aku udah di depan kamu nggak? 👀"],
            ["wkwkwk tumben kamu manis", "aku screenshot dulu boleh nggak 👀"],
          ]],
          [/\b(?:studio|dalam|kelas|perpus|masih|msh|belum|blm)\b/, [
            ["nah ketemu anak ilangnya", "aku boleh naik nggak, win?"],
            ["oh masih di situu", "aku bawain aja ya, kamu nggak usah turun 🫶"],
          ]],
        ],
        fallback: [
          ["wkwk kamu ada-ada aja win", "aku boleh duduk sebelah kamu bentar nggak?"],
          ["hmm, gitu ya mba dkv 👀", "kamu lagi ngapain sekarang?"],
          ["eh aku belum cerita ya", "maketku miring lagi tadi 😭 kamu mau liat nggak?"],
        ],
      },
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
};
