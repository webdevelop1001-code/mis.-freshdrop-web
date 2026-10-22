# FRESHDROP — Milestone A (uji kamera)

Prototipe statis sederhana untuk menguji akses kamera smartphone, pengambilan foto, pratinjau, retake, dan use-photo. Belum ada penyimpanan, backend, pemrosesan warna/ROI, maupun klaim kondisi pangan.

## File
- `index.html` — antarmuka.
- `style.css` — tampilan responsif.
- `app.js` — baca ID tag dan alur kamera.

## Pengujian lokal
Akses kamera membutuhkan secure context: HTTPS atau `localhost`. Jangan membuka `index.html` langsung melalui `file://` untuk menguji kamera.

Contoh server lokal (dari folder ini):

```bash
python3 -m http.server 8000
```

Buka `http://localhost:8000/?id=FD-P-001` di komputer. Untuk pengujian kamera smartphone, deploy ke hosting HTTPS dan buka URL pada browser smartphone. Server lokal di komputer tidak otomatis dapat diakses ponsel kecuali jaringan dan host dikonfigurasi.

## Deploy GitHub Pages
1. Buat repository GitHub baru (mis. `freshdrop-web`).
2. Unggah tiga file aplikasi (`index.html`, `style.css`, `app.js`) dan README.
3. Buka **Settings → Pages**.
4. Pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
5. Tunggu URL HTTPS GitHub Pages muncul, lalu buka di smartphone dengan `?id=FD-P-001`.
6. Izinkan kamera. Uji buka kamera belakang, ambil foto, ambil ulang, dan gunakan foto.

## Batas milestone
Tag pada gambar yang diberikan berupa lembar beberapa tag dengan layout prototipe. Kode ini belum menentukan koordinat ROI, karena tahap kamera perlu berhasil diuji dahulu dan ROI harus dicocokkan dengan tag cetak fisik yang aktual. Belum ada QR final; QR harus dibuat setelah URL production stabil.

## Belum diverifikasi
Kamera belum dapat dinyatakan berhasil pada smartphone sampai URL HTTPS dibuka dan alur diuji di perangkat nyata. Jika gagal, kirim URL yang dipakai, tipe ponsel/browser, dan teks kesalahan yang tampil.
