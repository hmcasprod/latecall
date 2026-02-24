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

// Submit Late Call
export async function submitLateCall(data) {
  try {
    // Create date and time for submission (dateSubmitted) and keep user selected date (lateCallDate)
    const dateSubmitted = new Date();  // Capture the actual current date and time of form submission
    const lateCallDate = new Date(data.date);  // User selected date for late call

    // Add both `dateSubmitted` (current time) and `lateCallDate` (user-selected date)
    await addDoc(collection(db, "requests"), {
      ...data,  // Include all the form data
      dateSubmitted: dateSubmitted.toISOString(),  // Store the actual submission date and time
      lateCallDate: lateCallDate.toISOString().split('T')[0],  // Store user selected date as YYYY-MM-DD
      timeout: data.timeout,  // Store the timeout as selected by the user
    });
    return true;
  } catch (err) {
    console.error("Error submitting data:", err);
    return false;
  }
}

// Get all Late Calls
export async function getLateCalls() {
  try {
    const snapshot = await getDocs(collection(db, "requests"));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        dateSubmitted: data.dateSubmitted,  // Include actual submission date
        lateCallDate: data.lateCallDate,    // Include late call date
        timeout: data.timeout,              // Include timeout
        ...data  // Spread other fields (e.g., name, corp, hub, shift, etc.)
      };
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
}

// Update request status
export async function updateRequestStatus(id, status, processedBy) {
  try {
    const ref = doc(db, "requests", id);
    await updateDoc(ref, { status, processedBy });
    return true;
  } catch (err) {
    console.error("Error updating status:", err);
    return false;
  }
}
