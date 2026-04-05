console.clear();
// Splitting(); // Commented out as library is not included in the project

function updateRealTime() {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const timeEl = document.querySelector('.time');
    if (timeEl) timeEl.textContent = timeStr;
}
setInterval(updateRealTime, 1000);
updateRealTime();

const audioFiles = {
    background: new Audio('sound/backgroundsound.mp3'),
};

audioFiles.background.loop = true;
audioFiles.background.volume = 0.1;
audioFiles.background.play().catch(e => console.log("Audio bloqué", e));

function fadeAudio(audio, targetVolume, duration = 3000) {
    const startVolume = audio.volume;
    const steps = 20;
    const interval = duration / steps;
    const volumeStep = (targetVolume - startVolume) / steps;

    let currentStep = 0;
    const fadeContainer = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(0, Math.min(1, startVolume + (volumeStep * currentStep)));
        if (currentStep >= steps) {
            clearInterval(fadeContainer);
            if (targetVolume === 0) audio.pause();
        }
    }, interval);
}

const icons = {
    speaker: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    mute: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
};

let isMuted = false;

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;

    muteBtn.innerHTML = isMuted ? icons.mute : icons.speaker;

    if (isMuted) {
        audioFiles.background.pause();
    } else {
        audioFiles.background.play().catch(e => console.log("Audio bloqué", e));
    }
}

function playSound(name) {
    if (isMuted) return;
    const sound = audioFiles[name];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio bloqué", e));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
        muteBtn.addEventListener('click', toggleMute);
    }

    const unlockAudio = () => {
        if (!isMuted && audioFiles.background.paused) {
            audioFiles.background.play()
                .then(() => {
                    console.log("Audio lancé avec succès !");
                    nettoyerListeners();
                })
                .catch(e => console.error("Échec du lancement audio :", e));
        } else {
            nettoyerListeners();
        }
    };

    const interactions = ['click', 'keydown', 'mousedown', 'touchstart'];

    const nettoyerListeners = () => {
        interactions.forEach(event => {
            document.removeEventListener(event, unlockAudio, true);
        });
    };

    interactions.forEach(event => {
        document.addEventListener(event, unlockAudio, true);
    });
});