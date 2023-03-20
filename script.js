"use strict";

const shortenURLDOM = document.querySelector(".btn-shorten-url");
const inputURLDOM = document.querySelector(".input-url");
const savedURLs = document.querySelector(".saved-urls");
const errorContainer = document.querySelector(".error-container");
const copyBtn = document.querySelector(".btn-copy");

const errorCodes = {
  1: "Please add a link",
  2: "Invalid link",
  3: "Wait a second and try again",
  4: "IP-Address has been blocked",
  6: "Unknown error",
  10: "Disallowed link",
};

async function shortenURL(url) {
  try {
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    const data = await res.json();
    const result = data.result;

    const errorCode = data.error_code;
    if (!data.ok) throw Error(errorCodes[errorCode]);

    const { short_link: shortLink } = result;
    return shortLink;
  } catch (error) {
    errorContainer.textContent = error;
    console.error(error);
  }
}

function addURLDom(originalLink, shortLink) {
  const markup = `
      <div class="url-container">
        <p class="original-url">${originalLink}</p>
        <div class="shortened-url-container">
        <p class="shortened-url">${shortLink}</p>
          <button class="btn-cyan btn-copy">Copy</button>
          </div>
      </div>
      `;
  savedURLs.insertAdjacentHTML("afterbegin", markup);
}

shortenURLDOM.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    errorContainer.textContent = "";
    const inputLink = inputURLDOM.value;
    const shortLink = await shortenURL(inputLink);
    if (!shortLink) return;
    addURLDom(inputLink, shortLink);
    inputURLDOM.value = "";
  } catch (error) {
    console.error(error);
  }
});

// copy link to clipboard functionality
savedURLs.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-copy")) return;

  const clickedBtn = e.target;

  const selectedURL = clickedBtn
    .closest(".shortened-url-container")
    .querySelector(".shortened-url").textContent;

  // copy to clipboard
  navigator.clipboard.writeText(selectedURL);

  clickedBtn.style.backgroundColor = "hsl(257, 27%, 26%)";
  clickedBtn.textContent = "Copied!";
});
