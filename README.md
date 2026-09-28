# PilihLah (PWA)

Satu folder ni = keseluruhan app. Tak perlu build step, tak perlu npm.

## Letak di server
1. Upload **semua** kandungan folder ni ke root website (cth `public_html/`),
   atau ke subfolder (cth `public_html/pilihlah/`) — dua-dua jalan.
2. **PENTING:** pastikan fail tersembunyi (dot-files) turut ke-upload:
   `.well-known/` dan `.htaccess`. Sesetengah FTP client / drag-drop
   abaikan fail bermula titik. Tick "show hidden files".
3. Website mesti **HTTPS** (service worker & Play Store wajibkan).
4. Buka `https://domain-korang/` — sepatutnya dah boleh "Install app" dari Chrome.

## Apa dalam folder
| Fail | Fungsi |
|---|---|
| `index.html`, `style.css`, `app.js` | App |
| `sw.js` | Service worker (offline). Tukar `VERSION` dalam fail ni bila deploy update besar |
| `site.webmanifest` | Manifest PWA (nama, warna, icon, screenshot) |
| `icons/`, `favicon.ico` | Semua icon |
| `screenshots/` | Screenshot untuk install prompt |
| `.well-known/assetlinks.json` | **Template** — wajib diisi sebelum publish ke Play Store |
| `.htaccess` / `_headers` | Config Apache / Netlify+Cloudflare |
| `android-build/` | Panduan + aset untuk dev yang nak buat .apk/.aab (boleh dipadam dari server, tak diperlukan untuk web) |

## Nak jadikan app Play Store (.apk/.aab)
Baca `android-build/README-ANDROID.md`.

## Test lokal
`python3 -m http.server 8000` dalam folder ni, buka `http://localhost:8000`.
(Service worker jalan atas localhost; tak jalan atas `file://`.)

## Paywall (masa depan)
Logic dalam `app.js`: `MAX_FREE_OPTIONS`, `canAddOption()`. Butang "+ Tambah pilihan"
masih locked.
