/**
 * Displays in a popup the result from the backend server
 * You can also insert a 'result' object manually, as defined below:
 * @param {Object = { 'success': Boolean, 'message': String }} result
 */
export function displayResultPopup(result) {
  const template = document.getElementById("pop-up-template");
  const popupElement = template.content.cloneNode(true);

  if (popupElement && template) {
    const headerElement = popupElement.querySelector("h2");
    headerElement.textContent = result.success ? "Success" : "Error";

    const textElement = popupElement.querySelector(".main-text");
    textElement.textContent = result.message;

    const buttonElement = popupElement.querySelector(".standard-button");
    buttonElement.style.backgroundColor = result.success
      ? "rgb(var(--green-1-rgb))"
      : "rgb(var(--red-rgb))";

    const closeButtonElement = popupElement.querySelector(".close-button");
    buttonElement.addEventListener("click", () => removeDisplayResultPopup());
    closeButtonElement.addEventListener("click", () =>
      removeDisplayResultPopup()
    );

    const body = document.getElementsByTagName("body")[0];
    const firstChild = body.firstChild;
    body.insertBefore(popupElement, firstChild);
  }
}

/**
 * Helper function to remove pop-up
 */
function removeDisplayResultPopup() {
  const popupElement = document.querySelector(".pop-up-wrapper");
  popupElement.remove();
}

/**
 * A helper function to delay events
 * @param {number} func 
 * @param {number} delay 
 * @returns 
 */
export function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
