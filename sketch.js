



let song;
let fft;
let isSongPlaying = false; // Flag to check if the song is playing
let spectralCentroid;

// UI elements for user control
let colorSlider, sizeSlider;

function preload() {
  song = loadSound('audio/sample.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  fft = new p5.FFT();

  // Create UI elements for user control
  colorSlider = createSlider(0, 360, 100); // ranges from 0-360, starting at 100
  colorSlider.position(20, 20); // positioned at x=20, y=20
  colorSlider.input(keepDrawing); // Keep the loop running while interacting

  sizeSlider = createSlider(100, 500, 250); // ranges from 100-500, starting at 250
  sizeSlider.position(20, 50); // positioned at x=20, y=50
  sizeSlider.input(keepDrawing); // Keep the loop running while interacting

  // Here we use a mouse click to initiate the song play
  userStartAudio().then(function() {
    console.log('Audio ready');
  });

  song.play();
  isSongPlaying = true;
}

function draw() {
  background('#012E40');

  // Draw instructions
  fill(255);
  noStroke();
  textSize(12);
  text('Color Saturation', colorSlider.x * 2 + colorSlider.width, colorSlider.y);
  text('Waveform Size', sizeSlider.x * 2 + sizeSlider.width, sizeSlider.y);

  // Always show the 'Press Space to Play/Pause' message
  textSize(16);
  textAlign(CENTER, CENTER);
  text('Press Space to Play/Pause', width / 2, 30); // Positioned at the top of the page

  // if (!isSongPlaying) {
  //   return; // Don't draw anything if the song isn't playing
  // }

  // Analyze the spectrum
  let spectrum = fft.analyze();
  spectralCentroid = fft.getCentroid();

  // Draw the spectral centroid as colored bands
  let numBands = spectrum.length;
  let bandWidth = width / (0.8*numBands);
  for (let i = 0; i < numBands; i++) {
    let bandHeight = map(spectrum[i], 0, 255, 0, height);
    let hueValue = map(i, 0, numBands, 0, 360); // spreading the hues across the spectrum
    fill(hueValue, 60, 100, 150); // full saturation and brightness
    noStroke();
    rect(i * bandWidth, height - bandHeight, bandWidth, bandHeight);
  }

  // Translate the origin of our drawing to the center of the canvas
  translate(width / 2, height / 2);

  // FFT Analysis Waveform
  let waveform = fft.waveform();
  noFill();
  beginShape();
  // Use the color slider value for the hue of the FFT waveform
  let hue = colorSlider.value();
  stroke(hue, 60, 100); // Set the color using the hue value
  strokeWeight(3);
  for (let i = 0; i < waveform.length; i++) {
    let angle = map(i, 0, waveform.length, 0, TWO_PI);
    let r = map(waveform[i], -1, 1, sizeSlider.value()/2, sizeSlider.value());
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

// New function to keep drawing when interacting with sliders
function keepDrawing() {
  if (isSongPlaying) {
    loop(); // This will keep the draw loop running
  }
}

// New function to handle space key press
function keyPressed() {
  if (key == ' ') { // Check if the key is the space bar
    if (song.isPlaying()) {
      song.pause();
      isSongPlaying = false;
      noLoop(); // This ensures that the draw loop stops when the music is paused
    } else {
      song.play();
      isSongPlaying = true;
      loop(); // This ensures the draw loop continues when the music plays
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}









