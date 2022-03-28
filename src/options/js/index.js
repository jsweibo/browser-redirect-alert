const RECOMMENDED_CONFIG = {
  status: true,
  patterns: [],
};

const configForm = document.querySelector('#config');
const statusInput = document.querySelector('#status');
const patternsInput = document.querySelector('#patterns');
const hintField = document.querySelector('.hint-field');
const hintText = document.querySelector('.hint-field .hint');
let needSave = false;

function notify({ type = '', message = '' }) {
  if (hintField.classList.length === 1) {
    hintText.textContent = message;
    if (type === 'success') {
      hintText.classList.add('hint_success');
      hintField.classList.add('hint-field_visible');
      setTimeout(function () {
        hintField.classList.remove('hint-field_visible');
        hintText.classList.remove('hint_success');
      }, 1e3);
    } else {
      hintText.classList.add('hint_error');
      hintField.classList.add('hint-field_visible');
      setTimeout(function () {
        hintField.classList.remove('hint-field_visible');
        hintText.classList.remove('hint_error');
      }, 1e3);
    }
  }
}

configForm.addEventListener('change', function () {
  needSave = true;
});

configForm.addEventListener('submit', function (event) {
  event.preventDefault();

  let savedConfig = {
    status: statusInput.checked,
    patterns: [],
  };

  if (patternsInput.value) {
    // check patterns syntax
    try {
      const patterns = JSON.parse(patternsInput.value);
      if (!Array.isArray(patterns)) {
        notify({
          type: 'error',
          message: 'Invalid Patterns',
        });
        return false;
      }
      patternsInput.value = JSON.stringify(patterns, null, 2);
    } catch (error) {
      notify({
        type: 'error',
        message: 'Error Patterns',
      });
      return false;
    }
    // pass check
    savedConfig.patterns = JSON.parse(patternsInput.value);
  }

  // save options
  chrome.storage.local.set(
    {
      config: savedConfig,
    },
    function () {
      notify({
        type: 'success',
        message: 'Saved',
      });
      needSave = false;
    }
  );
});

document.querySelector('#get-advice').addEventListener('click', function () {
  needSave = true;
  statusInput.checked = RECOMMENDED_CONFIG.status;
  patternsInput.value = JSON.stringify(RECOMMENDED_CONFIG.patterns, null, 2);
});

window.addEventListener('beforeunload', function (event) {
  if (needSave) {
    event.preventDefault();
    event.returnValue = '';
  }
});

// start
chrome.storage.local.get('config', function (res) {
  if ('config' in res) {
    if (res.config.status) {
      statusInput.checked = res.config.status;
    }
    if (res.config.patterns) {
      patternsInput.value = JSON.stringify(res.config.patterns, null, 2);
    }
  }
});
