// dom references
const selectButton = document.getElementById('select-button');
const nextlocButton = document.getElementById('next-loc-button');
const prevlocButton = document.getElementById('prev-loc-button');
const photoboothEl = document.querySelector('.photobooth-mock');
const cameraBtn = document.getElementById('menu-camera-button');
const uploadBtn = document.getElementById('menu-upload-button');
const logoEl = document.querySelector('.logo');


// button interactions + adding safe navigation
function addSafeNavigation(button, url, id) {
  if (!button) return;

  button.addEventListener('click', e => {
    if (typeof gtag === 'function') {
      gtag('event', 'button_click', {
        button_id: id || button.id || 'no-id',
        button_text: button.innerText || 'no-text',
      });
      console.log('GA event sent:', id || button.id);
    }

    e.preventDefault();
    setTimeout(() => (window.location.href = url), 100);
  });
}

// add more safe nav
addSafeNavigation(selectButton, 'theatre.html');
addSafeNavigation(nextlocButton, 'archives.html');
addSafeNavigation(prevlocButton, 'index.html');
addSafeNavigation(cameraBtn, 'camera.html');
addSafeNavigation(uploadBtn, 'upload.html');
addSafeNavigation(logoEl, 'archives.html', 'logo');