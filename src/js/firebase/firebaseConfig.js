import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA1_sVx6t0iuv7p6ZUuSZfTFSugfkAQN7s',
  authDomain: 'prime-transfer-2024.firebaseapp.com',
  projectId: 'prime-transfer-2024',
  storageBucket: 'prime-transfer-2024.appspot.com', // 🔧 виправлено .app на .appspot.com
  messagingSenderId: '452919168162',
  appId: '1:452919168162:web:5f5757e8b6f2cfcd6c5bfb',
  measurementId: 'G-0VKE4DQ9YW',
};

// Ініціалізація додатку Firebase
const app = initializeApp(firebaseConfig);

// Отримуємо доступ до Storage
export const storage = getStorage(app);
