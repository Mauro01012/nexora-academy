import { useSyncExternalStore } from 'react';
import { enterAdmin, getAdminSnapshot, leaveAdmin, subscribeAdmin } from '@/services/adminSession';

export function useAdmin() {
  const isAdmin = useSyncExternalStore(subscribeAdmin, getAdminSnapshot, getAdminSnapshot);
  return { isAdmin, enter: enterAdmin, leave: leaveAdmin };
}
