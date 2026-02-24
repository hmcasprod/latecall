// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-RidAbJBCvoxT6aalA-lXA1u5ZT1PC4o",
  authDomain: "hmcas-latecall.firebaseapp.com",
  projectId: "hmcas-latecall",
  storageBucket: "hmcas-latecall.appspot.com",
  messagingSenderId: "498700648548",
  appId: "1:498700648548:web:393d1676210823f7f49f71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===============================
// Submit a Late Call Request
// ===============================
export async function submitLateCall(data) {
  try {
    await addDoc(collection(db, "requests"), data);
    return true;
  } catch (error) {
    console.error("Error submitting data:", error);
    return false;
  }
}

// ===============================
// Get all Late Call Requests
// ===============================
export async function getLateCalls() {
  try {
    const snapshot = await getDocs(collection(db, "requests"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// ===============================
// Update Request Status (Approve/Reject)
// ===============================
export async function updateRequestStatus(id, status, processedBy) {
  try {
    const ref = doc(db, "requests", id);
    await updateDoc(ref, { status: status, processedBy: processedBy });
    return true;
  } catch (error) {
    console.error("Error updating status:", error);
    return false;
  }
}