import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, useMockBackend } from "@/services/firebase";
import { MOCK_USER } from "@/services/mockData";
import { UserProfile } from "@/types/models";

const SESSION_KEY = "piataauto_session";

export type AuthPayload = { email: string; password: string; name?: string; phone?: string };

export const authService = {
  async signUp(payload: AuthPayload): Promise<UserProfile> {
    if (useMockBackend || !auth) {
      const user: UserProfile = {
        ...MOCK_USER,
        id: `mock-${Date.now()}`,
        name: payload.name || MOCK_USER.name,
        email: payload.email,
        phone: payload.phone || MOCK_USER.phone,
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }

    const credentials = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
    if (payload.name) {
      await updateProfile(credentials.user, { displayName: payload.name });
    }
    const user: UserProfile = {
      id: credentials.user.uid,
      name: payload.name || credentials.user.displayName || "New User",
      email: payload.email,
      phone: payload.phone || "",
      avatarUrl: credentials.user.photoURL || "",
      createdAt: new Date().toISOString(),
    };
    if (db) {
      await setDoc(doc(db, "users", user.id), user);
    }
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async signIn(payload: AuthPayload): Promise<UserProfile> {
    if (useMockBackend || !auth) {
      const saved = await AsyncStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved) as UserProfile;
      const user = { ...MOCK_USER, email: payload.email };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }

    const credentials = await signInWithEmailAndPassword(auth, payload.email, payload.password);
    const baseUser: UserProfile = {
      id: credentials.user.uid,
      name: credentials.user.displayName || "User",
      email: credentials.user.email || payload.email,
      phone: credentials.user.phoneNumber || "",
      avatarUrl: credentials.user.photoURL || "",
      createdAt: new Date().toISOString(),
    };
    const user = db
      ? await (async () => {
          const snap = await getDoc(doc(db, "users", credentials.user.uid));
          if (!snap.exists()) {
            await setDoc(doc(db, "users", credentials.user.uid), baseUser);
            return baseUser;
          }
          return snap.data() as UserProfile;
        })()
      : baseUser;
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async restoreSession() {
    const saved = await AsyncStorage.getItem(SESSION_KEY);
    return saved ? (JSON.parse(saved) as UserProfile) : null;
  },

  async logout() {
    if (!useMockBackend && auth) await signOut(auth);
    await AsyncStorage.removeItem(SESSION_KEY);
  },

  async updateMe(userId: string, patch: Partial<UserProfile>) {
    const current = await this.restoreSession();
    if (!current) return null;
    const updated = { ...current, ...patch };
    if (db) await updateDoc(doc(db, "users", userId), patch);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    return updated;
  },
};
