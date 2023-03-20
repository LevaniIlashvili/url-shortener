"use strict";

const shortenUrl = document.querySelector(".btn-shorten-url");
const inputUrlDOM = document.querySelector(".input-url");
const savedUrls = document.querySelector(".saved-urls");
const errorContainer = document.querySelector(".error-container");

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

    if (!data.ok) throw Error(errorCodes[data.error_code]);

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
        <div class="shortened-url">
        <p>${shortLink}</p>
          <button class="btn-cyan btn-copy">Copy</button>
          </div>
      </div>
      `;
  savedUrls.insertAdjacentHTML("afterbegin", markup);
}

shortenUrl.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    errorContainer.textContent = "";
    const inputLink = inputUrlDOM.value;
    const shortLink = await shortenURL(inputLink);
    if (!shortLink) return;
    addURLDom(inputLink, shortLink);
    inputUrlDOM.value = "";
  } catch (error) {
    console.error(error);
  }
});
