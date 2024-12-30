document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('linksList');
  const toggle = document.getElementById('filterToggle');

  chrome.storage.local.get(['filterLinks', 'isEnabled'], (result) => {
    if (result.filterLinks) {
      textarea.value = result.filterLinks.join('\n');
    }
    toggle.checked = result.isEnabled ?? true;
  });

  textarea.addEventListener('input', () => {
    const links = textarea.value.split('\n').filter(link => link.trim());
    chrome.storage.local.set({ filterLinks: links }, () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'updateFilters' });
      });
    });
  });

  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ isEnabled: toggle.checked }, () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'toggleFilter',
          enabled: toggle.checked
        });
      });
    });
  });
});
