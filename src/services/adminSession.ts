/**
 * Modo administrador SIMULADO. Não existe autorização: qualquer pessoa que abra /admin pode ativá-lo.
 * O estado fica no sessionStorage (acaba ao fechar a aba) e é independente da conta de aluno.
 */
const KEY = 'nexora.admin.v1';
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return window.sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}
let active = read();

function set(value: boolean): void {
  active = value;
  try {
    if (value) window.sessionStorage.setItem(KEY, '1');
    else window.sessionStorage.removeItem(KEY);
  } catch {
    /* mantém só em memória */
  }
  listeners.forEach((l) => l());
}

export const subscribeAdmin = (l: () => void): (() => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getAdminSnapshot = (): boolean => active;
export const enterAdmin = (): void => set(true);
export const leaveAdmin = (): void => set(false);
