// မင်းရဲ့ Screenshot ပါ အစစ်အမှန် Firebase Configuration Keys များ
const firebaseConfig = {
    apiKey: "AIzaSyBB5VyqQTkHTQ9n1xhzmFBNc15v77d2g6w",
    authDomain: "zwe-meet.firebaseapp.com",
    projectId: "zwe-meet",
    storageBucket: "zwe-meet.firebasestorage.app",
    messagingSenderId: "444155046848",
    appId: "1:444155046848:web:416a545fbd2cb9ffae3625"
};

// Firebase ကို စတင်ပတ်မောင်းခြင်း (Initialize)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- UI Toggle Logic (Login <-> Sign Up ပြောင်းလဲပေးတဲ့ စနစ်) ---
// ဒီကုဒ်တွေက index.html မှာရှိတဲ့ Form ကို ထိန်းချုပ်ဖို့ ဖြစ်ပါတယ်
if (document.getElementById('auth-title')) {
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const btnPrimary = document.getElementById('btn-primary');
    const switchAuth = document.getElementById('switch-auth');
    const toggleText = document.getElementById('toggle-text');

    let isLoginMode = true;

    switchAuth.addEventListener('click', function toggle() {
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
        // Re-bind click event for dynamic element
        document.getElementById('switch-auth').addEventListener('click', toggle);
    });
}
