/** Mensagem de confirmação que sobrevive a uma navegação (ex.: "Curso salvo") e é lida uma única vez. */
let message: string | null = null;
export const setFlash = (text: string): void => {
  message = text;
};
export const takeFlash = (): string | null => {
  const current = message;
  message = null;
  return current;
};
