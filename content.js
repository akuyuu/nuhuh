let hiddenTweets = new Map();

function removeMatchingTweets() {
  chrome.storage.local.get(['filterLinks', 'isEnabled'], (result) => {
    if (!result.filterLinks || !result.isEnabled) return;

    const articles = document.querySelectorAll('article');
    articles.forEach(article => {
      const links = article.querySelectorAll('a');
      links.forEach(link => {
        if (result.filterLinks.some(filterLink => 
          link.href.includes(filterLink.trim())
        )) {
          hiddenTweets.set(article, article.cloneNode(true));
          article.remove();
        }
      });
    });
  });
}

function restoreTweets() {
  hiddenTweets.forEach((clone, original) => {
    if (!document.body.contains(original)) {
      const articles = document.querySelectorAll('article');
      let inserted = false;
      articles.forEach(article => {
        if (!inserted && article.compareDocumentPosition(original) & Node.DOCUMENT_POSITION_FOLLOWING) {
          article.parentNode.insertBefore(clone, article);
          inserted = true;
        }
      });
      if (!inserted && articles.length > 0) {
        articles[articles.length - 1].parentNode.appendChild(clone);
      }
    }
  });
  hiddenTweets.clear();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'updateFilters') {
    restoreTweets();
    removeMatchingTweets();
  } else if (message.type === 'toggleFilter') {
    if (message.enabled) {
      removeMatchingTweets();
    } else {
      restoreTweets();
    }
  }
});

const observer = new MutationObserver(removeMatchingTweets);
observer.observe(document.body, {
  childList: true,
  subtree: true
});

removeMatchingTweets();
