---
# NONSTOP NGODING NOVEMBER
<sub>Dengan menggunakan discord.js biar sekalian developing botku hehe</sub>


> [!IMPORTANT]
> Pertama-tama, aku cuma akan push file code yang spesifik dengan prompt tema. Kalau ada skrip pembantu yang dipakai untuk ngebantu proses (kayak file konfigurasi atau fungsi tambahan), kemungkinan besar gak bakal ku push ke GitHub. Jadi yang kalian lihat di sini cuma fokus utamanya aja, jadi mohon maaf hehe.
---
## Day 1: Pet Commands 🐾

First day, aku bikin fitur pet commands untuk mengadopsi hewan peliharaan virtual. Adapun yang bisa dilakukan sebagai berikut:
- **Adopsi hewan peliharaan**, pilih hewan favorit buat dijadiin peliharaan.
- **Kasih makan dan main**
- **Lihat status**, jadi bisa cek status hewan peliharaan, seperti level, energi, kebahagiaan, dan lain-lain.

Karena menurutku fitur ini masih kurang, maka kutambahin juga:
- **Sistem Recovery Energi Otomatis**, jadi energi hewan peliharaan bisa pulih sendiri seiring waktu, mau ditinggal AFK juga jadi gak mikir lagi buat suruh tidur hewan peliharaanmu karena mereka udah mandiri dari crook lvl 1 hehe.
- **Sistem Decay**, yakali gak nambahin sistem ini hahahahahaha, ya pada dasarnya sistem ini buat ngurangin stats hewanmu aja, jadi sewaktu-waktu hewanmu bisa lapar dan stres. Dan setiap hewanmu lapar atau stres, maka kamu akan mendapatkan pemberitahuan dari bot melalui DM pribadi. Bot aja perhatian ke hewanmu, masa kamunya gak? hehe.
- **Sistem Leveling dan Evolusi**, hewan peliharaanmu juga bisa naik level dan berevolusi seiring kamu berinteraksi dengannya.
- **Sitem Reward**, jadi kamu bakal dapat reward setiap kali berinteraksi dengan hewan peliharaanmu.

Terima kasih kepada **MongoDB** untuk penyimpanan data hewan peliharaannya dan **node-cron** untuk mengatur pembaruan energi otomatis dan decay.

> [!WARNING]
> Code ini sangat minim sekali debugging pada saat proses develop, khususnya pada sistem reward. Jadi untuk yang mungkin ingin di clone filenya, mohon dimaklumi apabila terdapat error atau sistem tidak dapat berfungsi dengan baik...

Day 1 ini ya lumayanlah ratingku 6/10.

---
## Day 2: Stock Market Simulation 📈

Di hari kedua, aku bikin simulasi pasar saham. Jadi kali ini kita bakal simulasi jadi investor di Discord yagesya. Berikut adalah beberapa commands yang tersedia:

- **Beli dan jual saham**, pilih saham perusahaan yang mau dibeli atau dijual sesuai harga pasar saat ini.
- **Lihat portofolio**, cek portofolio kamu untuk tau saham apa aja yang dimiliki dan nilainya saat ini.
- **Daftar saham & riwayat harga**, tampilkan semua saham perusahaan yang tersedia beserta riwayat harga sebelumnya biar kamu bisa analisis tren harganya (ya meskipun yang ini analisa tren harganya cuma berapa angka dan gak ada grafiknya, karena faktor waktu yang gak cukup juga hehe).
- **Leaderboard investor**, lihat peringkat investor dengan portofolio terbanyak di server, jadi kamu bisa tahu siapa yang beneran pinter main saham wkwk.

Untuk bikin simulasi ini makin realistis, aku tambahin sistem yang bisa merubah harga saham sesuai kondisi pasar di dunia simulasi ini yang sistemnya aku coba untuk hampir mendekati dengan real life. Ada juga sistem pemberitahuan harga saham yang bisa dikirim ke semua orang (publik) atau secara private message ke investor yang ingin tetap update. Notifikasi ini otomatis dikirim tiap ada update harga baru, supaya investor nggak ketinggalan info penting.

Sama kayak fitur pet commands di Day 1, di sini aku juga pake **MongoDB** buat nyimpen data portofolio dan harga saham, serta **node-cron** buat ngatur pembaruan harga saham dan notifikasinya secara berkala.

> [!IMPORTANT]
> Untuk kalian yang ingin clone filenya tanpa modifikasi, file `initializeStocks.js` di run terlebih dahulu agar saham perusahaannya bisa terdaftar di database sebelum menjalankan bot kalian. Aku sengaja pisahkan prosesnya dari main file dengan maksud efisiensi waktu tiap kali mau testing atau run botnya secara local.
> Dan seperti yang ku bilang di atas tadi, karena keterbatasan waktu dalam developnya, simulasi ini tidak memiliki data dalam bentuk grafik. Jadi, mohon maaf kalo misal tampilan data dirasa kurang lengkap dari simulasi ini.

Day 2 ini begitu gacor lah. 8.5/10

---
## Day 3: Simple Bot Response 🤖
<sub>(Day-Skip Cheat 1)</sub>

Hari ini lagi gak bisa mikir ide yang bagus, jadi aku bikin fitur yang simpel dulu yaitu respons bot. Intinya, aku cuma nambahin beberapa jenis respons yang bisa dipilih oleh bot sesuai pesan dari user. Menggunakan logika respons dasar, bot bakal mencocokan kata kunci khusus dari pesan user, terus kasih respons yang paling pas dari list yang udah dibuat.

Jadi ya day 3 ini basic banget, tapi mungkin akan ku kembangin lagi ini jadi fitur yang lebih gede kapan-kapan. 2/10
Oke segitu aja, see you in the next update!