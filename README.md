# PilihLah (versi Web/HTML dalam WebView)

Sama app, cara lain nak build dia: satu WebView native yang load HTML/CSS/JS
yang dibundle terus dalam APK (`app/src/main/assets/www/`). 100% offline —
takde permission INTERNET pun dalam manifest.

## Kenapa pendekatan ni (berbanding versi native Kotlin/Compose)
- Semua UI/logic dalam plain HTML/CSS/JS — senang edit/preview terus dalam
  browser (buka `app/src/main/assets/www/index.html` terus, tak payah
  Android Studio pun untuk ubah tampilan).
- MainActivity.kt cuma ~30 baris — cuma "shell" yang bukak WebView.
- Sesuai untuk app tanpa backend/native API macam PilihLah ni.

## Buka dalam Android Studio
1. File → Open → pilih folder `PilihLahWeb` ni.
2. Biar Gradle sync.
3. Run ▶ pada emulator/phone.

Atau, untuk preview cepat UI je (tanpa Android Studio), terus buka
`app/src/main/assets/www/index.html` dalam browser desktop — app tu jalan
sama macam dalam app (shuffle animation, dsb), sebab semuanya vanilla
JS/CSS, takde dependency Android.

## Struktur logic (untuk scale ke banyak pilihan + paywall nanti)
Semua dalam `app/src/main/assets/www/app.js`:
- `state.options` — array pilihan (bukan fields tetap A/B), so tambah
  pilihan = tambah dalam array, semua fungsi lain dah loop atas array ni.
- `MAX_FREE_OPTIONS = 2` — satu-satunya line untuk tukar bila nak buka slot.
- `canAddOption()` — sini nanti sambung logic billing/entitlement.
- Butang "+ Tambah pilihan" dalam UI sekarang locked (🔒), sama macam versi
  native, sebagai placeholder untuk paywall.

## Applicationid berbeza dari versi native
Package name app ni `com.pilihlah.webapp` (versi native guna
`com.pilihlah.app`) — sengaja dibezakan supaya boleh install DUA-DUA
versi sekali gus dalam satu phone untuk banding-banding. Bila dah decide
nak guna yang mana untuk publish, tukar `applicationId` dalam
`app/build.gradle.kts` ikut citarasa korang.

## Nak publish ke Play Store
Sama step macam versi native:
1. Build → Generate Signed Bundle / APK → **Android App Bundle (.aab)**.
2. Buat/guna keystore, simpan elok-elok.
3. Upload `.aab` ke Google Play Console.

## Nota teknikal
- `noCompress` untuk html/css/js di-set dalam `build.gradle.kts` supaya
  WebView load asset dengan stabil pada semua device.
- `allowFileAccess = true` diperlukan sebab kita load dari
  `file:///android_asset/`.
- Tiada `INTERNET` permission dalam manifest — memang sengaja, sebab app
  ni tak call mana-mana server.
