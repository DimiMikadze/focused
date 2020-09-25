/**
 * Renders the checkbox input that toggles focus mode.
 */
export async function renderToggle(
  focusMode: boolean,
  toggleFocusMode: () => void,
  parentElDataAttrName: string
): Promise<void> {
  const input: HTMLInputElement = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'toggle';
  input.checked = focusMode;
  input.onclick = toggleFocusMode;
  input.setAttribute('data-toggle', '');

  const parentEl = document.querySelector(`[${parentElDataAttrName}]`) as HTMLDivElement;
  parentEl.appendChild(input);
}
