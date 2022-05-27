// Exercise 1 template
// Feel freee to modify it or create your own template

var mySound;
var mic;
var recorder;
var soundFile;
var state = 0;
var lowPass;
var highPass;
var waveDistortion;
var dynCompressor;
var reverb;
var fft_in;
var fft_out;
var masterVolume;
var switchSetting;
var reverse; 

// playback controls
var pauseButton;
var playButton;
var stopButton;
var skipStartButton;
var skipEndButton;
var loopButton;
var recordButton;
var switchButton;

// low-pass filter
var lp_cutOffSlider;
var lp_resonanceSlider;
var lp_dryWetSlider;
var lp_outputSlider;

// dynamic compressor
var dc_attackSlider;
var dc_kneeSlider;
var dc_releaseSlider;
var dc_ratioSlider;
var dc_thresholdSlider;
var dc_dryWetSlider;
var dc_outputSlider;

// master volume
var mv_volumeSlider;

// reverb
var rv_durationSlider;
var rv_decaySlider;
var rv_dryWetSlider;
var rv_outputSlider;
var rv_reverseButton;

// waveshaper distortion
var wd_amountSlider;
var wd_oversampleSlider;
var wd_dryWetSlider;
var wd_outputSlider;

function preload() {
  soundFormats('wav');
  mySound = loadSound('/sounds/preprocessed.wav');
}

function setup() {
  createCanvas(800, 600);
  background(180);
  
  gui_configuration();

  mic = new p5.AudioIn();
  mic.start();

  fft_in = new p5.FFT();
  fft_in.setInput(mySound);

  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  soundFile = new p5.SoundFile();

  // set initial lowPass filter attributes to slider defaults
  lowPass = new p5.LowPass();
  lowPass.process(mySound, 10 + lp_cutOffSlider.value() * 22040, lp_resonanceSlider.value() * 20);
  lowPass.drywet(lp_dryWetSlider.value());
  lowPass.amp(lp_outputSlider.value());

  waveDistortion = new p5.Distortion();
  waveDistortion.process(mySound, wd_amountSlider.value(), wd_oversampleSlider.value());
  waveDistortion.drywet(wd_dryWetSlider.value());
  waveDistortion.amp(wd_outputSlider.value());

  dynCompressor = new p5.Compressor();
  dynCompressor.process(mySound, 
    dc_attackSlider.value(),
    dc_kneeSlider.value() * 40,
    dc_ratioSlider.value() * 19 + 1,
    dc_thresholdSlider.value() * -100,
    dc_releaseSlider.value());
  dynCompressor.drywet(dc_dryWetSlider.value());
  dynCompressor.amp(dc_outputSlider.value());

  reverb = new p5.Reverb();

  reverse = false;
  switchSetting = 0;

  // lowPass.chain(waveDistortion, dynCompressor);
  lowPass.chain(waveDistortion, dynCompressor, reverb);

  mySound.disconnect();
  mySound.connect(lowPass);
  mySound.setVolume(mv_volumeSlider.value());
  // mySound.connect(waveDistortion);
  // mySound.connect(dynCompressor);
  // mySound.connect(reverb);
  // mySound.connect();

  // masterVolume = new p5.Gain();
  // masterVolume.connect(mySound);
  // masterVolume.disconnect();
  // mySound.connect(masterVolume);
  

  fft_out = new p5.FFT();
  fft_out.setInput(lowPass);
}

//pause audio file
function pauseSound() {
  mySound.pause();
}

//play audio file
function playSound() {
  if (mySound.isPlaying()) {
  } else {
    mySound.play();
  }
}

//stop audio file
function stopSound() {
  mySound.stop();
}

//restart audio file
function restartSound() {
  mySound.jump(0);
}

function endSound() {
  mySound.jump(0.9 * mySound.duration());
}

function loopSound() {
  if (mySound.isLooping()) {
    mySound.setLoop(false);
  } else {
    mySound.setLoop(true);
  }
}

function recordSound() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  if (state === 0) {
    console.log(state);
    recorder.record(soundFile);
    state++;
  } else if (state === 1) {
    console.log(state);
    recorder.stop();
    state++;
  } else if (state === 2) {
    soundFile.play();
    save(soundFile, 'recording.wav');
    console.log(state);
    state = 0;
    console.log(state);
  }
}

function switchFilter() {
  if (switchSetting == 0) {
    highPass = new p5.HighPass();
    highPass.process(mySound, 10 + lp_cutOffSlider.value() * 22040, lp_resonanceSlider.value() * 20);
    highPass.drywet(lp_dryWetSlider.value());
    highPass.amp(lp_outputSlider.value());

    waveDistortion = new p5.Distortion();
    waveDistortion.process(mySound, wd_amountSlider.value(), wd_oversampleSlider.value());
    waveDistortion.drywet(wd_dryWetSlider.value());
    waveDistortion.amp(wd_outputSlider.value());

    dynCompressor = new p5.Compressor();
    dynCompressor.process(mySound, 
      dc_attackSlider.value(),
      dc_kneeSlider.value() * 40,
      dc_ratioSlider.value() * 19 + 1,
      dc_thresholdSlider.value() * -100,
      dc_releaseSlider.value());
    dynCompressor.drywet(dc_dryWetSlider.value());
    dynCompressor.amp(dc_outputSlider.value());

    reverb = new p5.Reverb();

    // lowPass.chain(waveDistortion, dynCompressor);
    lowPass.chain(waveDistortion, dynCompressor, reverb);

    mySound.disconnect();
    mySound.connect(lowPass);
    mySound.setVolume(mv_volumeSlider.value());
    switchSetting = 1;
  } else if (switchSetting == 1) {
    lowPass = new p5.LowPass();
    lowPass.process(mySound, 10 + lp_cutOffSlider.value() * 22040, lp_resonanceSlider.value() * 20);
    lowPass.drywet(lp_dryWetSlider.value());
    lowPass.amp(lp_outputSlider.value());

    waveDistortion = new p5.Distortion();
    waveDistortion.process(mySound, wd_amountSlider.value(), wd_oversampleSlider.value());
    waveDistortion.drywet(wd_dryWetSlider.value());
    waveDistortion.amp(wd_outputSlider.value());

    dynCompressor = new p5.Compressor();
    dynCompressor.process(mySound, 
      dc_attackSlider.value(),
      dc_kneeSlider.value() * 40,
      dc_ratioSlider.value() * 19 + 1,
      dc_thresholdSlider.value() * -100,
      dc_releaseSlider.value());
    dynCompressor.drywet(dc_dryWetSlider.value());
    dynCompressor.amp(dc_outputSlider.value());

    reverb = new p5.Reverb();

    // lowPass.chain(waveDistortion, dynCompressor);
    lowPass.chain(waveDistortion, dynCompressor, reverb);

    mySound.disconnect();
    mySound.connect(lowPass);
    mySound.setVolume(mv_volumeSlider.value());
    switchSetting = 0;
  }
}

function draw() { 
  // pauseButton.mousePressed(pauseSound);
  // playButton.mousePressed(playSound);
  // stopButton.mousePressed(stopSound);
  // skipStartButton.mousePressed(restartSound);
  // skipEndButton.mousePressed(endSound);
  // loopButton.mousePressed(loopSound);
  // recordButton.mousePressed(recordSound);

  // lp_cutOffSlider.input(updateCutoff);
  // lp_resonanceSlider.input(updateResonance);
  // lp_dryWetSlider.input(updateLPDryWet);
  // lp_outputSlider.input(updateLPOutput);

  // wd_amountSlider.input(updateAmount);
  // wd_oversampleSlider.input(updateOversample);
  // wd_dryWetSlider.input(updateWDDryWet);
  // wd_outputSlider.input(updateWDOutput);
  // stroke(0);
  fill(180);
  rect(549, 210, 150, 95);
  noFill();
  stroke(139, 0, 0);
  let spectrum_in = fft_in.analyze();
  beginShape();
  for (var i = 0; i < spectrum_in.length; i++) {
    if (spectrum_in[i] != 0){
      vertex(map(i, 0, 1024, 550, 700), map(spectrum_in[i], 0, 255, 300, 225));
    }
  }
  endShape();

  fill(180);
  rect(549, 360, 150, 95);
  noFill();
  stroke(139, 0, 0);
  let spectrum_out = fft_out.analyze();
  beginShape();
  for (var i = 0; i < spectrum_out.length; i++) {
    if (spectrum_out[i] != 0){
      vertex(map(i, 0, 1024, 550, 700), map(spectrum_out[i], 0, 255, 450, 375));
    }
  }
  endShape();
}

function gui_configuration() {
  // Playback controls
  pauseButton = createButton('pause');
  pauseButton.position(10, 20);
  playButton = createButton('play');
  playButton.position(70, 20);
  stopButton = createButton('stop');
  stopButton.position(120, 20);
  skipStartButton = createButton('skip to start');
  skipStartButton.position(170, 20);
  skipEndButton = createButton('skip to end');
  skipEndButton.position(263, 20);
  loopButton = createButton('loop');
  loopButton.position(352, 20);
  recordButton = createButton('record');
  recordButton.position(402, 20);  
  switchButton = createButton('switch');
  switchButton.position(100, 65);

  
  // Important: you may have to change the slider parameters (min, max, value and step)
  
  // low-pass filter
  textSize(14);
  text('low-pass filter', 10,80);
  textSize(10);
  lp_cutOffSlider = createSlider(0, 1, 0.5, 0.01);
  lp_cutOffSlider.position(10,110);
  text('cutoff frequency', 10,105);
  lp_resonanceSlider = createSlider(0, 1, 0.5, 0.01);
  lp_resonanceSlider.position(10,155);
  text('resonance', 10,150);
  lp_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
  lp_dryWetSlider.position(10,200);
  text('dry/wet', 10,195);
  lp_outputSlider = createSlider(0, 1, 0.5, 0.01);
  lp_outputSlider.position(10,245);
  text('output level', 10,240);
  
  // dynamic compressor
  textSize(14);
  text('dynamic compressor', 210,80);
  textSize(10);
  dc_attackSlider = createSlider(0, 1, 0.5, 0.01);
  dc_attackSlider.position(210,110);
  text('attack', 210,105);
  dc_kneeSlider = createSlider(0, 1, 0.5, 0.01);
  dc_kneeSlider.position(210,155);
  text('knee', 210,150);
  dc_releaseSlider = createSlider(0, 1, 0.5, 0.01);
  dc_releaseSlider.position(210,200);
  text('release', 210,195);
  dc_ratioSlider = createSlider(0, 1, 0.5, 0.01);
  dc_ratioSlider.position(210,245);
  text('ratio', 210,240);
  dc_thresholdSlider = createSlider(0, 1, 0.5, 0.01);
  dc_thresholdSlider.position(360,110);
  text('threshold', 360,105);
  dc_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
  dc_dryWetSlider.position(360,155);
  text('dry/wet', 360,150);
  dc_outputSlider = createSlider(0, 1, 0.5, 0.01);
  dc_outputSlider.position(360,200);
  text('output level', 360,195);
  
  // master volume
  textSize(14);
  text('master volume', 560,80);
  textSize(10);
  mv_volumeSlider = createSlider(0, 1, 0.5, 0.01);
  mv_volumeSlider.position(560,110);
  text('level', 560,105)

  // reverb
  textSize(14);
  text('reverb', 10,305);
  textSize(10);
  rv_durationSlider = createSlider(0, 1, 0.5, 0.01);
  rv_durationSlider.position(10,335);
  text('duration', 10,330);
  rv_decaySlider = createSlider(0, 1, 0.5, 0.01);
  rv_decaySlider.position(10,380);
  text('decay', 10,375);
  rv_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
  rv_dryWetSlider.position(10,425);
  text('dry/wet', 10,420);
  rv_outputSlider = createSlider(0, 1, 0.5, 0.01);
  rv_outputSlider.position(10,470);
  text('output level', 10,465);
  rv_reverseButton = createButton('reverb reverse');
  rv_reverseButton.position(10, 510);
  
  // waveshaper distortion
  textSize(14);
  text('waveshaper distortion', 210,305);
  textSize(10);
  wd_amountSlider = createSlider(0, 1, 0.5, 0.01);
  wd_amountSlider.position(210,335);
  text('distortion amount', 210,330);
  wd_oversampleSlider = createSlider(0, 4, 2, 2);
  wd_oversampleSlider.position(210,380);
  text('oversample', 210,375);
  wd_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
  wd_dryWetSlider.position(210,425);
  text('dry/wet', 210,420);
  wd_outputSlider = createSlider(0, 1, 0.5, 0.01);
  wd_outputSlider.position(210,470);
  text('output level', 210,465);
  
  // spectrums
  textSize(14);
  text('spectrum in', 560,200);
  text('spectrum out', 560,345);

  pauseButton.mousePressed(pauseSound);
  playButton.mousePressed(playSound);
  stopButton.mousePressed(stopSound);
  skipStartButton.mousePressed(restartSound);
  skipEndButton.mousePressed(endSound);
  loopButton.mousePressed(loopSound);
  recordButton.mousePressed(recordSound);
  switchButton.mousePressed(switchFilter);
  rv_reverseButton.mousePressed(reverbReverse);

  lp_cutOffSlider.input(updateCutoff);
  lp_resonanceSlider.input(updateResonance);
  lp_dryWetSlider.input(updateLPDryWet);
  lp_outputSlider.input(updateLPOutput);

  wd_amountSlider.input(updateAmount);
  wd_oversampleSlider.input(updateOversample);
  wd_dryWetSlider.input(updateWDDryWet);
  wd_outputSlider.input(updateWDOutput);

  dc_attackSlider.input(compressorSliders);
  dc_kneeSlider.input(compressorSliders);
  dc_ratioSlider.input(compressorSliders);
  dc_thresholdSlider.input(compressorSliders);
  dc_releaseSlider.input(compressorSliders);
  dc_dryWetSlider.input(updateDCDryWet);
  dc_outputSlider.input(updateDCOutput);

  rv_durationSlider.input(updateDuration);
  rv_decaySlider.input(updateDuration);
  rv_dryWetSlider.input(updateRVDryWet);
  rv_outputSlider.input(updateRVOutput);

  mv_volumeSlider.input(updateMasterVolume);
}

// update lowPasss filter cutoff frequency
function updateCutoff() {
  lowPass.process(mySound, 10 + lp_cutOffSlider.value() * 22040, lp_resonanceSlider.value() * 20);
  mySound.disconnect();
  mySound.connect(lowPass);
}

// update lowPass filter resonance
function updateResonance() {
  lowPass.process(mySound, 10 + lp_cutOffSlider.value() * 22040, lp_resonanceSlider.value() * 20);
  mySound.disconnect();
  mySound.connect(lowPass);
}

// update lowPass filter dry/wet value
function updateLPDryWet() {
  lowPass.drywet(lp_dryWetSlider.value());
  mySound.disconnect();
  mySound.connect(lowPass);
}

// update lowPass filter output level
function updateLPOutput() {
  lowPass.amp(lp_outputSlider.value());
  mySound.disconnect();
  mySound.connect(lowPass);
}

// update waveDistortion amount
function updateAmount() {
  waveDistortion.process(mySound, wd_amountSlider.value(), wd_oversampleSlider.value());
  mySound.disconnect();
  mySound.connect(waveDistortion);
}

// update waveDistortion oversample
function updateOversample() {
  waveDistortion.process(mySound, wd_amountSlider.value(), wd_oversampleSlider.value().toString() + 'x');
  mySound.disconnect();
  mySound.connect(waveDistortion);
}

// update waveDistortion dry/wet levels
function updateWDDryWet() {
  waveDistortion.drywet(wd_dryWetSlider.value());
  mySound.disconnect();
  mySound.connect(waveDistortion);
}

//update waveDistortion output levels
function updateWDOutput() {
  waveDistortion.amp(wd_outputSlider.value());
  mySound.disconnect();
  mySound.connect(waveDistortion);
}

// update dynamic compressor attack, knee, ratio, threshold and release values
function compressorSliders() {
  dynCompressor.process(mySound, 
                        dc_attackSlider.value(),
                        dc_kneeSlider.value() * 40,
                        dc_ratioSlider.value() * 19 + 1,
                        dc_thresholdSlider.value() * -100,
                        dc_releaseSlider.value());
  mySound.disconnect();
  mySound.connect(dynCompressor);
}

// update dynamic compressor dry/wet levels
function updateDCDryWet() {
  dynCompressor.drywet(dc_dryWetSlider.value());
  mySound.disconnect();
  mySound.connect(dynCompressor);
}

// update dynamic compressor output levels
function updateDCOutput() {
  dynCompressor.amp(dc_outputSlider.value());
  mySound.disconnect();
  mySound.connect(dynCompressor);
}

// update reverb duration/decay percentage rate
function updateDuration() {
  reverb.process(mySound, rv_durationSlider.value() * 10, rv_decaySlider.value() * 100);
  mySound.disconnect();
  mySound.connect(reverb);
}

//update reverb dry/wet levels
function updateRVDryWet() {
  reverb.drywet(rv_dryWetSlider.value());
  mySound.disconnect();
  mySound.connect(reverb);
}

// update reverb output levels
function updateRVOutput() {
  reverb.amp(rv_outputSlider.value());
  mySound.disconnect();
  mySound.connect(reverb);
}

function reverbReverse() {
  if (reverse == false) {
    reverse = true;
    reverb.set(rv_durationSlider.value() * 10, rv_decaySlider.value() * 100, reverse);
  } else {
    reverse = false;
    reverb.set(rv_durationSlider.value() * 10, rv_decaySlider.value() * 100, reverse);
  }
}

function updateMasterVolume() {
  mySound.setVolume(mv_volumeSlider.value());
}