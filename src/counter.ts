// Simple counter setup for demo button
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  // Updates the button text with the current count
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  // Increment counter on button click
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}
