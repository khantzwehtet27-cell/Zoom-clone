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

// Global Variable အဖြစ် အသုံးပြုရန်
let isLoginMode = true;

// ==========================================
// 1. SIGN UP / LOGIN TOGGLE LOGIC (index.html အတွက်)
// ==========================================
if (document.getElementById('auth-title')) {
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const btnPrimary = document.getElementById('btn-primary');
    const switchAuth = document.getElementById('switch-auth');
    const toggleText = document.getElementById('toggle-text');

    switchAuth.addEventListener('click', function toggle() {
        isLoginMode = !isLoginMode;
        if (!isLoginMode) {
            authTitle.innerText = "Create Account";
            authSubtitle.innerText = "Sign up to start hosting global meetings";
            btnPrimary.innerText = "Sign Up";
            toggleText.innerHTML = 'Already have an account? <span id="switch-auth">Login</span>';
        } else {
            authTitle.innerText = "Welcome to Skymeet";
            authSubtitle.innerText = "Login to start or join a meeting";
            btnPrimary.innerText = "Login";
            toggleText.innerHTML = 'Don\'t have an account? <span id="switch-auth">Sign Up</span>';
        }
        document.getElementById('switch-auth').addEventListener('click', toggle);
    });
}

// ==========================================
// 2. FIREBASE AUTH SUBMIT LOGIC (အကောင့်ဖွင့်/ဝင်ခြင်း)
// ==========================================
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (isLoginMode) {
            // လော့ဂ်အင်ဝင်ခြင်း Logic
            auth.signInWithEmailAndPassword(email, password)
                .then(() => { window.location.href = 'dashboard.html'; })
                .catch(err => alert("Error: " + err.message));
        } else {
            // အကောင့်အသစ်ဖွင့်ခြင်း Logic
            auth.createUserWithEmailAndPassword(email, password)
                .then(() => { window.location.href = 'dashboard.html'; })
                .catch(err => alert("Error: " + err.message));
        }
    });
}

// ==========================================
// 3. CREATE MEETING LOGIC (ကိုယ်ပိုင် Passcode စနစ်)
// ==========================================
const btnCreate = document.getElementById('btn-create-meeting');
if (btnCreate) {
    btnCreate.addEventListener('click', () => {
        const passcode = document.getElementById('create-passcode').value;
        if (!passcode) return alert("Please set a passcode first!");

        // Random နံပါတ် ၉ လုံးသုံးပြီး Meeting ID ထုတ်ပေးခြင်း (ဥပမာ - 482-192-304)
        const n1 = Math.floor(100 + Math.random() * 900);
        const n2 = Math.floor(100 + Math.random() * 900);
        const n3 = Math.floor(100 + Math.random() * 900);
        const meetingId = `${n1}-${n2}-${n3}`;

        // Jitsi အတွက် ထပ်မံမတူညီနိုင်မည့် သီးသန့် Room Name ဖန်တီးခြင်း
        const jitsiRoom = "Skymeet_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

        // အချက်အလက်များကို Firebase Firestore Database ထဲသို့ လှမ်းသိမ်းခြင်း
        db.collection("meetings").doc(meetingId).set({
            meetingId: meetingId,
            passcode: passcode,
            roomName: jitsiRoom,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            // Screen ပေါ်တွင် Host အား Meeting ID ပြပေးခြင်း
            document.getElementById('meeting-info').innerHTML = `
                <div style="background: #242629; padding: 15px; border-radius: 8px; margin-top: 15px; border: 1px solid #2cb67d;">
                    <p style="color: #2cb67d; font-weight: bold; margin-bottom: 5px;">Meeting Ready!</p>
                    <p style="color: white; margin-bottom: 5px;"><b>ID:</b> ${meetingId}</p>
                    <p style="color: white; margin-bottom: 10px;"><b>Passcode:</b> ${passcode}</p>
                    <a href="meeting.html?room=${jitsiRoom}" style="display: inline-block; background: #2cb67d; color: white; padding: 8px 12px; border-radius: 5px; text-decoration: none; font-weight: bold;">Start Meeting (Host)</a>
                </div>
            `;
        }).catch(err => alert("Database Error: " + err.message));
    });
}

// ==========================================
// 4. JOIN MEETING LOGIC (Passcode မှန်မှ ပေးဝင်မည့်စနစ်)
// ==========================================
const btnJoin = document.getElementById('btn-join-meeting');
if (btnJoin) {
    btnJoin.addEventListener('click', () => {
        const id = document.getElementById('join-id').value.trim();
        const passcode = document.getElementById('join-passcode').value;

        if (!id || !passcode) return alert("Please enter both Meeting ID and Passcode!");

        // Database ထဲမှာ ရိုက်ထည့်လိုက်တဲ့ Meeting ID ရှိမရှိ သွားရှာခြင်း
        db.collection("meetings").doc(id).get().then((doc) => {
            if (doc.exists) {
                const meetingData = doc.data();
                
                // Passcode ကိုက်ညီမှု ရှိမရှိ စစ်ဆေးခြင်း
                if (meetingData.passcode === passcode) {
                    // Passcode မှန်ကန်ပါက ၎င်းနှင့်ဆိုင်သော Jitsi Room သို့ ပို့ပေးခြင်း
                    window.location.href = `meeting.html?room=${meetingData.roomName}`;
                } else {
                    alert("❌ Incorrect Passcode! Access Denied.");
                }
            } else {
                alert("❌ Meeting ID not found! Please check again.");
            }
        }).catch(err => alert("Error: " + err.message));
    });
}

// ==========================================
// 5. LOGOUT LOGIC
// ==========================================
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        auth.signOut().then(() => { window.location.href = 'index.html'; });
    });
}

// ==========================================
// 6. SECURITY & ROUTE GUARD (လုံခြုံရေးအတွက် လမ်းကြောင်းစစ်ဆေးခြင်း)
// ==========================================
auth.onAuthStateChanged((user) => {
    const currentPage = window.location.pathname.split("/").pop();
    
    if (user) {
        // အကောင့်ဝင်ထားပြီးသားဖြစ်ပါက Login Page တွင်မထားဘဲ Dashboard သို့ ပို့ခြင်း
        if (currentPage === "index.html" || currentPage === "") {
            window.location.href = "dashboard.html";
        }
    } else {
        // အကောင့်မဝင်ရသေးပါက Dashboard နှင့် Meeting ခန်းများသို့ ပေးမဝင်ဘဲ Login Page သို့ ပြန်မောင်းထုတ်ခြင်း
        if (currentPage === "dashboard.html" || currentPage === "meeting.html") {
            window.location.href = "index.html";
        }
    }
});
