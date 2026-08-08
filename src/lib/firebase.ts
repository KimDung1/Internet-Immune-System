import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  limit, 
  doc, 
  setDoc,
  getDoc,
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ScanResult } from '../types';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Translate raw Firebase Auth error codes into clear Vietnamese messages
 */
export function getVietnameseAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký tài khoản trước đó. Vui lòng đăng nhập hoặc dùng email khác.';
    case 'auth/invalid-email':
      return 'Định dạng email không hợp lệ. Vui lòng kiểm tra lại.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu! Mật khẩu cần có ít nhất 6 ký tự.';
    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản tương ứng với email này.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Tên đăng nhập hoặc mật khẩu không chính xác.';
    case 'auth/popup-closed-by-user':
      return 'Bạn đã hủy/đóng cửa sổ đăng nhập Google.';
    case 'auth/too-many-requests':
      return 'Tài khoản bị tạm khóa do thử quá nhiều lần. Vui lòng thử lại sau ít phút.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại Internet.';
    default:
      return error?.message || 'Đã xảy ra lỗi xác thực tài khoản.';
  }
}

/**
 * Sync user document in Firestore on login or registration
 */
export async function syncUserProfileToFirestore(user: User) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Chiến Binh Mạng',
        photoURL: user.photoURL || '',
        trustScore: 85,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } else {
      await setDoc(userRef, {
        lastLogin: new Date().toISOString(),
        displayName: user.displayName || snap.data().displayName
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Sync user profile to Firestore error:', err);
  }
}

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfileToFirestore(result.user);
    }
    return result.user;
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, pass: string, name: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      await syncUserProfileToFirestore(res.user);
    }
    return res.user;
  } catch (error) {
    console.error('Email Register Error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await syncUserProfileToFirestore(res.user);
    }
    return res.user;
  } catch (error) {
    console.error('Email Login Error:', error);
    throw error;
  }
};

export const sendResetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password Reset Error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const subscribeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore helper methods for Scan Logs
export const saveScanToFirestore = async (scan: ScanResult, userId?: string) => {
  try {
    const docData = {
      ...scan,
      userId: userId || auth.currentUser?.uid || 'guest_user',
      createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, 'scans'), docData);
  } catch (err) {
    console.warn('Firestore save warning:', err);
  }
};

export const getUserScansFromFirestore = async (userId: string): Promise<ScanResult[]> => {
  try {
    const q = query(
      collection(db, 'scans'),
      where('userId', '==', userId),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const results: ScanResult[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push(data as ScanResult);
    });
    return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.warn('Firestore fetch warning:', err);
    return [];
  }
};

// Firestore Community Reports
export const saveCommunityReportToFirestore = async (report: any) => {
  try {
    await addDoc(collection(db, 'community_reports'), {
      ...report,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Firestore community report error:', err);
  }
};

export const getCommunityReportsFromFirestore = async () => {
  try {
    const q = query(collection(db, 'community_reports'), limit(50));
    const snap = await getDocs(q);
    const list: any[] = [];
    snap.forEach((d) => list.push(d.data()));
    return list;
  } catch (err) {
    console.warn('Firestore fetch community reports error:', err);
    return [];
  }
};

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Firestore offline mode or test doc missing");
    }
  }
}
testConnection();
