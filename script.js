document.getElementById('upload').addEventListener('change', loadImage);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let originalImage;
let currentImage;

function loadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
            currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
            fitCanvasToContainer();
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

function fitCanvasToContainer() {
    const canvasContainer = document.querySelector('.canvas-container');
    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;
    const aspectRatio = originalImage.width / originalImage.height;

    if (originalImage.width > containerWidth || originalImage.height > containerHeight) {
        if (aspectRatio > 1) {
            canvas.width = containerWidth;
            canvas.height = containerWidth / aspectRatio;
        } else {
            canvas.height = containerHeight;
            canvas.width = containerHeight * aspectRatio;
        }
    } else {
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
    }

    ctx.putImageData(currentImage, 0, 0);
}

function cropImage() {
    const startX = Math.floor(canvas.width / 4);
    const startY = Math.floor(canvas.height / 4);
    const width = Math.floor(canvas.width / 2);
    const height = Math.floor(canvas.height / 2);

    const croppedImage = ctx.getImageData(startX, startY, width, height);
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(croppedImage, 0, 0);
    currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    fitCanvasToContainer();
}

function resizeImage() {
    const width = prompt("Enter new width:", canvas.width);
    const height = prompt("Enter new height:", canvas.height);
    if (width && height) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(canvas, 0, 0, width, height);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(tempCanvas, 0, 0);
        currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        fitCanvasToContainer();
    }
}

function applyFilter() {
    const filter = document.getElementById('filter').value;
    ctx.filter = filter;
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none'; // Reset filter after applying
}

function resetImage() {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.putImageData(originalImage, 0, 0);
    currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById('filter').value = "none";
    fitCanvasToContainer();
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvas.toDataURL();
    link.click();
}