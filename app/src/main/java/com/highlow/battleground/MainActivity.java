package com.highlow.battleground;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.graphics.Insets;
import android.view.WindowManager;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.webkit.WebViewAssetLoader;

/** Bundled HTML5 game with HTTPS-like local origin; no JS interface or secret credentials. */
public final class MainActivity extends Activity {
    private static final String HOME = "https://appassets.androidplatform.net/assets/index.html";
    private WebView webView;
    private ProgressBar progress;
    private TextView error;

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        getWindow().setStatusBarColor(Color.rgb(7,19,16));
        getWindow().setNavigationBarColor(Color.rgb(7,19,16));
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
            .build();
        FrameLayout frame = new FrameLayout(this);
        frame.setBackgroundColor(Color.rgb(7,19,16));
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            frame.setOnApplyWindowInsetsListener((v, insets) -> {
                Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(bars.left,bars.top,bars.right,bars.bottom);
                return insets;
            });
        }
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(7,19,16));
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportMultipleWindows(false);
        settings.setBuiltInZoomControls(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        if (Build.VERSION.SDK_INT >= 26) settings.setSafeBrowsingEnabled(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) return false;
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme())
                    && "appassets.androidplatform.net".equals(uri.getHost())
                    && uri.getPath()!=null && uri.getPath().startsWith("/assets/")) return false;
                if ("https".equals(uri.getScheme()) || "http".equals(uri.getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW,uri)); }
                    catch (Exception ignored) { }
                }
                return true;
            }
            @Override public void onPageFinished(WebView view,String url) {
                progress.setVisibility(View.GONE);
            }
            @Override public void onReceivedError(WebView view,WebResourceRequest request,android.webkit.WebResourceError problem) {
                if (request.isForMainFrame()) {
                    progress.setVisibility(View.GONE);
                    error.setText("The packaged game could not load. Restart Battleground to try again.");
                    error.setVisibility(View.VISIBLE);
                }
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onJsConfirm(WebView view,String url,String message,JsResult result) {
                new AlertDialog.Builder(MainActivity.this).setTitle("Battleground")
                    .setMessage(message)
                    .setPositiveButton("Continue",(d,w)->result.confirm())
                    .setNegativeButton("Cancel",(d,w)->result.cancel())
                    .setOnCancelListener(d->result.cancel())
                    .show();
                return true;
            }
        });
        frame.addView(webView,new FrameLayout.LayoutParams(-1,-1));
        progress = new ProgressBar(this);
        frame.addView(progress,new FrameLayout.LayoutParams(60,60,android.view.Gravity.CENTER));
        error = new TextView(this);
        error.setTextColor(Color.WHITE);
        error.setTextSize(15);
        error.setGravity(android.view.Gravity.CENTER);
        error.setVisibility(View.GONE);
        frame.addView(error,new FrameLayout.LayoutParams(-1,-1));
        setContentView(frame);
        webView.loadUrl(HOME);
    }

    @Override public void onBackPressed() {
        if (webView==null) { super.onBackPressed(); return; }
        webView.evaluateJavascript("typeof window.highLowAndroidBack === 'function' ? window.highLowAndroidBack() : false", value -> {
            if (!"true".equals(value)) new AlertDialog.Builder(this)
                .setTitle("Exit Battleground?")
                .setMessage("Your unfinished solo game can be resumed next time.")
                .setNegativeButton("Keep playing",(d,w)->{})
                .setPositiveButton("Exit",(d,w)->finish()).show();
        });
    }
    @Override protected void onPause(){ if(webView!=null)webView.onPause(); super.onPause(); }
    @Override protected void onResume(){ super.onResume(); if(webView!=null)webView.onResume(); }
    @Override protected void onDestroy(){
        if(webView!=null){ webView.stopLoading(); webView.destroy(); webView=null; }
        super.onDestroy();
    }
}
