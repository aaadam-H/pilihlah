package com.pilihlah.webapp

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

/**
 * PilihLah is a fully local, offline-first app: the entire UI lives in
 * app/src/main/assets/www (index.html/style.css/app.js) and is loaded from
 * file:///android_asset/. There is no backend and no network permission —
 * everything the ViewModel would have held in the native version instead
 * lives as plain JS state inside app.js.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        webView.settings.apply {
            javaScriptEnabled = true
            // No remote content is ever loaded, but domStorage costs nothing
            // to enable and keeps the door open for future local persistence.
            domStorageEnabled = true
            allowFileAccess = true
        }
        webView.webViewClient = WebViewClient() // keep navigation inside the WebView
        webView.loadUrl("file:///android_asset/www/index.html")

        // Let the in-page "back" (e.g. Result -> Deciding -> Input) work with
        // the system back gesture/button before exiting the app.
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
