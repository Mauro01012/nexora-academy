import { useSyncExternalStore } from 'react';
import { getActiveBrand, subscribeBrand } from '@/services/brandStore';
import type { ActiveBrand } from '@/services/brandStore';

/** Marca em uso: os padrões de src/config/brand.ts com as alterações feitas no painel administrativo. */
export function useBrand(): ActiveBrand {
  return useSyncExternalStore(subscribeBrand, getActiveBrand, getActiveBrand);
}
