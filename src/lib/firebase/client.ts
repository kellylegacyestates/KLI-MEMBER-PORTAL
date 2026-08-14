import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasRequiredConfig = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.trim().length > 0
);

const hasPlaceholderValues = Object.values(firebaseConfig).some((value) => {
  if (typeof value !== "string") {
    return true;
  }

  const normalized = value.trim().toLowerCase();
  return (
    normalized === "your_api_key_here" ||
    normalized === "your_project_id" ||
    normalized.includes("your_") ||
    normalized.includes("placeholder") ||
    normalized.includes("example")
  );
});

const canInitializeClient =
  typeof window !== "undefined" && hasRequiredConfig && !hasPlaceholderValues;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (canInitializeClient) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else if (!hasRequiredConfig || hasPlaceholderValues) {
  console.warn(
    "Firebase Web App configuration is missing or still uses placeholder values. Add the required NEXT_PUBLIC_FIREBASE_* values before enabling member authentication."
  );
}

export { auth, db };
