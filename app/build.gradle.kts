plugins { id("com.android.application") }
android {
    namespace = "com.highlow.battleground"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.highlow.battleground"
        minSdk = 24
        targetSdk = 35
        versionCode = 5
        versionName = "5.0.0"
    }
    buildTypes {
        release { isMinifyEnabled = false }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
dependencies {
    implementation("androidx.webkit:webkit:1.13.0")
}
