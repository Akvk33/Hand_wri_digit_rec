let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let isDrawing = false;

// Setup drawing properties
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineWidth = 15;
ctx.lineCap = "round";
ctx.strokeStyle = "black";

// Handle drawing
canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!isDrawing) return;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// Clear the canvas
function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Load pre-trained TensorFlow.js model
let model;
async function loadModel() {
    model = await tf.loadLayersModel("https://YOUR_MODEL_URL/model.json");
    console.log("Model Loaded!");
}
loadModel();

// Predict digit from drawing
async function predictDigit() {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let tensor = tf.browser.fromPixels(imgData, 1)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(0)
        .expandDims(-1)
        .toFloat()
        .div(tf.scalar(255));

    let prediction = model.predict(tensor);
    let predictedDigit = prediction.argMax(1).dataSync()[0];

    document.getElementById("predictionResult").innerText = "Prediction: " + predictedDigit;
}