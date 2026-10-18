  
LEMBAR ORISINALITAS

**PENDAHULUAN**

**1.1	Latar Belakang**  
Perkembangan teknologi digital telah mengubah hampir seluruh sendi kehidupan, termasuk dunia pendidikan. Anak-anak generasi saat ini tumbuh berdampingan dengan perangkat digital dan akrab dengan aplikasi, permainan, serta media interaktif sejak usia dini. Di era digital ini, kemampuan berpikir komputasional *(computational thinking*) menjadi salah satu kecakapan abad ke-21 yang penting dipupuk sejak sekolah dasar (Kakavas & Ugolini, 2019 ; Choi & Choi, 2024). Penting untuk dipahami bahwa *computational thinking* tidak terbatas pada kemampuan menulis kode, melainkan mencakup pengenalan pola, penyusunan instruksi, abstraksi, pemecahan masalah, dan evaluasi (Molina-Ayuso et al., 2022).   
Urgensi penguatan kemampuan ini turut tercermin dalam hasil *Programme for International Student Assessment* (PISA) 2022, ketika Indonesia menempati peringkat ke-69 dari 81 negara dengan skor matematika 366, jauh di bawah rata-rata international sebesar 472 (OECD, 2023). Pada PISA 2025, OECD mulai mengukur kemampuan *computational problem solving* secara khusus melalui penilaian yang berfokus pada pemecahan masalah menggunakan perangkat dan praktik komputasional. Indonesia memperoleh skor 427, masih di bawah rata-rata global sebesar 500 (OECD, 2026). Capaian tersebut menunjukkan bahwa pengembangan kemampuan siswa dalam menggunakan pendekatan komputasional untuk memecahkan masalah masih menjadi tantangan dalam pendidikan Indonesia.  
Namun, mengajarkan cara berpikir komputasional kepada anak bukan perkara sederhana. Konsep pemrograman seperti algoritma, urutan, dan pengulangan dapat terasa abstrak apabila hanya dijelaskan secara teoretis. Karena itu, siswa membutuhkan pengalaman belajar yang konkret, interaktif, dan dekat dengan kehidupan mereka. Salah satu pendekatan yang dapat digunakan ialah *block-based coding*, yang memungkinkan siswa menyusun program dengan merangkai blok instruksi tanpa harus menulis kode teks. Pendekatan ini dilaporkan dapat mendukung pengembangan *computational thinking*, motivasi belajar, serta sikap positif terhadap pemrograman (Choi & Choi, 2024).  
Di sisi lain, ada warisan budaya yang juga menanti penerusnya, salah satunya yaitu gamelan dan seni karawitan Jawa. UNESCO (2021) menetapkan gamelan sebagai Warisan Budaya Takbenda. Namun, kekayaan nilai dan estetika gamelan tidak selalu membuatnya terasa dekat dengan generasi muda. Gamelan kerap dipandang kuno dan kurang mengikuti perkembangan zaman (Ananda dkk., 2022), sementara rendahnya minat generasi muda menjadi salah satu tantangan dalam keberlanjutan kesenian tradisional Jawa (Febriana & Juwariyah, 2025). Dalam situasi ini, teknologi digital berpotensi menjadi jembatan untuk mendokumentasikan, mengedukasi, dan mempromosikan budaya lokal kepada khalayak yang lebih luas, termasuk generasi muda (Saputri dkk., 2025). Meski demikian, pengenalan budaya tidak cukup berhenti pada tampilan digital, tetapi perlu tetap terhubung dengan praktik langsung bersama guru dan praktisi.  
Karawitan menyimpan potensi besar sebagai konteks belajar yang bermakna. Di dalam pola tabuhan gamelan terdapat urutan, pengulangan, pengenalan pola, dan logika yang sangat dekat dengan konsep-konsep dasar pemrograman. Dengan demikian, pola tabuhan karawitan berpotensi menjadi konteks pembelajaran untuk memahami urutan, pengulangan, pengenalan pola, dan perbaikan kesalahan dalam pemrograman, sekaligus memperkenalkan kearifan lokal kepada siswa.  
Berdasarkan permasalahan yang telah diuraikan, penulis menghadirkan gagasan inovatif yaitu GamelanCode, sebuah media pembelajaran interaktif yang memadukan *block-based coding* dengan pola tabuhan karawitan Jawa. Melalui aplikasi ini, siswa dapat menyusun instruksi tabuhan, menjalankan simulasi, mengenali kesalahan, dan menciptakan pola secara bertahap. Inovasi ini memberikan kontribusi nyata pada beberapa aspek: (1) kearifan lokal, melalui penggunaan materi karawitan yang divalidasi oleh praktisi; (2) inklusivitas, melalui pembelajaran berbasis simulasi yang tidak mengharuskan setiap siswa memiliki gamelan; (3) daya saing, melalui pengembangan kemampuan berpikir komputasional; serta (4) keberlanjutan, melalui kolaborasi antara sekolah, sanggar, dan pengembang teknologi. Melalui esai ini, penulis akan menguraikan konsep, cara kerja, keunggulan, serta kelayakan GamelanCode secara lebih mendalam.

**1.2	Rumusan Masalah**

1. Bagaimana pola tabuhan karawitan Jawa dapat dimanfaatkan sebagai konteks pembelajaran *computational thinking*  bagi siswa sekolah dasar?  
2. Bagaimana GamelanCode dapat mengintegrasikan pemrograman visual dan pengenalan budaya dalam satu proses pembelajaran interaktif?  
3. Bagaimana strategi implementasi GamelanCode agar dapat diterapkan secara inklusif dan mendukung keterlibatan generasi muda dalam pelestarian gamelan dan seni karawitan?

   

**1.3	Tujuan**

1. Menganalisis potensi pola karawitan Jawa sebagai konteks pembelajaran *computational thinking.*  
2. Merumuskan konsep GamelanCode yang mengintegrasikan pemrograman visual, pembelajaran berjenjang, dan pengetahuan budaya.  
3. Merumuskan strategi implementasi dan pengembangan GamelanCode yang realistis, inklusif, serta berorientasi pada keberlanjutan pembelajaran serta pelestarian gamelan dan karawitan.

**ISI**

**2.1	Identifikasi Masalah**  
Berpikir komputasional dipopulerkan Wing (2006) sebagai sikap dan keterampilan yang berlaku universal, bukan hanya milik ilmuwan komputer, dan maknanya melampaui kemampuan menulis program. Indonesia mulai bergerak ke arah itu. Kemendikdasmen menawarkan mata pelajaran pilihan *Coding* dan Kecerdasan Artifisial mulai kelas V SD pada tahun ajaran 2025/2026, dengan penekanan pada berpikir komputasional (Republika, 2025). Namun status “pilihan” berarti pelaksanaannya bergantung pada kesiapan sekolah dan sebagian pengamat mengingatkan bahwa kesiapan guru serta fasilitas belum merata (NU Online, 2025).   
Tinjauan meta-analisis menunjukkan pemrograman visual berbasis blok memberi efek menengah-tinggi pada hasil belajar siswa K-12 (SMD \= 0,77), dengan efek lebih besar pada siswa pemula dan intervensi lebih dari satu bulan (Yu et al., 2024). Meski demikian, perbandingan langsung dengan pemrograman berbasis teks hanya menunjukkan efek kecil yang tidak signifikan secara statistik (Xu et al., 2019). Hal ini menunjukkan bahwa penggunaan blok saja belum cukup untuk menjamin hasil sehingga konteks serta rancangan aktivitas tetap perlu dipikirkan secara matang. Pendekatan yang mengaitkan komputasi dengan praktik budaya siswa telah diuji di Ghana melalui Adinkra *Mathematics*, yaitu perangkat lunak etnokomputasi yang menerjemahkan simbol budaya menjadi aktivitas komputasional dan dilaporkan mampu meningkatkan capaian matematika yang signifikan dibandingkan perangkat lunak konvensional tanpa konteks budaya (Babbitt et al., 2015).   
Gamelan telah diakui UNESCO sebagai Warisan Budaya Takbenda pada 2021 dan UNESCO mencatat bahwa musiknya mengikuti aturan yang cermat tentang laras, tata letak, serta pola ritme dan metrum, termasuk bagian-bagian instrumen yang saling mengunci untuk membentuk satu pola (UNESCO, 2021). Pewarisannya berlangsung melalui jalur formal dan informal, termasuk sekolah. Di sekolah, keterbatasan perangkat gamelan menjadi hambatan nyata; studi kasus di SMA Negeri 6 Surakarta menyebut keterbatasan fasilitas sebagai alasan hadirnya gamelan virtual, yang dilaporkan meningkatkan keterlibatan dan aksesibilitas siswa, tetapi masih menghadapi kendala teknis dan pedagogis (Syahputra & Setiaji, 2025). Dengan demikian, pengenalan karawitan yang hanya berhenti pada nama instrumen dan bunyi belum memanfaatkan potensi pola dan aturan yang dikandung musik ini.  
Sejumlah inovasi telah mengisi sebagian ruang tersebut. Pertama, aplikasi gamelan digital untuk pembelajaran seni, misalnya Aplikasi *Mobile Apps* Gamelan (Roekmana et al., 2020\) serta E-Gamelan dan Gamelan JV yang dikaji Syahputra dan Setiaji (2025). Kedua, gamelan robotik. Robot Gamelan Sekar Nuswantoro dari Universitas Dian Nuswantoro memakai Arduino dan solenoid untuk menggerakkan pemukul sesuai notasi yang dibaca perangkat lunak, dengan enam instrumen terpasang (PSI UDINUS, 2023), sedangkan Gamelatron mengubah komposisi digital menjadi denyut listrik yang menggerakkan pemukul mekanis pada instrumen perunggu dan besi (Kuffner, n.d.). Ketiga, musik sebagai konteks belajar pemrograman. *EarSketch* menggabungkan pemrograman dengan produksi musik berbasis sampel dan dilaporkan meningkatkan pengetahuan konten serta sikap terhadap komputasi pada siswa SMA (Magerko et al., 2016). Contoh-contoh ini menunjukkan bahwa tiap unsur GamelanCode sudah memiliki preseden. Temuan temuan ini dipakai untuk mendukung posisi gagasan.   
Berdasarkan paparan di atas, yang belum jelas terisi adalah media yang mampu memakai pola karawitan untuk melatih berpikir komputasional siswa sekolah dasar, karena gamelan digital dan robot gamelan yang telah ada berfokus pada memainkan, bukan pada melatih logika pemrograman. Kesenjangan inilah yang ingin dijawab GamelanCode.

**2.2	Solusi / Inovasi yang Diajukan**  
GamelanCode berasal dari gabungan kata Gamelan *Coding* yang merupakan aplikasi pembelajaran interaktif yang menggabungkan pemrograman visual berbasis blok dengan pola tabuhan karawitan Jawa untuk melatih berpikir komputasional siswa sekolah dasar, dengan kelas V sebagai sasaran awal yang selaras dengan jenjang mulai ditawarkannya mata pelajaran Coding dan Kecerdasan Artifisial (Republika, 2025). Siswa menyusun blok instruksi yang menentukan urutan, jeda, tempo, dan pengulangan tabuhan, menjalankannya pada simulasi gamelan, lalu membandingkan hasilnya dengan pola target. Pemilihan blok sebagai antarmuka didasarkan pada bukti bahwa pemrograman visual dapat membantu pemula (Yu et al., 2024), meskipun keunggulannya atas pemrograman teks belum konsisten (Xu et al., 2019), sehingga kekuatan GamelanCode diletakkan pada rancangan aktivitasnya dan model blok hanya berperan sebagai sarana.  
Pembelajaran disusun mengikuti enam proses kognitif Taksonomi Bloom: mengingat, memahami, menerapkan, menganalisis, mengevaluasi, dan mencipta (Krathwohl, 2002). Taksonomi ini dipakai sebagai kerangka merancang tujuan dan aktivitas. Tingkatannya memberikan kompleksitas yang meningkat, tetapi kewajiban hierarki dilonggarkan sehingga antarkategori dapat saling tumpang tindih. Oleh karena itu, GamelanCode menyediakan jalur belajar yang disarankan, sementara editor blok terbuka sejak awal agar siswa dapat bereksperimen kapan saja.  
Aspek budayanya dijaga lewat pelibatan praktisi karawitan sejak perancangan materi. Prinsip ini sejalan dengan gagasan bahwa alat komputasional berbasis budaya perlu berupa terjemahan pengetahuan budaya, bukan sekadar pemodelan permukaannya (Babbitt et al., 2015). Perangkat pemukul otomatis diposisikan sebagai pengembangan lanjutan, mengikuti preseden Arduino dan solenoid pada robot gamelan sebelumnya (PSI UDINUS, 2023).  
Kebaruan yang kami tawarkan terletak pada integrasi empat unsur: *coding* sebagai kompetensi yang sengaja dilatih, pola karawitan sebagai inti tantangan, perkembangan kompetensi yang bertahap tetapi fleksibel, dan jembatan menuju praktik budaya langsung. Setiap unsur sudah memiliki preseden, sehingga titik kebaruan terletak pada kombinasinya dan masih perlu diuji.

**2.3	Model Implementasi**  
	**2.3.1	Prinsip Dasar**  
Model implementasi GamelanCode dirancang berdasarkan tiga prinsip utama. Pertama, *learning by doing*, yaitu pembelajaran melalui pengalaman langsung dengan menyusun blok instruksi, menjalankan simulasi tabuhan, mengamati hasilnya, dan memperbaiki kesalahan program. Kedua, *human-in-the-loop*, yaitu keterlibatan guru dan praktisi karawitan dalam membimbing proses pembelajaran, memberikan umpan balik, serta memastikan ketepatan pola tabuhan dan kesesuaian materi dengan nilai budaya. Ketiga, *dual model*, yaitu penerapan dua bentuk pembelajaran yang saling melengkapi, berupa simulasi digital yang dapat diakses tanpa kepemilikan instrumen gamelan dan praktik menggunakan gamelan fisik melalui fasilitas bersama di sekolah atau sanggar.  
GamelanCode tidak dimaksudkan untuk menggantikan peran guru maupun praktisi karawitan, melainkan menjadi sarana pendukung yang memperluas akses pembelajaran, mengembangkan kemampuan berpikir komputasional, serta mendekatkan seni karawitan kepada generasi muda tanpa mengabaikan autentisitas budaya.

	**2.3.2	Alur Sistem**  
	Alur berikut disesuaikan dengan prototipe antarmuka yang dirancang. Aplikasi memiliki lima tab navigasi bawah; yang menjadi inti alur adalah tab Editor dan tab Misi.

1. ***Onboarding*** **dan tantangan awal.** Pengguna baru melihat penjelasan singkat fungsi fitur, lalu diberi tantangan awal berupa pola tabuhan target yang diminta ditiru di editor blok. Tujuannya memperlihatkan alasan belajar sebelum masuk misi. Rancangan ini merujuk pada gagasan *productive failure*, yaitu mencoba memecahkan masalah sebelum menerima instruksi (Kapur, 2008). Gagasan itu menuntut konsolidasi oleh pendidik setelah percobaan awal, sehingga guru tetap menjelaskan konteks sebelum dan sesudah tantangan, dan siswa dapat melewati tantangan. Efektivitasnya pada siswa sekolah dasar dalam konteks *coding* belum teruji dan menjadi hipotesis yang dievaluasi pada uji coba.  
2. **Misi bertingkat (C1–C6).** Tab Misi menampilkan enam level, satu tampilan per level. Urutan hanya disarankan, level tidak dikunci permanen.  
3. **Menyusun program.** Di tab Editor, siswa dapat menyeret blok instruksi tabuhan, jeda, tempo, dan pengulangan. Tab editor dapat dibuka bebas dari awal maupun dari sebuah misi.  
4. **Menjalankan dan mendengarkan.** Program diterjemahkan menjadi daftar tabuhan berwaktu, lalu dimainkan pada simulasi di tab Output Gamelan sambil menyorot blok yang sedang berjalan.  
5. **Evaluasi dan debugging**. Siswa membandingkan hasil dengan pola target, mencari penyebab perbedaan, dan memperbaiki program.  
6. **Kreasi dan penyimpanan.** Siswa menyusun pola sendiri, menjelaskan idenya, dan menyimpannya untuk dicoba pada praktik langsung.  
7. **Praktik langsung dan, bila tersedia, perangkat fisik.** Program dapat diuji pada pemukul otomatis di sekolah atau sanggar, dilanjutkan latihan bersama guru atau pengrawit tanpa aplikasi.  
   Alur perangkat fisik yang diusulkan: program siswa, sistem pemrosesan, mikrokontroler, mekanisme pemukul otomatis, gamelan akustik, evaluasi dan perbaikan program. Pada tahap awal, simulasi digital menjadi fungsi utama yang akan dilanjutkan dengan pengembangan integrasi perangkat fisik setelah konsep pembelajaran dan prototipe dievaluasi.  
   

	**2.3.3	*Key Tools* / Komponen Utama**  
**Antarmuka pemrograman visual**. Editor dibangun dengan *Blockly*, pustaka editor blok dari *Google*. Blok dapat diterjemahkan menjadi kode *JavaScript* dan dijalankan di interpreter terisolasi yang mendukung jeda, eksekusi langkah demi langkah, dan penyorotan blok yang sedang berjalan sehingga perilaku program mudah dipahami siswa. Blok kustom mencakup tabuh, jeda, atur tempo, dan gong, ditambah blok pengulangan bawaan.  
**Pustaka materi karawitan**. Berisi informasi instrumen, bunyi, pola tabuhan, dan konteks budaya yang ditinjau guru atau pengrawit sebelum dipakai. Pada prototipe, pola yang tampil berstatus contoh dan diberi label belum divalidasi. Laras gamelan tidak memiliki standar kaku dan setiap set memiliki karakter sendiri (Gamelan BVG, n.d.), sehingga bunyi simulasi hanyalah pendekatan terhadap bunyi gamelan sesungguhnya.  
**Simulasi gamelan digital**. Memainkan daftar tabuhan berwaktu pada instrumen virtual dengan animasi bilah. Seperti dilaporkan pada studi gamelan virtual, media digital berguna untuk akses dan keterlibatan tetapi tidak menggantikan permainan langsung (Syahputra & Setiaji, 2025).  
**Fitur pembelajaran bertahap berdasarkan Taksonomi Bloom**. Definisi tiap proses kognitif mengikuti Krathwohl (2002):

| Level | Fitur | Proses kognitif  |
| ----- | ----- | ----- |
| C1-Mengingat | Kenali Gamelan | Mengambil kembali pengetahuan relevan dari ingatan jangka panjang |
| C2-Memahami | Pahami Polanya | Menentukan makna pesan instruksional, termasuk grafis |
| C3-Menerapkan | Susun Tabuhan | Melaksanakan atau memakai prosedur pada situasi tertentu |
| C4-Menganalisis | Detektif Tabuhan | Memecah materi menjadi bagian dan mendeteksi hubungan antarbagian |
| C5-Mengevaluasi | Kurator Pola | Membuat penilaian berdasarkan kriteria dan standar |
| C5-Mencipta | Ciptakan Gendingmu | Menyusun unsur menjadi keseluruhan baru yang koheren |

		Tabel 1\. Proses Kognitif Taksonomi Bloom

**Perangkat fisik opsional**. Mikrokontroler dan mekanisme pemukul otomatis yang mengubah program menjadi tabuhan pada gamelan akustik, mengikuti preseden robot gamelan berbasis Arduino dan solenoid (PSI UDINUS, 2023\) serta sistem pemukul mekanis pada Gamelatron (Kuffner, n.d.).  
**Panduan guru dan praktisi**. Petunjuk penggunaan dan pendampingan agar kegiatan digital terhubung dengan pembelajaran budaya secara langsung.

	**2.3.4	Prototypes**  
Prototipe awal difokuskan pada antarmuka dan simulasi digital, bukan perangkat gamelan otomatis. Prototipe berupa aplikasi web yang dibangun dengan Blockly, sehingga editor blok dan simulasi suara benar-benar dapat dijalankan. Layarnya mengikuti sketsa antarmuka yang dirancang tim. Pola tabuhan pada prototipe adalah contoh yang diberi label belum divalidasi praktisi karawitan. Mekanisme pemukul otomatis hanya digambarkan sebagai rancangan konseptual, bukan fitur yang sudah dibangun dan diuji. Prototipe ini dapat diakses pada halaman [https\://gamelan-koding.vercel.app/](https://gamelan-koding.vercel.app/).

**2.4	Analisis Tantangan**

| Tantangan | Penjelasan | Strategi mitigasi |
| ----- | ----- | ----- |
| Beban belajar ganda | Siswa mempelajari logika program dan konteks karawitan sekaligus. | Memulai dari pola sederhana, menyediakan contoh dan petunjuk bertahap yang dikurangi seiring kemampuan (Wood et al., 1976). |
| Ketepatan budaya | Menerjemahkan pola tradisi menjadi blok berisiko menyederhanakan atau mengubah maknanya serta laras tiap gamelan unik (Gamelan BVG, n.d.), sehingga bunyi digital beresiko tidak sesuai. | Melibatkan guru dan praktisi sejak perancangan; alat berbasis budaya perlu menerjemahkan, bukan sekadar memodelkan (Babbitt et al., 2015\) dan menyandingkan simulasi dengan praktik gamelan asli. |
| Kesiapan guru dan fasilitas | Mata pelajaran *Coding* dan Kecerdasan Artifisial bersifat pilihan dan bergantung kesiapan sekolah, kesiapan guru serta fasilitas dikhawatirkan belum merata (NU Online, 2025; Republika, 2025). | Panduan penggunaan dan pelatihan guru dan mode simulasi yang tidak membutuhkan perangkat fisik. |
| Kerumitan perangkat fisik | Robot gamelan terdahulu membutuhkan pengembangan panjang. Tim Udinus membutuhkan riset berkesinambungan mengembangkan sejak 10 tahun lalu  dengan 21 mahasiswa dan lima dosen (PSI UDINUS, 2023). | Menunda integrasi fisik hingga konsep pembelajaran tervalidasi, lalu memulai dari instrumen dan pola terbatas. |
| Bukti efektivitas belum tersedia | Efek pemrograman blok bervariasi dan tidak selalu unggul atas pemrograman teks (Xu et al., 2019); efek tercatat lebih besar pada SMP dan intervensi lebih dari satu bulan (Yu et al., 2024). | Uji coba bertahap dengan durasi memadai sebelum klaim efektivitas.  |

Tabel 2\. Analisis Tantangan

**2.5	Rencana Implementasi Jangka Panjang**

1. **Tahap 1 Perancangan.** Mengidentifikasi kebutuhan siswa dan guru, memilih pola karawitan yang sesuai, dan memvalidasi materi bersama praktisi. Sasaran awal kelas V SD agar selaras dengan jenjang mulai ditawarkannya mata pelajaran Coding dan KA (Republika, 2025).  
2. **Tahap 2 Pengembangan prototipe.** Menyempurnakan antarmuka, blok program, simulasi suara, dan misi C1-C6 berdasarkan prototipe awal.  
3. **Tahap 3 Uji coba terbatas.** Menguji kemudahan penggunaan, pemahaman berpikir komputasional, dan pemahaman budaya pada kelompok siswa. Durasi uji coba direncanakan lebih dari satu bulan karena efek pemrograman blok tercatat lebih besar pada intervensi yang lebih lama (Yu et al., 2024).  
4. **Tahap 4 Penyempurnaan.** Memperbaiki fitur berdasarkan masukan siswa, guru, dan praktisi, termasuk memeriksa apakah tantangan awal membantu atau justru membebani siswa (Kapur, 2008).  
5. **Tahap 5 Integrasi perangkat fisik.** Mengembangkan dan menguji pemukul otomatis pada instrumen terpilih bila hasil awal menjanjikan, dengan memperhitungkan kompleksitas pengembangan robot gamelan terdahulu (PSI UDINUS, 2023).  
6. **Tahap 6 Perluasan kemitraan.** Membangun kolaborasi sekolah, sanggar, komunitas budaya, dan pengembang teknologi. Jalur ini sejalan dengan pewarisan gamelan yang berlangsung melalui pendidikan formal dan informal (UNESCO, 2021).

**Indikator evaluasi:** ketepatan menyusun algoritma, kemampuan menemukan dan memperbaiki kesalahan, pemahaman pola dan konteks karawitan, keterlibatan siswa, minat mengikuti praktik karawitan, dan kesesuaian materi menurut praktisi.

**2.6	Dampak yang Diharapkan**  
GamelanCode diharapkan memberikan dampak berjenjang, mulai dari tingkat individu hingga pembangunan nasional. Pada tingkat individu, inovasi ini berpotensi mengembangkan kemampuan berpikir komputasional, kreativitas, dan pemecahan masalah siswa sekaligus menumbuhkan ketertarikan terhadap budaya karawitan. Pada tingkat sosial dan budaya, kolaborasi antara sekolah, sanggar, guru, dan praktisi karawitan diharapkan memperluas akses pembelajaran serta memperkuat regenerasi pelaku seni dan pewarisan budaya antargenerasi. Dalam jangka panjang, perpaduan kecakapan digital dan apresiasi budaya ini berpotensi mendukung terwujudnya sumber daya manusia yang adaptif, kreatif, dan berdaya saing tanpa kehilangan identitas bangsa, sejalan dengan visi Indonesia Emas 2045\.  
Dampak tersebut selaras dengan SDG 4 (Pendidikan Berkualitas) melalui pengembangan pembelajaran yang interaktif dan bermakna, SDG 11 (Kota dan Permukiman yang Berkelanjutan) melalui upaya menjaga keberlanjutan warisan budaya, serta SDG 17 (Kemitraan untuk Mencapai Tujuan) melalui kolaborasi sekolah, sanggar, praktisi karawitan, dan pengembang teknologi. Dengan demikian, GamelanCode tidak hanya diarahkan untuk mempertemukan teknologi dengan seni tradisional, tetapi juga membangun ekosistem pembelajaran yang mengembangkan kompetensi masa depan sekaligus menjaga keberlanjutan kearifan lokal.  
**PENUTUP**

**3.1	Kesimpulan**  
Pengembangan *computational thinking* dan pelestarian budaya merupakan dua kebutuhan yang dapat saling menguatkan dalam menghadapi tantangan pendidikan di era digital. GamelanCode hadir sebagai gagasan media pembelajaran yang mengintegrasikan *block-based coding* dengan pola tabuhan karawitan Jawa, sehingga siswa tidak hanya mengenal instrumen dan bunyi gamelan, tetapi juga belajar menyusun algoritma, mengenali pola, mengevaluasi hasil, dan memperbaiki kesalahan melalui pengalaman interaktif pembelajaran bertahap berdasarkan Taksonomi Bloom revisi (C1–C6). GamelanCode dirancang untuk menghubungkan pengembangan kompetensi digital dengan pengenalan budaya secara kontekstual, tanpa menggantikan peran guru maupun praktisi karawitan. Meskipun demikian, keberhasilannya masih perlu dibuktikan melalui validasi materi dan pengujian pembelajaran secara bertahap.  
Indonesia tidak hanya membutuhkan generasi muda yang mampu menggunakan teknologi, tetapi juga generasi muda yang mampu menjadikan pengetahuan lokal sebagai sumber penciptaan teknologi. GamelanCode berupaya mempertemukan keduanya. Sebab, pelestarian budaya bukan sekadar menjaga warisan agar tetap ada, melainkan membuka ruang agar generasi muda dapat mempelajari, memaknai, dan mengembangkannya. GamelanCode berangkat dari keyakinan bahwa budaya tidak harus tertinggal di masa lalu. Ia dapat menjadi bagian dari cara generasi masa depan belajar, berinovasi, dan menciptakan perubahan.

**3.2	Saran**  
Pengembangan GamelanCode perlu dimulai dengan memvalidasi pola tabuhan dan materi budaya bersama praktisi karawitan, kemudian menyempurnakan prototipe digital berdasarkan kebutuhan siswa dan guru. Uji coba terbatas pada siswa kelas V sekolah dasar perlu dilakukan untuk mengevaluasi kemudahan penggunaan, ketepatan penyusunan program, kemampuan *debugging*, serta pemahaman dan ketertarikan siswa terhadap karawitan. Pengujian sebaiknya berlangsung dalam durasi yang memadai, disertai evaluasi sebelum dan sesudah pembelajaran agar manfaatnya dapat dinilai secara lebih objektif. Apabila hasil awal menunjukkan potensi yang menjanjikan, pengembangan dapat dilanjutkan melalui integrasi perangkat gamelan fisik dan perluasan kemitraan dengan sekolah serta sanggar. Dengan pendekatan bertahap ini, GamelanCode diharapkan dapat berkembang berdasarkan bukti dan kebutuhan nyata, bukan hanya menjadi gagasan inovatif, tetapi juga media pembelajaran yang layak diterapkan dan berkelanjutan.  
**DAFTAR PUSTAKA**

Ananda, S., Martini, & Herminasari, N. S. (2022). Minat Generasi Muda Kepada Pelestarian Gamelan Jawa di Komunitas Gamelan Muda Samurti Andaru Laras. *Jurnal Studi Budaya Nusantara*, 6(2), 82–93. https\://doi.org/10.21776/ub.sbn.2022.006.02.01  
Babbitt, W., Lachney, M., Bulley, E., & Eglash, R. (2015). Adinkra Mathematics: A study of Ethnocomputing in Ghana. *Multidisciplinary Journal of Educational Research*, 5(2), 110–135. https\://doi.org/10.17583/remie.2015.1399   
Choi, W. C., & Choi, I. C. (2024). The Influence and Relationship between Computational Thinking, Learning Motivation, Attitude, and Achievement of Code.org in K-12 Programming Education. *ArXiv*. https\://doi.org/10.48550/arXiv.2412.14180  
Febriana, D., & Juwariyah, A. (2025). The Role of Sanggar Madu Mulyo in Preserving Music Culture in Sidoarjo. *Solah Journal of Performing Arts*, 11(1), 57–65. https\://doi.org/10.26740/vt.v11n1.p57-65  
Gamelan BVG. (n.d.). *Javanese gamelan terminology*. https\://gamelanbvg.com/gendhing/gamelanGlossary.pdf  
Kakavas, P., & Ugolini, F. C. (2019). Computational thinking in primary education : a systematic literature review. *Research on Education and Media*, 11(2), 64–94. https\://doi.org/10.2478/rem-2019-0023  
Kapur, M. (2008). Productive failure. *Cognition and Instruction*, 26(3), 379–424. https\://doi.org/10.1080/07370000802212669  
Krathwohl, D. R. (2002). A revision of Bloom’s taxonomy: An overview. *Theory Into Practice*, 41(4), 212–218. https\://doi.org/10.1207/s15430421tip4104\_2  
Kuffner, A. T. (n.d.). *The Gamelatron project.* Aaron Taylor Kuffner. https\://www\.aarontaylorkuffner.com/sonic-art   
Magerko, B., Freeman, J., Mcklin, T., Reilly, M., Livingston, E., Mccoid, S., & Crews-Brown, A. (2016). EarSketch. *ACM Transactions on Computing Education*, 16(4), 1–25. https\://doi.org/10.1145/2886418  
Molina-ayuso, Á., Adamuz-povedano, N., Bracho-López, R., & Torralbo-Rodríguez, M. (2022). Introduction to Computational Thinking with Scratch for Teacher Training for Spanish Primary School Teachers in Mathematics. *Education Science*, 12, 899\. https\://doi.org/10.3390/ educsci12120899  
NU Online. (2025). *Pembelajaran coding dan AI tingkatkan berpikir kritis siswa, butuh fasilitas dan pengajar memadai*. https\://nu.or.id/nasional/pembelajaran-coding-dan-ai-tingkatkan-berpikir-kritis-siswa-butuh-fasilitas-dan-pengajar-memadai-SLPDO  
OECD (2023). PISA 2022 Results (Volume I): The State of Learning and Equity in Education, PISA. *OECD Publishing*. https\://doi.org/10.1787/53f23881-en  
OECD (2026). PISA 2025 Results (Volume I): Future-Ready Students, PISA, *OECD Publishing*. https\://doi.org/10.1787/73451bc5-en  
PSI UDINUS. (2023). *Robot gamelan Sekar Nuswantoro milik Udinus mampu tabuh gamelan secara otomatis nonstop*. Universitas Dian Nuswantoro. https\://dinus.ac.id/2023/06/robot-gamelan-sekar-nuswantoro-milik-udinus-mampu-tabuh-gamelan-secara-otomatis-nonstop/  
Republika. (2025). S*iap-siap, coding dan AI diajarkan untuk SD-SMP-SMA mulai tahun ajaran depan*. https\://news.republika.co.id/berita/sygtsq458/siapsiap-coding-dan-ai-diajarkan-untuk-sdsmpsma-mulai-tahun-ajaran-depan  
Roekmana, G. M., Fujiawati, F. S., Permana, R., & Hermansyah, D. (2020). Aplikasi Mobile Apps Gamelan Untuk Pembelajaran Seni. *Jurnal Pendidikan Dan Kajian Seni*, 5(2). https\://doi.org/10.30870/jpks.v5i2.9901  
Saputri, M., Amir, A., & Jusman. (2025). The Role of Digital Technology in Preserving Local Wisdom of Cirendeu Traditional Village: Perspective Student PMM 3 UPI. *Multidisciplinary Indonesian Center Journal (MICJO)*, 2(2), 1205–1212. https\://doi.org/10.62567/micjo.v2i2.584  
Syahputra, N. B. N. H., & Setiaji, D. (2025). Efektivitas pembelajaran karawitan menggunakan media gamelan digital: Studi kasus kelas 10 SMA Negeri 6 Surakarta. Tamumatra: *Jurnal Seni Pertunjukan*, 8(1), 43–62. https\://doi.org/10.29408/tmmt.v8i1.30122  
UNESCO. (2021). *Gamelan*. Representative List of the Intangible Cultural Heritage of Humanity. https\://ich.unesco.org/en/RL/gamelan-01607  
Wing, J. M. (2006). Computational thinking. *Communications of the ACM*, 49(3), 33–35. https\://doi.org/10.1145/1118178.1118215  
Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in problem solving. *Journal of Child Psychology and Psychiatry,* 17(2), 89–100. https\://doi.org/10.1111/j.1469-7610.1976.tb00381.x  
Xu, Z., Ritzhaupt, A. D., Tian, F., & Umapathy, K. (2019). Block-based versus text-based programming environments on novice student learning outcomes: a meta-analysis study. *Computer Science Education*, 29(2–3), 177–204. https\://doi.org/10.1080/08993408.2019.1565233   
Yu, Q., Yu, K., & Li, B. (2024). Effects of Block-Based Visual Programming on K-12 students’ learning outcomes. *Journal of Educational Computing Research*, 63(1), 64–98. https\://doi.org/10.1177/07356331241293163

**LAMPIRAN**

**Lampiran 1\. Kerangka Konseptual GamelanCode**  


**Lampiran 2\. Prinsip *Dual-model* GamelanCode**  




**Lampiran 5\. Dampak Multilevel GamelanCode**  


**Lampiran 6\. *Roadmap* Implementasi GamelanCode**  

**Lampiran 7\. Ekosistem Kemitraan GamelanCode**  


**Lampiran 8\. *Prototypes* GamelanCode**

**Lampiran 9\. Hasil Cek Plagiarisme**  


