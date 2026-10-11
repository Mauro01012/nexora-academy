import { useSyncExternalStore } from 'react';
import * as store from '@/services/demoStore';

/** Estado da sessão demonstrativa e as ações da conta. Tudo é simulado e fica apenas neste navegador. */
export function useAuth() {
  const snapshot = useSyncExternalStore(store.subscribeDemo, store.getDemoSnapshot, store.getDemoSnapshot);
  const user = snapshot.session ? (snapshot.accounts.find((a) => a.email === snapshot.session) ?? null) : null;
  return {
    user,
    isAuthenticated: user !== null,
    signUp: store.signUp,
    logIn: store.logIn,
    logOut: store.logOut,
    resetDemo: store.resetDemo,
    enroll: store.enroll,
    unenroll: store.unenroll,
    advanceLesson: store.advanceLesson,
  };
}
