// Clear previous strip
window.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem("photoStrip");
});

// Canvas configuration
const WIDTH = 600;
const HEIGHT = 1800;

const PHOTO_COUNT = 4;

const TOP_MARGIN = 20;
const LOGO_AREA = 180;
const PHOTO_GAP = 20;

const PHOTO_HEIGHT =
(
HEIGHT
-
TOP_MARGIN
-
LOGO_AREA
-
(PHOTO_COUNT-1)*PHOTO_GAP
)
/
PHOTO_COUNT;

const PHOTO_WINDOW = {

    x:28,
    y:18,
    width:544,
    height:PHOTO_HEIGHT
};

// DOM

const elements={

    canvas:document.getElementById("finalCanvas"),

    ctx:document
        .getElementById("finalCanvas")
        .getContext("2d"),

    uploadInput:document.getElementById("uploadPhotoInput"),

    uploadBtn:document.getElementById("uploadPhoto"),

    retakeBtn:document.getElementById("retakePhoto"),

    frameOverlay: document.getElementById("frameOverlay"),

    prevFrameBtn: document.getElementById("prevFrame"),

    nextFrameBtn: document.getElementById("nextFrame")
};

let photoStage=0;
const frames = [
    "Assets/fish-photobooth/camerapage/frame1.png",
    "Assets/fish-photobooth/camerapage/frame2.png",
    "Assets/fish-photobooth/camerapage/frame3.png",
    "Assets/fish-photobooth/camerapage/frame4.png",
    "Assets/fish-photobooth/camerapage/frame5.png",
    "Assets/fish-photobooth/camerapage/frame6.png",
    "Assets/fish-photobooth/camerapage/frame7.png",
    "Assets/fish-photobooth/camerapage/frame8.png"
];

let currentFrame = 0;

// Photostrip frame update function
function updateFramePreview(){

    elements.frameOverlay.src = frames[currentFrame];

}

elements.prevFrameBtn.addEventListener("click",()=>{

    currentFrame--;

    if(currentFrame < 0){

        currentFrame = frames.length-1;

    }

    updateFramePreview();

});

elements.nextFrameBtn.addEventListener("click",()=>{

    currentFrame++;

    if(currentFrame >= frames.length){

        currentFrame = 0;

    }

    updateFramePreview();

});

// Draw uploaded image

function drawPhoto(img){

    const slotY=

        TOP_MARGIN+

        photoStage*

        (PHOTO_HEIGHT+PHOTO_GAP);

    const imgAspect=img.width/img.height;

    const targetAspect=
        PHOTO_WINDOW.width/
        PHOTO_WINDOW.height;

    let sx,sy,sw,sh;

    if(imgAspect>targetAspect){

        sh=img.height;

        sw=img.height*targetAspect;

        sx=(img.width-sw)/2;

        sy=0;
    }

    else{

        sw=img.width;

        sh=img.width/targetAspect;

        sx=0;

        sy=(img.height-sh)/2;
    }

    elements.ctx.drawImage(

        img,

        sx,
        sy,
        sw,
        sh,

        PHOTO_WINDOW.x,

        slotY+PHOTO_WINDOW.y,

        PHOTO_WINDOW.width,

        PHOTO_WINDOW.height

    );

    photoStage++;

    if(photoStage>=PHOTO_COUNT){

        finalizePhotoStrip();
    }

}

// Add frame and continue

function finalizePhotoStrip(){

    const frame=new Image();

    frame.src = frames[currentFrame];

    frame.onload=()=>{

        elements.ctx.drawImage(frame,0,0,WIDTH,HEIGHT);

        localStorage.setItem(

            "photoStrip",

            elements.canvas.toDataURL("image/png")

        );

        setTimeout(()=>{

            window.location.href="final.html";

        },100);

    };

    if(frame.complete){

        frame.onload();
    }

}

// Upload button

elements.uploadBtn.addEventListener("click",()=>{

    if(photoStage>=PHOTO_COUNT)return;

    elements.uploadInput.click();

});

// File selected

elements.uploadInput.addEventListener("change",(e)=>{

    const file=e.target.files[0];

    if(!file)return;

    const img=new Image();

    img.onload=()=>{

        drawPhoto(img);

        URL.revokeObjectURL(img.src);

    };

    img.src=URL.createObjectURL(file);

    elements.uploadInput.value="";

});

// Start over

elements.retakeBtn.addEventListener("click",()=>{

    if(!confirm("Clear all uploaded photos?")) return;

    photoStage=0;

    elements.ctx.clearRect(0,0,WIDTH,HEIGHT);

    localStorage.removeItem("photoStrip");

});

// Logo

document.querySelector(".logo").addEventListener("click",()=>{

    window.location.href="index.html";

});