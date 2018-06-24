# Kelas untuk Intermediate Front-end

Untuk mempermudah kegiatan di kelas ikuti langkah-langkah berikut:

- Buat akun di github.com
- pastikan git & node (pastikan pilih v8+) sudah terinstall, bisa kalian cek [di sini](https://github.com/DSCBali/preclass)
- pakailah terminal sesuai kenyamanan kalian
- pastikan sudah berada di folder yang kalian inginkan
- jalankan command:
```
git clone https://github.com/DSCBali/mobile-web.git
```
- ini akan membuat file baru bernama **mobile-web**

## Tugas 1
- Buatlah sebuah _branch_ baru dengan:
```
git checkout -b nama-kalian
```
- Dalam file **README.MD** gantilah isinya dengan nama kalian.
- Dan jalankan command:
```
git push origin nama-kalian
```
- install package **serve** dengan cara:
```
npm i -g serve
```
- serve merupakan sebuah web server lokal, jalankan command :
```
serve .
```


## Tugas 2
- Buka http://localhost:5000/Lesson2/Start/
- File yang perlu kalian edit hanya ada di **main.css**
- Carilah selector class yang memiliki width absolute contohnya:
```
width: 800px
```
- Ganti value-value tersebut dengan width relative (memakai **%**)
```
width: 100%
```
- Ganti semua tag *a*(anchor tag) *agar memiliki minimal width & height 48px
- Jangan lupa untuk add & commit:
```
git add .
git commit -m "pesan commit"
git push origin nama-branch
```

## Tugas 3
- Buka http://localhost:5000/quizzes/media-query
- File yang perlu kalian edit ada di **quizzes/media-query.html**
- Kalian hanya perlu mengganti warna background dari tag **body** menjadi:
  - red, di antara 0-400px
  - green, di antara 401-599px
  - blue, width >= 600px (bisas pakai min-width)

## Tugas 4
- Buka http://localhost:5000/lesson3/Start/
- File yang perlu kalian edit ada di **Lesson3/Start/responsive.css**
- Di sana sudah ada catatan yang perlu kalian lakukan
