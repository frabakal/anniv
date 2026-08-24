// constants
const WIDTH = 600, HEIGHT = 1800;

// dom elements
const canvas = document.getElementById('finalCanvas'),
      ctx = canvas.getContext('2d'),
      addBlushBtn = document.getElementById('addBlush'),
      addRibbonBtn = document.getElementById('addRibbon'),
      addSparkleBtn = document.getElementById('addSparkle'),
      addKissBtn = document.getElementById('addKiss'),
      addHeartBtn = document.getElementById('addHeart'),
      addWhatBtn = document.getElementById('addWhat'),
      downloadBtn = document.getElementById('downloadBtn'),
      homeBtn = document.getElementById('homeBtn'),
      resetBtn = document.getElementById('reset');

// sticker state
let stickers = [], dragOffset = { x: 0, y: 0 }, selectedSticker = null;

// load photo
const finalImage = new Image(), dataURL = localStorage.getItem('photoStrip');
if (dataURL) {
  finalImage.src = dataURL;
  finalImage.onload = drawCanvas;
  localStorage.removeItem('photoStrip');
} else alert("No photo found!");

// draw canvas
function drawCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(finalImage, 0, 0, WIDTH, HEIGHT);
  stickers.forEach(s => ctx.drawImage(s.img, s.x, s.y, s.width, s.height));
}

// add sticker
function addSticker(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    stickers.push({
      img,
      x: WIDTH / 2 - img.width / 6,
      y: HEIGHT / 2 - img.height / 6,
      width: img.width / 2.5,
      height: img.height / 2.5,
      dragging: false
    });
    drawCanvas();
  };
}

// pointer position
function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect(), scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
  const clientX = e.touches?.[0]?.clientX ?? e.clientX,
        clientY = e.touches?.[0]?.clientY ?? e.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

// drag and drop
function pointerDown(e) {
  const { x: mouseX, y: mouseY } = getPointerPos(e);
  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];
    if (mouseX >= s.x && mouseX <= s.x + s.width && mouseY >= s.y && mouseY <= s.y + s.height) {
      selectedSticker = s;
      s.dragging = true;
      dragOffset.x = mouseX - s.x;
      dragOffset.y = mouseY - s.y;
      stickers.splice(i, 1);
      stickers.push(s);
      drawCanvas();
      e.preventDefault();
      break;
    }
  }
}
function pointerMove(e) {
  if (!selectedSticker?.dragging) return;
  const { x: mouseX, y: mouseY } = getPointerPos(e);
  selectedSticker.x = mouseX - dragOffset.x;
  selectedSticker.y = mouseY - dragOffset.y;
  drawCanvas();
  e.preventDefault();
}
function pointerUp() { if (selectedSticker) selectedSticker.dragging = false; selectedSticker = null; }

// mouse events
canvas.addEventListener('mousedown', pointerDown);
canvas.addEventListener('mousemove', pointerMove);
canvas.addEventListener('mouseup', pointerUp);
canvas.addEventListener('mouseleave', pointerUp);

// touch events
canvas.addEventListener('touchstart', pointerDown);
canvas.addEventListener('touchmove', pointerMove);
canvas.addEventListener('touchend', pointerUp);
canvas.addEventListener('touchcancel', pointerUp);

// stickers
addBlushBtn.addEventListener('click', () => addSticker('Assets/fish-photobooth/camerapage/stickers/blush.png'));
addRibbonBtn.addEventListener('click', () => addSticker('Assets/fish-photobooth/camerapage/stickers/ribbon.png'));
addKissBtn.addEventListener('click', () => addSticker('Assets/fish-photobooth/camerapage/stickers/kiss.png'));
addWhatBtn.addEventListener('click', () => addSticker('Assets/fish-photobooth/camerapage/stickers/what.png'));

const sparkleImages = ['Assets/fish-photobooth/camerapage/stickers/sparkle1.png','Assets/fish-photobooth/camerapage/stickers/sparkle2.png'], 
      heartImages = ['Assets/fish-photobooth/camerapage/stickers/heart1.png','Assets/fish-photobooth/camerapage/stickers/heart2.png'];
let sparkleIndex = 0, heartIndex = 0;

addSparkleBtn.addEventListener('click', () => { addSticker(sparkleImages[sparkleIndex]); sparkleIndex = (sparkleIndex + 1) % sparkleImages.length; });
addHeartBtn.addEventListener('click', () => { addSticker(heartImages[heartIndex]); heartIndex = (heartIndex + 1) % heartImages.length; });

// reset
resetBtn.addEventListener('click', () => { stickers = []; drawCanvas(); });

// download
downloadBtn.addEventListener('click', () => {
  canvas.toBlob(blob => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'booth-eight.png'; a.click(); }, 'image/png');
});

// home
homeBtn.addEventListener('click', () => window.location.href = 'index.html');

// logo
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', () => window.location.href = 'index.html');
});
