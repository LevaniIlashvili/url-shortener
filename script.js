"use strict";

async function shortenURL(url) {
  try {
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    const data = await res.json();
    const result = data.result;
    if (!data.ok) throw Error(data.error);
    const { short_link: shortLink } = result;
    return shortLink;
  } catch (error) {
    errorContainer.textContent = error;
    console.error(error);
  }
}
