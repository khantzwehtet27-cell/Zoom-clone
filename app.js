// Firebase Configuration (မင်းရဲ့ ကိုယ်ပိုင် Firebase Keys တွေနဲ့ နောက်အဆင့်မှာ လာလဲရပါမယ်)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase ကို စတင်ပတ်မောင်းခြင်း (Initialize)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// UI UI Toggle Logic (Login <-> Sign Up ပြောင်းလဲပေးတဲ့ စနစ်)
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const btnPrimary = document.getElementById('btn-primary');
const switchAuth = document.getElementById('switch-auth');
const toggleText = document.getElementById('toggle-text');

let isLoginMode = true;

switchAuth.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (!isLoginMode) {
        authTitle.innerText = "Create Account";
        authSubtitle.innerText = "Sign up to start hosting global meetings";
        btnPrimary.innerText = "Sign Up";
        toggleText.innerHTML = 'Already have an account? <span id="switch-auth">Login</span>';
    } else {
        authTitle.innerText = "Welcome to Zoom Clone";
        authSubtitle.innerText = "Login to start or join a meeting";
        btnPrimary.innerText = "Login";
        toggleText.innerHTML = 'Don\'t have an account? <span id="switch-auth">Sign Up</span>';
    }
    // Dynamic ဖြစ်နေလို့ switch-auth ကို ပြန်လည် နားထောင်ခိုင်းရခြင်းဖြစ်ပါတယ်
    document.getElementById('switch-auth').addEventListener('click', arguments.callee);
});
