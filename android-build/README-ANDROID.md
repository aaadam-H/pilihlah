# Jadikan PilihLah app Play Store (.aab / .apk)

Cara: **Trusted Web Activity (TWA)** — app Android nipis yang buka website PWA ni
fullscreen (tiada address bar). Tak perlu tulis kod Android.

## Sebelum mula (checklist)
- [ ] Folder PWA dah live di **HTTPS** dengan domain sebenar
- [ ] `https://DOMAIN/site.webmanifest` boleh dibuka
- [ ] Akaun Google Play Console (bayar sekali USD25)
- [ ] Ada **privacy policy URL** (Play Console minta; app ni tak kumpul data)

## Nilai yang guna (kekalkan sama di semua langkah)
| Item | Nilai |
|---|---|
| Package ID | `com.pilihlah.app` (boleh tukar, tapi MESTI sama dengan `assetlinks.json`) |
| App name / Launcher name | PilihLah |
| Start URL | `/` (atau subfolder kalau di-host dalam subfolder) |
| Theme / Background / Navigation colour | `#0D0D12` |
| Icon 512 | `icons/android-chrome-512x512.png` |
| Maskable icon | `icons/maskable-512x512.png` |
| Orientation | portrait |

## Cara A — PWABuilder (paling senang, ada UI)
1. Buka https://www.pwabuilder.com , masukkan URL website.
2. **Package for stores → Android → Google Play**.
3. Isi nilai dalam jadual atas. Signing key: pilih **New** untuk build pertama.
4. Download zip → dalam tu ada `.aab` (untuk Play Console) + **keystore**.
   **SIMPAN keystore + password. Hilang = tak boleh update app selama-lamanya.**

## Cara B — Bubblewrap CLI (dalam PC dev sendiri)
```
npm i -g @bubblewrap/cli
bubblewrap init --manifest=https://DOMAIN/site.webmanifest
bubblewrap build          # hasilkan app-release-bundle.aab (+ signed apk)
```
Bubblewrap akan tanya/download JDK & Android SDK kali pertama.

## WAJIB: assetlinks.json (kalau tak, address bar Chrome muncul dalam app)
1. Upload `.aab` ke Play Console (Internal testing dulu).
2. Play Console → app → **Setup → App integrity → App signing** →
   salin **SHA-256 certificate fingerprint** (App signing key).
3. Edit `.well-known/assetlinks.json` di server:
   - `package_name` = package ID di atas
   - ganti `REPLACE:WITH:...` dengan fingerprint tadi
   - (kalau nak test APK yang di-sign dengan keystore sendiri, tambah fingerprint
     keystore tu sebagai entry kedua dalam array)
4. Pastikan `https://DOMAIN/.well-known/assetlinks.json` boleh dibuka di browser.
5. Install dari Play (internal testing) — kalau masih nampak address bar, fingerprint/package tak padan.

## Nota Play Store 2026
- Sejak **31 Ogos 2026**, app baru mesti **target API level 36 (Android 16)**.
  Pastikan versi PWABuilder/Bubblewrap yang guna menghasilkan target ini;
  kalau Play Console tolak, update tool tu ke versi terkini.
- Aset listing dah siap dalam `store_assets/`:
  `play_store_icon_512.png`, `feature_graphic_1024x500.png`,
  `phone_screenshots/` (1080x1920, min. 2 diperlukan).

## Bila update app
- Ubah HTML/CSS/JS di server → user dapat versi baru (buka app 2x). **Tak perlu hantar semula ke Play Store.**
  Untuk paksa refresh cache, tukar `VERSION` dalam `sw.js`.
- Hantar `.aab` baru ke Play Store hanya bila tukar setting Android (nama, icon, warna, package).
  Naikkan `versionCode` setiap kali.

## Paywall nanti
TWA menyokong Play Billing (Digital Goods API). Bincang masa nak tambah "Tambah pilihan (Premium)".
