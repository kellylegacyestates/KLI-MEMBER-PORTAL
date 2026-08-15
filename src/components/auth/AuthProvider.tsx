"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { fetchUserProfile, type ResolvedUserProfile, type UserRole, type MembershipStatus, type AccountStatus } from "@/lib/firebase/userProfile";

type AuthContextValue = {
  user: User | null;
  profile: ResolvedUserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  accountStatus: AccountStatus | null;
  membershipStatus: MembershipStatus | null;
  /** True only when profile.role === "admin".  Fails closed on any ambiguity. */
  isAdmin: boolean;
  /** True only when profile.role === "executive" or "admin". */
  isExecutive: boolean;
  /** True only when profile.role === "instructor". */
  isInstructor: boolean;
  /** Call after a registration to immediately load the new profile. */
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  role: null,
  accountStatus: null,
  membershipStatus: null,
  isAdmin: false,
  isExecutive: false,
  isInstructor: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ResolvedUserProfile | null>(null);
  // loading covers both the Auth state resolution AND the initial profile fetch.
  const [loading, setLoading] = useState(auth !== null);

  const loadProfile = useCallback(async (uid: string) => {
    if (!db) {
      // Firestore unavailable — fail closed (no profile, no elevated role).
      setProfile(null);
      return;
    }
    const fetched = await fetchUserProfile(db, uid);
    setProfile(fetched);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.uid);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        await loadProfile(nextUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      role: profile?.role ?? null,
      accountStatus: profile?.accountStatus ?? null,
      membershipStatus: profile?.membershipStatus ?? null,
      // Fail closed: only true when profile explicitly says "admin".
      isAdmin: profile?.role === "admin",
      isExecutive: profile?.role === "executive" || profile?.role === "admin",
      isInstructor: profile?.role === "instructor",
      refreshProfile,
    }),
    [user, profile, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
