function executeScript(details) {
  const temp = document.createElement('script');
  temp.textContent = details.code;
  document.documentElement.insertBefore(
    temp,
    document.documentElement.firstChild
  );
  temp.remove();
}

// start
chrome.storage.local.get('config', function (res) {
  if ('config' in res) {
    if (res.config.status) {
      const patterns = res.config.patterns.map(function (item) {
        return new RegExp(item);
      });

      for (let pattern of patterns) {
        if (pattern.test(location.href)) {
          executeScript({
            code: `
              (function () {
                const _alert = window.alert;
                window.alert = function (message) {
                  console.log(message);
                };
              })();
              `,
          });
          break;
        }
      }
    }
  }
});
