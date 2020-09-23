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

const BACKGROUND_R = 255;
const BACKGROUND_G = 255;
const BACKGROUND_B = 255;
const BACKGROUND_INCREMENT = 0.009;

const notePadMap = {
    '29': HIHAT_OPENING,
    '36': BASSDRUM,
    '38': SNARE,
    '40': SNARE_RIM,
    '42': HIHAT_CLOSED,
    '43': LOW_TOM_RIM,
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
        alert('Looks like there\'s no MIDI device connected :I');
    }
}

function onAccessGranted(access) {
    const inputDevices = Array.from(access.inputs.values());
    
    listenForMIDIMessages(inputDevices);
}

function onAccessDenied(e) {
    console.error(e);
    alert('We were not able to connect to any MIDI device :(');
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

function drawCircle(intensity) {   
    noStroke();
    const radius = map(intensity, 0, 160, 0, max(innerWidth, innerHeight));
    const x = random(0, innerWidth);
    const y = random(0, innerHeight);
    console.log('ellipse:');
    console.log( { x, y, radius, radius });
    ellipse(x, y, radius, radius);
}

function draw() {
    let hit;
    while (hit = hits.pop()) {
        console.log('drawing:');
        console.log( { hit });
        push();
        switch (hit.pad) {
            case BASSDRUM:
            fill('#000000');
            drawCircle(hit.intensity);
            break;
        }
        pop();
    }
    fill(`rgba(${BACKGROUND_R}, ${BACKGROUND_G}, ${BACKGROUND_B}, ${BACKGROUND_INCREMENT})`);
    rect(0, 0, width, height);
}

window.addEventListener('keydown', () => {
    console.log('keydown');
    hits.push({ pad: BASSDRUM, intensity: 50 });
});