const BASSDRUM = 'BASSDRUM';
const SNARE = 'SNARE';
const SNARE_RIM = 'SNARE_RIM';
const HIGH_TOM = 'HIGH_TOM';
const HIGH_TOM_RIM = 'HIGH_TOM_RIM';
const MID_TOM = 'MID_TOM';
const MID_TOM_RIM = 'MID_TOM_RIM';
const LOW_TOM = 'LOW_TOM';
const LOW_TOM_RIM = 'LOW_TOM_RIM';
const HIHAT_PEDAL = 'HIHAT_PEDAL';
const HIHAT_CLOSED = 'HIHAT_CLOSED';
const HIHAT_OPEN = 'HIHAT_OPEN';
const HIHAT_OPENING = 'HIHAT_OPENING';
const CRASH = 'CRASH';
const RIDE = 'RIDE';

const BACKGROUND_R = 230;
const BACKGROUND_G = 230;
const BACKGROUND_B = 230;
const BACKGROUND_INCREMENT = 0.01; // Must be 0.002 or greater

const DEBUG = location.href.includes('localhost');

const notePadMap = {
    '29': HIHAT_OPENING,
    '36': BASSDRUM,
    '38': SNARE,
    '40': SNARE_RIM,
    '42': HIHAT_CLOSED,
    '43': LOW_TOM,
    '44': HIHAT_PEDAL,
    '45': MID_TOM,
    '46': HIHAT_OPEN,
    '47': MID_TOM_RIM,
    '48': HIGH_TOM,
    '49': CRASH,
    '50': HIGH_TOM_RIM,
    '51': RIDE,
    '58': LOW_TOM_RIM,
}

let hits = [];

let sparkleImage;

function preload() {
  sparkleImage = loadImage('assets/sparkle.png');
}

function parseHit({ note, velocity }) {
    const pad = notePadMap[note];
    hits.push({
        pad,
        intensity: velocity,
    });
    console.log({ hits });
}

function onMIDIMessage(message) {
    const [command, note, velocity] = message.data;

    if (command > 143 && command < 160) {
        console.log('Note on');
        console.log({ command, note, velocity });
        parseHit({ note, velocity });
    }
}

function listenForMIDIMessages(inputDevices) {
    if (inputDevices.length) {
        inputDevices.forEach((inputDevice) => {
            console.log('Listening for MIDI messages on input:');
            console.log(inputDevice);
            inputDevice.onmidimessage = onMIDIMessage;
        });
    } else {
        if (!DEBUG) {
            alert('We were not able to connect to any MIDI device :(');
        }
    }
}

function onAccessGranted(access) {
    const inputDevices = Array.from(access.inputs.values());
    
    listenForMIDIMessages(inputDevices);
}

function onAccessDenied(e) {
    console.error(e);
    if (!DEBUG) {
        alert('We were not able to connect to any MIDI device :(');
    }
}

function requestAccess() {
    navigator.requestMIDIAccess()
        .then(onAccessGranted)
        .catch(onAccessDenied);
}

if (navigator.requestMIDIAccess) {
    requestAccess();
} else {
    alert('Sorry, your browser doesn\'t support the Web MIDI API. Try using Chrome.');
}

function setup() {
    createCanvas(innerWidth, innerHeight);
    background(BACKGROUND_R, BACKGROUND_G, BACKGROUND_B);
}

function drawBassdrum(intensity) {   
    const radius = map(intensity, 0, 160, 0, max(innerWidth, innerHeight));
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);

    noStroke();
    ellipse(x, y, radius, radius);
}


function star(x, y, innerRadius, outerRadius, vertexCount) {
    let angle = TWO_PI / vertexCount;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * outerRadius;
      let sy = y + sin(a) * outerRadius;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * innerRadius;
      sy = y + sin(a + halfAngle) * innerRadius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}


function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawCrash(intensity) {
    const radius = map(intensity, 0, 160, 0, max(innerWidth, innerHeight) * 0.5);
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);
    
    noStroke();
    star(x, y, radius * 0.5, radius, 12);
}

function drawClosedHihat(intensity) {
    const side = map(intensity, 0, 160, 0, max(innerWidth, innerHeight) * 0.5);
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);
    
    noStroke();
    rotate(0.6);

    polygon(x, y, side, 3);
}

function drawSnare(intensity) {
    const side = map(intensity, 0, 160, 0, max(innerWidth, innerHeight) * 0.5);
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);
    
    noStroke();
    rect(x, y, side, side);
}

function drawHighTom(intensity) {
    const side = map(intensity, 0, 160, 0, max(innerWidth, innerHeight) * 0.5);
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);
    
    noStroke();
    ellipse(x, y, side, side);
}

function drawMidTom(intensity) {
    const side = map(intensity, 0, 160, 0, max(innerWidth, innerHeight) * 0.5);
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);
    
    noStroke();
    ellipse(x, y, side, side);
}

function drawLowTom(intensity) {
    const side = map(intensity, 0, 160, 0, max(innerWidth, innerHeight) * 0.5);
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);
    
    noStroke();
    ellipse(x, y, side, side);
}

function drawRide(intensity) {
    const side = map(intensity, 0, 160, 0, max(innerWidth, innerHeight) * 0.5);
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);
    
    image(sparkleImage, x, y, side, side);
}

function invertHex(hex) {
    const number = hex.split('#')[1];
    return '#' + (Number(`0x1${number}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
}

function draw() {
    let hit;
    while (hit = hits.shift()) {
        console.log('drawing:');
        console.log( { hit });
        push();
        switch (hit.pad) {
            case BASSDRUM:
            blendMode(DIFFERENCE);
            fill(invertHex('#ae2633'));
            drawBassdrum(hit.intensity);
            break;

            case HIHAT_CLOSED:
            fill('#ffcc33');
            drawClosedHihat(hit.intensity);
            break;

            case SNARE:
            fill('#002FA7');
            drawSnare(hit.intensity);
            break;

            case HIGH_TOM:
            fill('#00EAE6');
            drawHighTom(hit.intensity);
            break;

            case MID_TOM:
            fill('#B15CFF');
            drawMidTom(hit.intensity);
            break;

            case LOW_TOM:
            fill('#5900A6');
            drawLowTom(hit.intensity);
            break;

            case CRASH:
            blendMode(DIFFERENCE);
            fill(invertHex('#CAFF12'));
            drawCrash(hit.intensity);
            break;

            case RIDE:
            drawRide(hit.intensity);
            break;
        }
        pop();
    }
    push();
    blendMode(ADD);
    fill(`rgba(${BACKGROUND_R}, ${BACKGROUND_G}, ${BACKGROUND_B}, ${BACKGROUND_INCREMENT})`);
    rect(0, 0, width, height);
    pop();
}

window.addEventListener('keydown', () => {
    console.log('keydown');
    hits.push({ pad: RIDE, intensity: 50 });
    hits.push({ pad: HIHAT_CLOSED, intensity: 50 });

   
});