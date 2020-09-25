/**
 * Animates the illustration based on the focus mode
 */
function renderIllustration(focusMode: boolean): void {
  const illustration = document.querySelector('[data-illustration]') as SVGAElement;

  if (focusMode) {
    return illustration.classList.add('illustration-on');
  }

  return illustration.classList.remove('illustration-on');
}

export default renderIllustration;
