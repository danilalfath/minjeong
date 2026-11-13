/* ============================================================
   ISI GALERI (app Photos)

   Satu baris = satu foto:
     ["path/foto.jpg", "TAHUN-BULAN-TANGGAL", "nama album"]

   - Jam boleh ditambahkan: "2026-11-08 14:51". Kalau tidak diisi,
     jamnya dibuat otomatis (selalu sama untuk foto yang sama).
   - Tanggal juga bisa relatif: "-1" = kemarin, "-0 23:10" = hari ini 23:10.
   - Elemen ke-4 (opsional) untuk detail & rahasia:
       { caption: "teks", place: "Seoul" }  → tampil di panel info (tombol ⓘ)
       { hidden: true }   → hanya muncul di album Hidden (terkunci)
       { deleted: true }  → hanya muncul di Recently Deleted (terkunci)
     Kode kuncinya diatur di data/config.js (photosCode).
   - Urutan baris bebas; galeri mengurutkan sendiri berdasarkan tanggal.
   - Menambah foto: taruh filenya di assets/img/gallery/ lalu tambah baris.
   - `albums` menentukan urutan album yang tampil. Nama album di foto
     harus sama persis dengan nama di daftar `albums`.
   ============================================================ */
window.PHOTOS = {
  albums: ["Candid", "Portraits", "Places", "Food", "Collectibles", "Scenery", "Streets"],

  photos: [
    ["assets/img/gallery/blurry-mirror-selfie.jpg", "2026-11-08", "Candid", { caption: "nunggu jemputan", place: "Seoul" }],
    ["assets/img/gallery/portrait-close-up.jpg", "2026-11-06", "Portraits", { caption: "difotoin jimin" }],
    ["assets/img/gallery/balcony-summer-1.jpg", "2026-11-04", "Portraits"],
    ["assets/img/gallery/balcony-summer-2.jpg", "2026-11-02", "Portraits"],
    ["assets/img/gallery/balcony-summer-3.jpg", "2026-10-31", "Portraits"],
    ["assets/img/gallery/sake-bottle.jpg", "2026-10-29", "Places"],
    ["assets/img/gallery/glazed-donuts.jpg", "2026-10-27", "Food"],
    ["assets/img/gallery/bar-pink-light.jpg", "2026-10-25", "Portraits", { hidden: true, caption: "jangan sampai ada yang lihat" }],
    ["assets/img/gallery/teacup-and-cookies.jpg", "2026-10-23", "Food"],
    ["assets/img/gallery/plush-in-hand.jpg", "2026-10-21", "Collectibles"],
    ["assets/img/gallery/seagull-on-water.jpg", "2026-10-19", "Scenery"],
    ["assets/img/gallery/burger-and-fries.jpg", "2026-10-17", "Food"],
    ["assets/img/gallery/blue-plush-toys.jpg", "2026-10-15", "Collectibles"],
    ["assets/img/gallery/korean-table-spread.jpg", "2026-10-13", "Food"],
    ["assets/img/gallery/canopy-from-below.jpg", "2026-10-11", "Scenery"],
    ["assets/img/gallery/mirror-selfie-lilac.jpg", "2026-10-09", "Portraits"],
    ["assets/img/gallery/look-up-trees.jpg", "2026-10-07", "Scenery"],
    ["assets/img/gallery/hair-tie-pose.jpg", "2026-10-05", "Portraits"],
    ["assets/img/gallery/black-tee-portrait.jpg", "2026-10-03", "Portraits"],
    ["assets/img/gallery/shopping-cart-ride.jpg", "2026-10-01", "Candid"],
    ["assets/img/gallery/ferris-wheel-sun.jpg", "2026-09-29", "Scenery"],
    ["assets/img/gallery/banquet-table.jpg", "2026-09-27", "Food"],
    ["assets/img/gallery/toast-and-syrup.jpg", "2026-09-25", "Food"],
    ["assets/img/gallery/street-winter-coat.jpg", "2026-09-23", "Streets"],
    ["assets/img/gallery/pineapple-juice.jpg", "2026-09-21", "Food"],
    ["assets/img/gallery/alley-full-body.jpg", "2026-09-19", "Portraits"],
    ["assets/img/gallery/dessert-bowl.jpg", "2026-09-17", "Food"],
    ["assets/img/gallery/fashion-black-set.jpg", "2026-09-15", "Portraits"],
    ["assets/img/gallery/arcade-cabinets.jpg", "2026-09-13", "Places"],
    ["assets/img/gallery/leather-jacket.jpg", "2026-09-11", "Portraits"],
    ["assets/img/gallery/clover-macro.jpg", "2026-09-09", "Scenery"],
    ["assets/img/gallery/denim-clover.jpg", "2026-09-07", "Candid"],
    ["assets/img/gallery/korean-signage.jpg", "2026-09-05", "Places"],
    ["assets/img/gallery/bibimbap-side-dish.jpg", "2026-09-03", "Food"],
    ["assets/img/gallery/glazed-chicken.jpg", "2026-09-01", "Food"],
    ["assets/img/gallery/studio-white-dress.jpg", "2026-08-30", "Portraits"],
    ["assets/img/gallery/lying-on-track.jpg", "2026-08-28", "Candid"],
    ["assets/img/gallery/window-rain-day.jpg", "2026-08-26", "Candid"],
    ["assets/img/gallery/braised-pork.jpg", "2026-08-24", "Food"],
    ["assets/img/gallery/dark-portrait.jpg", "2026-08-22", "Portraits", { hidden: true }],
    ["assets/img/gallery/blonde-close-up.jpg", "2026-08-20", "Portraits"],
    ["assets/img/gallery/resting-floor.jpg", "2026-08-18", "Candid", { deleted: true }],
    ["assets/img/gallery/backpack-street.jpg", "2026-08-16", "Candid"],
    ["assets/img/gallery/motion-blur-2.jpg", "2026-08-14", "Candid", { deleted: true }],
  ],
};
