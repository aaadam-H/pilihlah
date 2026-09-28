# Keep the JS bridge (if we ever add @JavascriptInterface methods).
-keepclassmembers class com.pilihlah.webapp.* {
    @android.webkit.JavascriptInterface <methods>;
}
