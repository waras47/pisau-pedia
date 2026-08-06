import { type BlogCategory, type BlogPost } from "./blog.types";

// Categories mirror the "Guides" sub-menu under Learn in the main nav
// (entities/navigation/model/navigation.data.ts) — slugs must match.
export const categories: BlogCategory[] = [
  {
    slug: "knife-types",
    name: { en: "Knife Types", id: "Jenis Pisau" },
    description: {
      en: "A guide to the traditional Japanese blade shapes — what each one is built for, and how to tell them apart.",
      id: "Panduan bentuk bilah gaya Jepang — untuk apa masing-masing dibuat, dan cara membedakannya.",
    },
  },
  {
    slug: "sharpening-guide",
    name: { en: "Sharpening Guide", id: "Panduan Mengasah" },
    description: {
      en: "Whetstone grits, bevel angles, and technique — everything for keeping an edge that actually cuts.",
      id: "Grit batu asah, sudut bevel, dan teknik — semua yang perlu diketahui supaya mata pisau benar-benar tajam.",
    },
  },
  {
    slug: "steel-care",
    name: { en: "Steel & Care", id: "Baja & Perawatan" },
    description: {
      en: "Carbon vs. stainless, patina, rust prevention, and the small habits that keep a blade in good shape for decades.",
      id: "Karbon vs stainless, patina, pencegahan karat, dan kebiasaan kecil yang menjaga pisau tetap prima puluhan tahun.",
    },
  },
];

export const posts: BlogPost[] = [
  {
    slug: "gyuto-santoku-bunka-which-first",
    title: {
      en: "Gyuto, Santoku, or Bunka? Choosing Your First Japanese Chef's Knife",
      id: "Gyuto, Santoku, atau Bunka? Memilih Pisau Koki Bergaya Jepang Pertama Anda",
    },
    excerpt: {
      en: "The three most common multi-purpose Japanese knives look similar at a glance but handle very differently. Here's how to tell them apart.",
      id: "Tiga pisau serbaguna bergaya Jepang yang paling umum ini terlihat mirip sekilas, tapi terasa sangat berbeda saat dipakai. Berikut cara membedakannya.",
    },
    categorySlug: "knife-types",
    readingMinutes: 6,
    publishedAt: "2026-05-12",
    image: "/dev-images/blog/gyuto-santoku-bunka.jpg",
    content: {
      en: [
        "If you're buying your first Japanese chef's knife, you'll almost certainly end up choosing between a Gyuto, a Santoku, or a Bunka. All three are marketed as \"multi-purpose\" knives, and all three can genuinely handle most kitchen tasks — but the blade geometry behind each one leads to a noticeably different feel in hand.",
        "The Gyuto is the closest in shape to a Western chef's knife: a long, gently curved blade that tapers to a fine point, typically 210mm to 270mm. That curve is what lets you rock the knife through a rolling cutting motion — the same technique most home cooks already know from a Western knife. If you're coming from a standard chef's knife and want something that feels familiar but sharper and lighter, the Gyuto is the safest starting point.",
        "The Santoku trades length and curve for a flatter edge and a more rounded, less pointed tip. \"Santoku\" roughly translates to \"three virtues,\" referring to its balance across meat, fish, and vegetables. Because the edge is flatter, it favors an up-and-down chopping motion rather than a rocking one — some cooks find this more natural, especially on a cutting board that doesn't have much room for a rocking stroke.",
        "The Bunka looks like a Santoku at first glance but has a distinctive angled, reverse-tanto tip — a straight facet cutting back to the point instead of a smooth curve. That reinforced tip point makes the Bunka noticeably better at detail work: trimming, scoring, and other tasks where you're using just the tip of the blade rather than the whole edge.",
        "In practice, the difference between a Santoku and a Bunka matters less than the difference between either of those and a Gyuto. If your cutting technique already relies on rocking the blade, a Gyuto will feel more natural immediately. If you tend to lift the knife off the board between cuts, a Santoku or Bunka will likely feel just as comfortable, with the Bunka's tip giving you a bit more precision for finer work.",
        "None of these shapes is objectively \"better\" — they're suited to different techniques, and most serious home cooks eventually own more than one. If you're only buying one knife, though, think about how you actually cut before you think about the blade's country of origin or steel type.",
      ],
      id: [
        "Kalau Anda membeli pisau koki bergaya Jepang pertama, hampir pasti Anda akan memilih di antara Gyuto, Santoku, atau Bunka. Ketiganya dipasarkan sebagai pisau \"serbaguna\", dan ketiganya memang bisa menangani sebagian besar pekerjaan dapur — tapi geometri bilah di balik masing-masing membuat rasa di tangan jelas berbeda.",
        "Gyuto paling mirip bentuknya dengan pisau koki gaya Barat: bilah panjang yang melengkung lembut dan meruncing ke ujung tipis, biasanya 210mm sampai 270mm. Lengkungan itulah yang memungkinkan Anda mengayunkan pisau dengan gerakan memotong bergulir — teknik yang sama yang sudah dikenal kebanyakan orang dari pisau koki gaya Barat. Kalau Anda terbiasa pakai pisau koki standar dan ingin sesuatu yang terasa familiar tapi lebih tajam dan ringan, Gyuto adalah titik awal paling aman.",
        "Santoku mengorbankan panjang dan lengkungan demi mata pisau yang lebih rata dan ujung yang lebih bulat, tidak terlalu runcing. \"Santoku\" kurang lebih berarti \"tiga kebajikan\", merujuk pada keseimbangannya dalam memotong daging, ikan, dan sayuran. Karena mata pisaunya lebih rata, gerakan yang cocok adalah naik-turun, bukan bergulir — sebagian orang merasa ini lebih alami, terutama di talenan yang tidak cukup ruang untuk gerakan bergulir.",
        "Bunka sekilas mirip Santoku, tapi punya ujung reverse-tanto yang khas — bidang lurus yang memotong balik ke ujung, bukan lengkungan halus. Ujung yang diperkuat itu membuat Bunka jauh lebih unggul untuk pekerjaan detail: memangkas, menggores, dan tugas lain yang cuma memakai ujung bilah, bukan seluruh mata pisau.",
        "Dalam praktiknya, perbedaan antara Santoku dan Bunka tidak sebesar perbedaan keduanya dengan Gyuto. Kalau teknik memotong Anda sudah mengandalkan gerakan bergulir, Gyuto akan langsung terasa lebih alami. Kalau Anda cenderung mengangkat pisau dari talenan di antara potongan, Santoku atau Bunka kemungkinan sama nyamannya, dengan ujung Bunka memberi sedikit lebih presisi untuk pekerjaan halus.",
        "Tidak ada satupun bentuk ini yang secara objektif \"lebih baik\" — masing-masing cocok untuk teknik yang berbeda, dan kebanyakan orang yang serius memasak di rumah akhirnya punya lebih dari satu. Tapi kalau Anda cuma membeli satu pisau, pikirkan dulu bagaimana Anda benar-benar memotong, sebelum memikirkan asal negara bilah atau jenis bajanya.",
      ],
    },
  },
  {
    slug: "nakiri-vs-usuba",
    title: {
      en: "Nakiri vs. Usuba: Understanding Japanese Vegetable Knives",
      id: "Nakiri vs Usuba: Memahami Pisau Sayur Bergaya Jepang",
    },
    excerpt: {
      en: "Both are built specifically for vegetables, but one is a double-bevel knife anyone can pick up, and the other takes real practice.",
      id: "Keduanya dirancang khusus untuk sayuran, tapi yang satu pisau double-bevel yang bisa langsung dipakai siapa saja, yang satu lagi butuh latihan sungguhan.",
    },
    categorySlug: "knife-types",
    readingMinutes: 5,
    publishedAt: "2026-05-28",
    image: "/dev-images/blog/nakiri-vs-usuba.jpg",
    content: {
      en: [
        "Most Japanese knife shapes are multi-purpose by design, but vegetable prep gets a category of its own: the rectangular, flat-edged blades built specifically for clean, straight cuts through produce. The two you'll come across are the Nakiri and the Usuba, and while they look similar, they're built for very different skill levels.",
        "The Nakiri is double-beveled — sharpened symmetrically on both sides, like almost every Western knife you've used. That makes it approachable: you can use it the same way you'd use any other kitchen knife, no adjustment in technique required. The flat edge and rectangular profile are what make it excel at vegetables specifically — a straight push cut all the way through, rather than the rocking motion a curved blade encourages, which keeps slices even and prevents the accordion effect you sometimes get with a curved edge on soft produce.",
        "The Usuba is the traditional, professional counterpart — single-beveled, sharpened on one side only with the other side left flat. A single bevel lets the edge get thinner and sharper than a comparable double-bevel blade can, and it's part of why professional Japanese chefs favor it for fine work like katsuramuki, the technique of peeling a continuous, paper-thin ribbon from a whole daikon radish.",
        "That single bevel is also why the Usuba isn't a knife you casually pick up. It cuts with a slight lateral drift unless your technique compensates for it, and sharpening a single-bevel edge correctly takes real practice — you're maintaining one flat face and one beveled face, not two symmetric bevels. Most home cooks who buy an Usuba without prior single-bevel experience end up frustrated with results a Nakiri would have given them more easily.",
        "For nearly all home kitchens, the Nakiri is the better choice — it delivers the flat-edge, straight-cut advantage for vegetable prep without demanding a change in how you already hold and use a knife. The Usuba is worth considering only if you're already comfortable with single-bevel sharpening, or specifically want to learn it.",
      ],
      id: [
        "Kebanyakan bentuk pisau bergaya Jepang memang dirancang serbaguna, tapi persiapan sayuran punya kategori tersendiri: bilah persegi panjang bermata rata yang dibuat khusus untuk potongan bersih dan lurus pada sayuran. Dua yang paling sering ditemui adalah Nakiri dan Usuba — bentuknya mirip, tapi dirancang untuk level keterampilan yang sangat berbeda.",
        "Nakiri bermata dua sisi (double-bevel) — diasah simetris di kedua sisi, seperti hampir semua pisau gaya Barat yang biasa Anda pakai. Itu membuatnya mudah didekati: Anda bisa memakainya sama seperti pisau dapur lain, tanpa perlu menyesuaikan teknik. Mata pisau yang rata dan profil persegi panjang inilah yang membuatnya unggul khusus untuk sayuran — potongan dorong lurus menembus penuh, bukan gerakan bergulir yang biasanya didorong oleh bilah melengkung, sehingga irisan tetap rata dan mencegah efek \"akordeon\" yang kadang muncul kalau memotong sayuran lunak dengan mata pisau melengkung.",
        "Usuba adalah versi tradisional dan profesionalnya — bermata satu sisi (single-bevel), diasah hanya di satu sisi sementara sisi lainnya dibiarkan rata. Mata satu sisi ini membuat bilahnya bisa jadi lebih tipis dan tajam dibanding bilah double-bevel sejenis, dan ini salah satu alasan koki profesional Jepang menyukainya untuk pekerjaan halus seperti katsuramuki, teknik mengupas lobak daikon utuh jadi lembaran setipis kertas yang menyambung.",
        "Mata satu sisi itu juga alasan kenapa Usuba bukan pisau yang bisa asal dipakai. Ia memotong dengan sedikit melenceng ke samping kalau teknik Anda tidak mengompensasinya, dan mengasah mata satu sisi dengan benar butuh latihan sungguhan — Anda menjaga satu bidang rata dan satu bidang bevel, bukan dua bevel simetris. Kebanyakan orang yang membeli Usuba tanpa pengalaman single-bevel sebelumnya akhirnya frustrasi dengan hasil yang sebenarnya bisa didapat lebih mudah dari Nakiri.",
        "Untuk hampir semua dapur rumah, Nakiri adalah pilihan yang lebih baik — ia memberi keunggulan mata rata dan potongan lurus untuk persiapan sayuran tanpa menuntut perubahan cara Anda memegang dan memakai pisau selama ini. Usuba baru layak dipertimbangkan kalau Anda sudah nyaman dengan pengasahan single-bevel, atau memang ingin mempelajarinya.",
      ],
    },
  },
  {
    slug: "whetstone-grits-explained",
    title: {
      en: "Whetstone Grits Explained: From Repair to Polish",
      id: "Grit Batu Asah Dijelaskan: Dari Perbaikan sampai Poles",
    },
    excerpt: {
      en: "Grit numbers on a whetstone box aren't just \"coarse to fine\" — each range does a specific job, and using the wrong one wastes steel.",
      id: "Angka grit di kotak batu asah bukan sekadar \"kasar ke halus\" — tiap rentang punya fungsi spesifik, dan salah pakai cuma memboroskan baja.",
    },
    categorySlug: "sharpening-guide",
    readingMinutes: 7,
    publishedAt: "2026-06-03",
    image: "/dev-images/blog/whetstone-grits.jpg",
    content: {
      en: [
        "Every whetstone is labeled with a grit number, and it's tempting to think of that number as a simple coarse-to-fine scale where higher is always \"better.\" In practice, each grit range does a specific job, and skipping straight to a high grit on a knife that needs real repair just wastes time polishing an edge that was never properly reshaped underneath.",
        "Grits from roughly 220 to 600 are repair stones — coarse enough to remove real steel quickly. You'd reach for one of these if a blade has a chip, a badly rolled edge, or has gone so long between sharpenings that the bevel needs to be reshaped from scratch. This stage isn't about sharpness; it's about correcting geometry so the following stages have something even to work with.",
        "The 1000 to 3000 range is where most routine sharpening happens. If your knife is already in reasonable shape and has just lost its edge through normal use, this is where you'll spend most of your time — refining the bevel and raising a consistent burr along the entire edge before moving on.",
        "From 3000 upward, you're polishing rather than sharpening. Stones in the 3000–8000 range refine the edge left by the previous stage, remove the microscopic scratches from coarser grits, and bring the bevel to a finer, more reflective finish. Beyond 8000, you're firmly in the territory of mirror polishing — it looks impressive and does slightly reduce friction through food, but it contributes very little to actual cutting performance once you're past around 6000.",
        "A practical three-stone setup covers nearly everything: a 400–600 stone for occasional repair work, a 1000–2000 stone for regular maintenance sharpening, and something in the 3000–6000 range if you want a noticeably cleaner finish. You don't need every grit in between — you need the right one for the condition the edge is actually in.",
        "One habit worth building regardless of grit: always flatten your stone before use, especially the stones you sharpen with most often. A stone that's worn into a slight dip won't hold a consistent angle across the length of the blade, and no amount of technique fixes an edge sharpened against an uneven surface.",
      ],
      id: [
        "Setiap batu asah diberi label angka grit, dan gampang untuk menganggap angka itu sekadar skala kasar-ke-halus di mana makin tinggi selalu makin \"bagus\". Padahal, tiap rentang grit punya fungsi spesifik, dan langsung lompat ke grit tinggi pada pisau yang butuh perbaikan sungguhan cuma membuang waktu memoles mata pisau yang belum pernah dibentuk ulang dengan benar di baliknya.",
        "Grit sekitar 220 sampai 600 adalah batu perbaikan — cukup kasar untuk mengikis baja dengan cepat. Anda memakainya kalau bilah ada yang sompel, mata pisau tergulung parah, atau sudah terlalu lama tidak diasah sampai bevel-nya perlu dibentuk ulang dari nol. Tahap ini bukan soal ketajaman; ini soal membetulkan geometri supaya tahap berikutnya punya permukaan yang rata untuk dikerjakan.",
        "Rentang 1000 sampai 3000 adalah tempat kebanyakan pengasahan rutin terjadi. Kalau pisau Anda sudah dalam kondisi wajar dan cuma kehilangan ketajaman karena pemakaian normal, di sinilah Anda akan menghabiskan sebagian besar waktu — menghaluskan bevel dan membentuk burr yang konsisten di sepanjang mata pisau sebelum lanjut ke tahap berikutnya.",
        "Dari 3000 ke atas, Anda sedang memoles, bukan mengasah. Batu di rentang 3000–8000 menghaluskan mata pisau hasil tahap sebelumnya, menghilangkan goresan mikroskopis dari grit yang lebih kasar, dan membawa bevel ke hasil akhir yang lebih halus dan mengilap. Di atas 8000, Anda sudah masuk wilayah poles cermin — terlihat mengesankan dan sedikit mengurangi gesekan saat memotong makanan, tapi kontribusinya pada performa potong sesungguhnya sangat kecil begitu Anda melewati sekitar 6000.",
        "Set tiga batu asah yang praktis sudah mencakup hampir semuanya: batu 400–600 untuk pekerjaan perbaikan sesekali, batu 1000–2000 untuk pengasahan rutin, dan sesuatu di rentang 3000–6000 kalau Anda ingin hasil akhir yang jelas lebih halus. Anda tidak perlu semua grit di antaranya — Anda perlu yang tepat sesuai kondisi mata pisau saat itu.",
        "Satu kebiasaan yang layak dibangun apapun grit-nya: selalu ratakan batu asah sebelum dipakai, terutama batu yang paling sering Anda gunakan. Batu yang aus jadi sedikit cekung tidak akan menjaga sudut yang konsisten di sepanjang bilah, dan tidak ada teknik yang bisa memperbaiki mata pisau yang diasah di atas permukaan yang tidak rata.",
      ],
    },
  },
  {
    slug: "finding-the-right-sharpening-angle",
    title: {
      en: "Finding the Right Sharpening Angle for Your Knife",
      id: "Menemukan Sudut Pengasahan yang Tepat untuk Pisau Anda",
    },
    excerpt: {
      en: "Japanese and Western knives are typically ground to different bevel angles — matching your technique to the knife matters more than any single \"correct\" number.",
      id: "Pisau bergaya Jepang dan Barat biasanya diasah dengan sudut bevel yang berbeda — menyesuaikan teknik dengan pisaunya lebih penting daripada angka \"benar\" tunggal manapun.",
    },
    categorySlug: "sharpening-guide",
    readingMinutes: 6,
    publishedAt: "2026-06-14",
    image: "/dev-images/blog/sharpening-angle.jpg",
    content: {
      en: [
        "Bevel angle is one of the most-argued numbers in knife sharpening, and part of the confusion is that there genuinely isn't one correct answer — it depends on what the knife was ground to in the first place. Get the angle wrong relative to the existing bevel and you'll either fail to reach the actual edge, or you'll grind away far more steel than necessary reshaping it to a new angle.",
        "Traditional Japanese knives are typically ground to a narrower angle than their Western counterparts — often somewhere around 12 to 15 degrees per side. That narrower angle is part of why Japanese blades can take a noticeably sharper, finer edge: less steel behind the cutting edge means less resistance moving through food. The trade-off is that a thinner edge is also more prone to chipping if it meets something hard, like bone, or is used carelessly on a glass or stone surface.",
        "Western knives are usually ground wider, in the 17 to 20 degree range per side. That extra steel behind the edge makes it more durable and more forgiving of rougher use, at some cost to how fine an edge it can ultimately hold. Neither angle is objectively better — they represent different trade-offs between sharpness and durability, and the right one depends on how the knife is actually used.",
        "The practical takeaway: before sharpening any knife, take a moment to look at the existing bevel rather than assuming a number. Hold the blade up and look at the reflective bevel face against the light — you can usually see roughly how wide it already is. Match that angle as closely as you can rather than picking a fresh number, unless you deliberately intend to reprofile the edge.",
        "Consistency matters more than precision to the degree. A stable 15-degree angle held evenly along the whole edge will out-cut a technically \"correct\" angle that wanders up and down the blade. If you're sharpening freehand and struggling with consistency, an angle guide clipped to the spine of the blade is a reasonable crutch while you build the muscle memory — there's no prize for doing it without one.",
      ],
      id: [
        "Sudut bevel adalah salah satu angka yang paling sering diperdebatkan dalam mengasah pisau, dan sebagian kebingungannya karena memang tidak ada satu jawaban yang benar — semua tergantung pada sudut asal bilah itu dibuat. Salah menentukan sudut relatif terhadap bevel yang sudah ada, dan Anda bisa gagal mencapai mata pisau yang sesungguhnya, atau malah mengikis jauh lebih banyak baja dari yang perlu untuk membentuknya ulang ke sudut baru.",
        "Pisau tradisional bergaya Jepang biasanya diasah dengan sudut yang lebih sempit dibanding pisau Barat — sering di kisaran 12 sampai 15 derajat per sisi. Sudut yang lebih sempit itu salah satu alasan bilah bergaya Jepang bisa mencapai mata pisau yang jauh lebih tajam dan halus: lebih sedikit baja di belakang mata pisau berarti lebih sedikit hambatan saat menembus makanan. Kompensasinya, mata pisau yang lebih tipis juga lebih rentan sompel kalau kena benda keras seperti tulang, atau dipakai sembarangan di permukaan kaca atau batu.",
        "Pisau Barat biasanya diasah lebih lebar, di kisaran 17 sampai 20 derajat per sisi. Baja ekstra di belakang mata pisau itu membuatnya lebih tahan banting dan lebih memaafkan pemakaian yang kasar, dengan sedikit kompensasi pada seberapa tajam mata pisau bisa dipertahankan. Tidak ada sudut yang secara objektif lebih baik — keduanya mewakili kompensasi berbeda antara ketajaman dan ketahanan, dan mana yang tepat tergantung bagaimana pisau itu benar-benar dipakai.",
        "Intinya secara praktis: sebelum mengasah pisau apapun, luangkan waktu untuk melihat bevel yang sudah ada, bukan asal menebak angka. Angkat bilah dan lihat bidang bevel yang memantulkan cahaya — biasanya Anda bisa melihat kira-kira seberapa lebar bevel itu sekarang. Cocokkan sudut itu semirip mungkin, alih-alih memilih angka baru, kecuali Anda memang sengaja ingin membentuk ulang mata pisaunya.",
        "Konsistensi lebih penting daripada presisi sampai ke angka derajat. Sudut 15 derajat yang stabil dan terjaga merata di sepanjang mata pisau akan mengalahkan sudut yang secara teknis \"benar\" tapi naik-turun di sepanjang bilah. Kalau Anda mengasah dengan tangan bebas dan kesulitan menjaga konsistensi, panduan sudut yang dijepitkan ke punggung bilah adalah bantuan yang wajar selagi Anda membangun kebiasaan otot — tidak ada nilai tambah untuk melakukannya tanpa alat bantu.",
      ],
    },
  },
  {
    slug: "carbon-steel-vs-stainless",
    title: {
      en: "Carbon Steel vs. Stainless: What's the Real Difference?",
      id: "Baja Karbon vs Stainless: Apa Bedanya Sebenarnya?",
    },
    excerpt: {
      en: "It's not just about rust. Carbon and stainless steels behave differently at the edge, and that changes how a knife feels in daily use.",
      id: "Bukan cuma soal karat. Baja karbon dan stainless berperilaku berbeda di mata pisau, dan itu mengubah rasanya saat dipakai sehari-hari.",
    },
    categorySlug: "steel-care",
    readingMinutes: 6,
    publishedAt: "2026-06-20",
    image: "/dev-images/blog/carbon-vs-stainless.jpg",
    content: {
      en: [
        "The carbon-versus-stainless question usually gets reduced to a single point: carbon steel rusts if you're not careful, stainless doesn't. That's true, but it's also the least interesting part of the comparison — the more relevant difference for daily cooking is how each type of steel behaves at the edge, not just how it behaves in the sink.",
        "Carbon steel is generally easier to sharpen and takes a noticeably finer edge than most stainless alloys. The grain structure allows it to be honed to a thinner, more acute bevel that holds up well, and touch-ups on a whetstone go faster because the steel is softer to work. That's a large part of why carbon steel remains the preferred choice among professional Japanese chefs who resharpen frequently and value edge quality over low maintenance.",
        "Stainless steel trades some of that edge refinement for practicality. Modern stainless alloys — especially the higher-end ones used in better kitchen knives — hold a working edge for longer between sharpenings and tolerate the kind of casual treatment a carbon blade won't forgive: a few hours sitting wet in a sink, contact with acidic ingredients, or just less attentive drying. For a knife that needs to survive a busy household rather than a single dedicated cook, that durability matters more than a marginal gain in sharpness.",
        "The rust question is real but manageable. Carbon steel forms a surface oxide layer, called a patina, through normal use — this is different from rust and is discussed in more detail elsewhere on this blog. Left wet for extended periods or stored without drying, though, carbon steel will develop actual rust, which stainless steel's chromium content largely prevents.",
        "Neither steel type is the \"correct\" choice — it's a genuine trade-off between edge performance and low-maintenance durability. If you're willing to hand-wash and dry a knife immediately after each use and enjoy the process of sharpening, carbon steel rewards that attention with a better edge. If you want a knife that performs reliably with less thought, a good stainless alloy is the more practical choice.",
      ],
      id: [
        "Perdebatan karbon versus stainless biasanya disederhanakan jadi satu poin: baja karbon berkarat kalau tidak dirawat, stainless tidak. Itu benar, tapi juga bagian paling kurang menarik dari perbandingannya — perbedaan yang lebih relevan untuk memasak sehari-hari adalah bagaimana tiap jenis baja berperilaku di mata pisau, bukan cuma bagaimana perilakunya di wastafel.",
        "Baja karbon umumnya lebih mudah diasah dan bisa mencapai mata pisau yang jauh lebih halus dibanding kebanyakan paduan stainless. Struktur butirannya memungkinkan diasah jadi bevel yang lebih tipis dan tajam serta tetap awet, dan sentuhan ulang di batu asah lebih cepat karena bajanya lebih lunak dikerjakan. Itu sebagian besar alasan kenapa baja karbon tetap jadi pilihan favorit koki profesional bergaya Jepang yang sering mengasah ulang dan mengutamakan kualitas mata pisau dibanding kemudahan perawatan.",
        "Baja stainless mengorbankan sebagian kehalusan mata pisau itu demi kepraktisan. Paduan stainless modern — terutama yang kelas atas dipakai di pisau dapur yang lebih bagus — mempertahankan mata pisau yang bisa dipakai lebih lama antar-pengasahan dan tahan perlakuan santai yang tidak dimaafkan bilah karbon: dibiarkan basah beberapa jam di wastafel, kontak dengan bahan asam, atau sekadar kurang telaten mengeringkannya. Untuk pisau yang harus bertahan di rumah tangga yang sibuk, bukan cuma dipegang satu koki yang telaten, ketahanan itu lebih penting daripada tambahan ketajaman yang marjinal.",
        "Soal karat itu nyata tapi bisa dikelola. Baja karbon membentuk lapisan oksida permukaan, disebut patina, lewat pemakaian normal — ini berbeda dari karat dan dibahas lebih detail di artikel lain blog ini. Tapi kalau dibiarkan basah dalam waktu lama atau disimpan tanpa dikeringkan, baja karbon akan berkarat sungguhan, yang sebagian besar dicegah oleh kandungan kromium pada baja stainless.",
        "Tidak ada jenis baja yang \"benar\" — ini kompensasi sungguhan antara performa mata pisau dan ketahanan minim-perawatan. Kalau Anda bersedia mencuci dan mengeringkan pisau dengan tangan segera setelah dipakai serta menikmati proses mengasah, baja karbon membalas perhatian itu dengan mata pisau yang lebih baik. Kalau Anda ingin pisau yang bekerja andal tanpa perlu banyak dipikirkan, paduan stainless yang bagus adalah pilihan yang lebih praktis.",
      ],
    },
  },
  {
    slug: "why-carbon-steel-develops-patina",
    title: {
      en: "Why Your Carbon Steel Knife Develops a Patina (and Why That's a Good Thing)",
      id: "Kenapa Pisau Baja Karbon Anda Membentuk Patina (dan Kenapa Itu Hal Baik)",
    },
    excerpt: {
      en: "That grey-blue tint spreading across a new carbon steel blade isn't damage — it's a protective layer, and encouraging it early pays off later.",
      id: "Warna abu-kebiruan yang menyebar di bilah baja karbon baru bukan kerusakan — itu lapisan pelindung, dan mendorongnya muncul sejak awal akan berguna belakangan.",
    },
    categorySlug: "steel-care",
    readingMinutes: 5,
    publishedAt: "2026-06-29",
    image: "/dev-images/blog/patina.jpg",
    content: {
      en: [
        "New carbon steel comes out of the box bright and silver, and within the first few weeks of use it starts to change — a grey, blue, or brownish tint spreading unevenly across the blade face. The first instinct is to assume something's gone wrong. In fact, this is patina, a naturally forming oxide layer, and it's one of the more useful things about carbon steel rather than a flaw in it.",
        "Patina forms when the iron in carbon steel reacts with acids, oils, and moisture from the food you cut. Unlike rust, which is a destructive, flaking form of oxidation, patina is a stable, adherent layer that actually protects the steel underneath it from further, more aggressive oxidation. A well-developed patina is functionally a knife's own built-in rust resistance — it's why older, well-used carbon steel knives often handle moisture better than a knife straight out of the box.",
        "You can let patina form naturally through ordinary use, which produces an uneven, mottled pattern as different foods react with the steel at different rates. Onions, citrus, and other acidic ingredients tend to darken the steel faster than something like plain potatoes. Some owners prefer this organic look; others prefer to force an even patina deliberately, using a vinegar soak or a rubbed-on coating of mustard or coffee grounds, which reacts with the steel far faster and more uniformly than daily cooking will on its own.",
        "The forced route is worth considering on a brand-new knife specifically because an even patina from day one gives more consistent protection than the patchy version that builds up gradually. Whichever way it forms, patina is not a substitute for basic care — the blade still needs to be washed and thoroughly dried after each use. Patina slows oxidation; it doesn't stop it entirely, and a carbon blade left wet will still rust regardless of how developed its patina is.",
        "If you do see genuine rust rather than patina — a rough, reddish-orange, flaking spot rather than a smooth grey-blue tint — it can usually be worked out with a fine abrasive like a rust eraser or very fine sandpaper, followed by a fresh patina application over the cleaned area. Left untreated, rust will continue to spread and pit the steel, so it's worth addressing early rather than waiting.",
      ],
      id: [
        "Baja karbon baru keluar dari kotak dalam kondisi mengilap dan berwarna perak, dan dalam beberapa minggu pertama pemakaian ia mulai berubah — warna abu-abu, biru, atau kecoklatan menyebar tidak merata di permukaan bilah. Reaksi pertama biasanya menganggap ada yang salah. Padahal, ini adalah patina, lapisan oksida yang terbentuk secara alami, dan ini justru salah satu hal paling berguna dari baja karbon, bukan cacat di dalamnya.",
        "Patina terbentuk saat zat besi dalam baja karbon bereaksi dengan asam, minyak, dan kelembapan dari makanan yang Anda potong. Berbeda dari karat, yang bersifat merusak dan mengelupas, patina adalah lapisan stabil yang menempel dan justru melindungi baja di baliknya dari oksidasi lebih lanjut yang lebih agresif. Patina yang terbentuk dengan baik pada dasarnya adalah perlindungan karat bawaan pisau itu sendiri — inilah kenapa pisau baja karbon lama yang sering dipakai justru sering lebih tahan kelembapan dibanding pisau yang baru keluar dari kotak.",
        "Anda bisa membiarkan patina terbentuk alami lewat pemakaian biasa, yang menghasilkan pola tidak merata dan berbintik karena makanan berbeda bereaksi dengan baja pada kecepatan berbeda. Bawang, jeruk, dan bahan asam lain cenderung menggelapkan baja lebih cepat dibanding misalnya kentang biasa. Sebagian pemilik pisau suka tampilan organik ini; yang lain lebih suka memaksa patina merata secara sengaja, memakai rendaman cuka atau olesan mustard atau ampas kopi, yang bereaksi dengan baja jauh lebih cepat dan merata dibanding memasak sehari-hari.",
        "Cara yang dipaksa ini layak dipertimbangkan khusus untuk pisau yang baru dibeli karena patina merata sejak hari pertama memberi perlindungan yang lebih konsisten dibanding versi belang yang terbentuk perlahan. Apapun caranya, patina bukan pengganti perawatan dasar — bilah tetap perlu dicuci dan dikeringkan sepenuhnya setelah tiap pemakaian. Patina memperlambat oksidasi; ia tidak menghentikannya sepenuhnya, dan bilah karbon yang dibiarkan basah tetap akan berkarat berapapun matangnya patina-nya.",
        "Kalau Anda melihat karat sungguhan, bukan patina — bercak kasar, kemerahan-oranye, dan mengelupas, bukan warna abu-kebiruan yang halus — biasanya bisa diatasi dengan abrasif halus seperti rust eraser atau amplas sangat halus, diikuti dengan aplikasi patina baru di area yang sudah dibersihkan. Kalau dibiarkan, karat akan terus menyebar dan membuat lubang di baja, jadi lebih baik ditangani sejak dini daripada menunggu.",
      ],
    },
  },
];

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return posts.filter((p) => p.categorySlug === categorySlug);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return posts.filter((p) => p.categorySlug === post.categorySlug && p.slug !== post.slug).slice(0, limit);
}
