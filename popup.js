document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: findYouTubeLinksInPageSource
    }, (results) => {
      let links = results[0].result;
      console.log(links);

      if (links.length > 0) {
        showLinks(links);
      } else {
        alert('YouTube video link not found!');
      }
    });
  });
});

function findYouTubeLinksInPageSource() {

  const youtubeLinkPatterns = [
    /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/gi,
    /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/gi,
    /https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/gi,
    /https:\/\/www\.youtube\.com\/channel\/([a-zA-Z0-9_-]+)/gi,
    /https:\/\/www\.youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/gi,
    /https:\/\/www\.youtube\.com\/live\/([a-zA-Z0-9_-]+)/gi,
    /https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/gi,
    /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)&t=\d+s/gi,
    /https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)\?start=\d+/gi,
    /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)&list=([a-zA-Z0-9_-]+)/gi,
    /https:\/\/m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/gi
  ];

  let body = document.body.getHTML();
  let matches = [];
  let i = 0;

  body.split("\n").forEach(line => {
    youtubeLinkPatterns.forEach(pattern => {
      let match = '';
      if (match = line.match(pattern)) {
        matches[i++] = match;
      }
    });
  });

  return matches;

}
  

// Function to display the list of found YouTube links in the popup
function showLinks(links) {
  const listContainer = document.getElementById('link-list');
  listContainer.innerHTML = ''; // Clear previous links

  links.forEach(link => {
    const listItem = document.createElement('li');
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = link;
    linkElement.target = '_blank'; // Open in a new tab
    listItem.appendChild(linkElement);
    listContainer.appendChild(listItem);
  });
}
