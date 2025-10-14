/**
 * Firebase Admin Configuration
 * สำหรับ backup ข้อมูลไปยัง Firebase Storage
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error:', error.message);
  }
}

export const storage = admin.apps.length > 0 ? admin.storage() : null;
export const bucket = storage ? storage.bucket() : null;

export default admin;
