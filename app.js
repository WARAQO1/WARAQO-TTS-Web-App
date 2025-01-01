let synth = window.speechSynthesis;
let voices = [];
let currentVoice;

function loadVoices() {
    voices = synth.getVoices();
    let voicesDropdown = document.getElementById('voices');
    voicesDropdown.innerHTML = '';

    voices.forEach(voice => {
        let option = document.createElement('option');
        option.textContent = voice.name;
        voicesDropdown.appendChild(option);
    });

    voicesDropdown.addEventListener('change', function () {
        currentVoice = voices[voicesDropdown.selectedIndex];
    });

    // Set the default voice
    currentVoice = voices[0];
}

function speakText() {
    let text = document.getElementById('text-input').value;
    if (text !== '') {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = currentVoice;
        synth.speak(utterance);
    }
}

function stopSpeech() {
    synth.cancel();
}

function pauseSpeech() {
    synth.pause();
}

function resumeSpeech() {
    synth.resume();
}

// Load voices when the page loads
window.onload = function () {
    loadVoices();
    // Refresh voices every 5 seconds
    setInterval(loadVoices, 5000);
};
