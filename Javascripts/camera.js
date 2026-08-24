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

const PHOTO_WINDOW={

    x:28,
    y:18,
    width:544,
    height:PHOTO_HEIGHT
};

const elements={

    video:document.getElementById("liveVideo"),

    canvas:document.getElementById("finalCanvas"),

    ctx:document
        .getElementById("finalCanvas")
        .getContext("2d"),

    takePhotoBtn:document.getElementById("takePhoto"),

    frameOverlay: document.getElementById("frameOverlay"),

    prevFrameBtn: document.getElementById("prevFrame"),

    nextFrameBtn: document.getElementById("nextFrame"),

    countdownEl:document.querySelector(".countdown-timer")
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

/* -------------------------------- */

function startCountdown(callback){

    let count=3;

    elements.countdownEl.style.display="flex";

    elements.countdownEl.textContent=count;

    const timer=setInterval(()=>{

        count--;

        if(count>0){

            elements.countdownEl.textContent=count;
        }

        else{

            clearInterval(timer);

            elements.countdownEl.style.display="none";

            callback();
        }

    },1000);
}


/* -------------------------------- */

function capturePhoto(){

    const video=elements.video;

    const ctx=elements.ctx;

    const slotY=

        TOP_MARGIN+

        photoStage*

        (PHOTO_HEIGHT+PHOTO_GAP);

    const vW=video.videoWidth;
    const vH=video.videoHeight;

    const targetAspect=
        PHOTO_WINDOW.width/
        PHOTO_WINDOW.height;

    const videoAspect=vW/vH;

    let sx,sy,sw,sh;

    if(videoAspect>targetAspect){

        sh=vH;
        sw=vH*targetAspect;

        sx=(vW-sw)/2;
        sy=0;
    }

    else{

        sw=vW;
        sh=vW/targetAspect;

        sx=0;
        sy=(vH-sh)/2;
    }

    ctx.save();

    ctx.translate(WIDTH,0);

    ctx.scale(-1,1);

    ctx.drawImage(

        video,

        sx,
        sy,
        sw,
        sh,

        WIDTH-PHOTO_WINDOW.x-PHOTO_WINDOW.width,

        slotY+PHOTO_WINDOW.y,

        PHOTO_WINDOW.width,

        PHOTO_WINDOW.height
    );

    ctx.restore();

    photoStage++;

    if(photoStage>=PHOTO_COUNT){

        finalizePhotoStrip();
    }

    else{

        elements.takePhotoBtn.disabled=false;
    }

}


/* -------------------------------- */

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

        },50);
    };

    if(frame.complete){

        frame.onload();
    }

}


/* -------------------------------- */

function setupCamera(){

navigator.mediaDevices.getUserMedia({

video:{

width:{ideal:2560},

height:{ideal:1440},

facingMode:"user"

},

audio:false

})

.then(stream=>{

elements.video.srcObject=stream;

})

.catch(err=>{

alert(err);

});

}


/* -------------------------------- */

elements.takePhotoBtn.addEventListener("click",()=>{

if(photoStage>=PHOTO_COUNT)return;

elements.takePhotoBtn.disabled=true;

startCountdown(capturePhoto);

});

setupCamera();

/* -------------------------------- */

document.querySelector(".logo").addEventListener("click",()=>{

window.location.href="index.html";

});