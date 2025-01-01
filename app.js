// Check if SpeechSynthesis API is supported by the browser
if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    let voices = [];

    // Create a recorder instance using Recorder.js
    let recorder;
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Function to load available voices
    function loadVoices() {
        voices = synth.getVoices();  // Fetch available voices
        const voiceSelect = document.getElementById('voiceSelect');

        // Clear existing options
        voiceSelect.innerHTML = '';

        // Populate the voice selection dropdown
        voices.forEach(function(voice, index) {
            let option = document.createElement('option');
            option.value = index;
            option.textContent = voice.name;
            voiceSelect.appendChild(option);
        });

        // Set default voice if available
        if (voices.length > 0) {
            voiceSelect.value = 0;
        }
    }

    // Event to change voice when selected
    document.getElementById('voiceSelect').addEventListener('change', function() {
        let selectedVoice = voices[this.value];
        let utterance = new SpeechSynthesisUtterance('Testing voice selection');
        utterance.voice = selectedVoice;
        synth.speak(utterance);
    });

    // Load voices once the voices are loaded by the browser
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    } else {
        loadVoices();
    }

    // Function to start speaking text
    function speakText() {
        const textInput = document.getElementById('textInput').value;
        const utterance = new SpeechSynthesisUtterance(textInput);
        const voiceSelect = document.getElementById('voiceSelect');

        // Get selected voice
        const selectedVoice = voices[voiceSelect.value];
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Set up audio recording
        const sourceNode = audioContext.createMediaStreamSource(new MediaStream());
        recorder = new Recorder(sourceNode);

        // Start recording
        window.speechSynthesis.speak(utterance);
        recorder.record();

        // Stop speech and recording when done
        utterance.onend = function () {
            recorder.stop();
        };
    }

    // Function to stop speech
    function stopSpeech() {
        window.speechSynthesis.cancel();
        recorder.stop();
    }

    // Save the recorded speech as MP3
    function saveAsMP3() {
        recorder.exportWAV(function (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'speech.mp3';
            link.click();
        });
    }
}
