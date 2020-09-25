/**
 * Waits for a specified time before continuing the execution.
 */
export function delay(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
