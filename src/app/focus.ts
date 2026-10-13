/**
 * Leva o foco ao título principal da página (ou à área de conteúdo). Usado depois de uma troca de rota e quando a tela
 * muda de estado sem trocar de endereço (ex.: inscrição confirmada), para que teclado e leitores de tela não percam a posição.
 */
export function focusPageHeading(): void {
  const target = document.querySelector<HTMLElement>('#conteudo h1') ?? document.getElementById('conteudo');
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
