// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'fetch-problems') {
        console.log("hello");
      // Fetch the list of problems from the LeetCode API
      fetch('https://leetcode.com/api/problems/all/')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // Send the list of problems back to the popup
          sendResponse({ problems: data.stat_status_pairs });
        });
      // Return true to indicate that a response will be sent asynchronously
      return true;
    }
  });