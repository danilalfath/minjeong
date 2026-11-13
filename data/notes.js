/* ============================================================
   ISI APP NOTES — teks di bawah hanya CONTOH.

   when   : kapan catatan diubah.
            "-0 09:10"          hari ini jam 09:10   (-1 = kemarin, -7 = seminggu lalu)
            "2026-11-08 21:14"  tanggal pasti
   pinned : true  → masuk grup "Pinned" di paling atas
   locked : true  → catatan terkunci, pembaca harus memasukkan kode
   code   : kode khusus catatan itu (kosong = sama dengan kode HP)
   hint   : petunjuk yang muncul setelah 2x salah kode

   body — tiap baris:
     "teks biasa"
     "# Judul kecil"
     "- butir"
     "- [ ] belum dicentang"     "- [x] sudah dicentang"
     "![](assets/img/gallery/foto.jpg)"   foto
   ============================================================ */
window.NOTES = {
  notes: [
    {
      title: "to do",
      when: "-0 09:10",
      pinned: true,
      body: `- [x] latihan vokal
- [x] fitting baju
- [ ] beli makanan Pponyo
- [ ] bales chat eomma
- [ ] tidur sebelum jam 2 (serius)`,
    },
    {
      title: "jangan dikirim",
      when: "-1 02:47",
      locked: true,
      code: "",
      hint: "",
      body: `kadang aku pengen bilang semuanya.
tapi tiap mau ngetik, rasanya belum waktunya.

yaudah, disimpen di sini aja dulu.`,
    },
    {
      title: "wishlist",
      when: "-4 20:15",
      body: `- kamera film
- liburan ke Busan
- sehari penuh tanpa jadwal
![](assets/img/gallery/ferris-wheel-sun.jpg)`,
    },
    {
      title: "lirik (belum jadi)",
      when: "-12 23:30",
      body: `# verse 1
hujan lagi di jendela
aku hitung satu-satu

# chorus
(belum ketemu)`,
    },
  ],
};
