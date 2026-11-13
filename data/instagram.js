/* ============================================================
   ISI APP INSTAGRAM — data di bawah hanya CONTOH.

   me      : akun pemilik HP (tab profil).
   users   : akun lain. Kuncinya (mis. "jiminie") dipakai di stories, feed, dms.
   stories : lingkaran di atas feed. Tiap story punya beberapa `items`
             (foto + teks opsional). user: "me" = story sendiri.
   feed    : post di beranda, yang paling atas tampil duluan.
             img   : satu foto "a.jpg" atau beberapa ["a.jpg", "b.jpg"] (bisa digeser)
             liked : true → hati sudah merah
             comments : [["username", "isi komentar"], ...]
   posts   : post milik sendiri (kotak-kotak di tab profil), terbaru di atas.
   dms     : pesan langsung. ["t", "..."] dari dia, ["m", "..."] dari kamu,
             ["t", { img: "..." }] foto. unread = jumlah yang belum dibaca.
   ============================================================ */
window.INSTAGRAM = {
  me: {
    handle: "minjeong",
    name: "Minjeong",
    avatar: "assets/img/avatars/me-img.jpg",
    bio: "jimin's girl 🩵 · pponyo's mom",
    followers: "1,204",
    following: "187",
    private: true,
  },

  users: {
    jiminie: { handle: "jiminie", name: "Jimin", avatar: "assets/img/avatars/jimin-img.jpg" },
    pponyo: { handle: "pponyo.daily", name: "Pponyo", avatar: "assets/img/gallery/blue-plush-toys.jpg" },
  },

  stories: [
    {
      user: "jiminie",
      time: "2h",
      items: [
        { img: "assets/img/gallery/ferris-wheel-sun.jpg", text: "kangen ke sini" },
        { img: "assets/img/gallery/seagull-on-water.jpg", text: "" },
      ],
    },
    {
      user: "pponyo",
      time: "5h",
      items: [{ img: "assets/img/gallery/plush-in-hand.jpg", text: "teman baru" }],
    },
  ],

  feed: [
    {
      user: "jiminie",
      img: ["assets/img/gallery/canopy-from-below.jpg", "assets/img/gallery/look-up-trees.jpg"],
      likes: 482,
      liked: true,
      caption: "jalan pagi 🌿",
      comments: [
        ["minjeong", "kok ga ngajak"],
        ["jiminie", "kamu masih tidur 😌"],
      ],
      time: "3 hours ago",
    },
    {
      user: "me",
      img: "assets/img/gallery/glazed-donuts.jpg",
      likes: 311,
      liked: false,
      caption: "cheat day",
      comments: [["jiminie", "sisain satu"]],
      time: "1 day ago",
    },
    {
      user: "pponyo",
      img: "assets/img/gallery/blue-plush-toys.jpg",
      likes: 97,
      liked: false,
      caption: "koleksi nambah lagi",
      comments: [],
      time: "2 days ago",
    },
  ],

  posts: [
    { img: "assets/img/gallery/glazed-donuts.jpg", likes: 311, caption: "cheat day", comments: [["jiminie", "sisain satu"]], time: "1 day ago" },
    { img: "assets/img/gallery/balcony-summer-1.jpg", likes: 1048, caption: "☀️", comments: [["jiminie", "🩵"]], time: "November 4" },
    { img: "assets/img/gallery/teacup-and-cookies.jpg", likes: 402, caption: "tea time", comments: [], time: "October 23" },
    { img: "assets/img/gallery/seagull-on-water.jpg", likes: 366, caption: "", comments: [], time: "October 19" },
    { img: "assets/img/gallery/mirror-selfie-lilac.jpg", likes: 1290, caption: "lilac", comments: [], time: "October 9" },
    { img: "assets/img/gallery/hair-tie-pose.jpg", likes: 987, caption: "", comments: [], time: "October 5" },
    { img: "assets/img/gallery/ferris-wheel-sun.jpg", likes: 540, caption: "golden hour", comments: [], time: "September 29" },
    { img: "assets/img/gallery/clover-macro.jpg", likes: 298, caption: "🍀", comments: [], time: "September 9" },
    { img: "assets/img/gallery/studio-white-dress.jpg", likes: 1502, caption: "", comments: [], time: "August 30" },
  ],

  dms: [
    {
      user: "jiminie",
      unread: 1,
      time: "2h",
      messages: [
        ["t", { img: "assets/img/gallery/ferris-wheel-sun.jpg" }],
        ["t", "inget ini ga"],
        ["m", "inget lah"],
        ["m", "kapan ke sana lagi"],
        ["t", "minggu depan?"],
      ],
    },
    {
      user: "pponyo",
      unread: 0,
      time: "3d",
      messages: [
        ["m", "siapa yang megang akun ini 😭"],
        ["t", "rahasia 🐶"],
      ],
    },
  ],
};
