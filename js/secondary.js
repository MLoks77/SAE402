console.clear();

function updateRealTime() {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const timeEl = document.querySelector('.time');
    if (timeEl) timeEl.textContent = timeStr;
}
setInterval(updateRealTime, 1000);
updateRealTime();

const audioFiles = {
    background: new Audio('../sound/bgmusiczen.mp3'),
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

    // Gestion des Hotspots (Cacher / Afficher)
    const toggleBtn = document.getElementById('toggle-hotspots');
    const eyeContainer = document.getElementById('eye-icon-container');
    const toggleText = document.getElementById('toggle-text');
    let hotspotsVisible = true;

    const eyeOpen = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeClosed = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            hotspotsVisible = !hotspotsVisible;
            const hotspots = document.querySelectorAll('.Hotspot-tour');

            hotspots.forEach(h => {
                h.style.display = hotspotsVisible ? 'block' : 'none';
            });

            eyeContainer.innerHTML = hotspotsVisible ? eyeOpen : eyeClosed;
            toggleText.textContent = hotspotsVisible ? "Cacher les Hotspots" : "Afficher les Hotspots";
        });
    }

    // Débloquer l'audio lors de n'importe quelle interaction utilisateur
    const unlockAudio = () => {
        if (!isMuted && audioFiles.background.paused) {
            audioFiles.background.play()
                .then(() => nettoyerListeners())
                .catch(e => console.error("Échec audio :", e));
        } else {
            nettoyerListeners();
        }
    };

    const interactions = ['click', 'keydown', 'mousedown', 'touchstart'];
    const nettoyerListeners = () => {
        interactions.forEach(event => document.removeEventListener(event, unlockAudio, true));
    };

    interactions.forEach(event => {
        document.addEventListener(event, unlockAudio, true);
    });

    const modelViewer = document.querySelector('model-viewer');
    const progressBar = document.querySelector('.progress-bar');
    const updateBar = document.querySelector('.update-bar');

    if (modelViewer && progressBar && updateBar) {
        modelViewer.addEventListener('progress', (event) => {
            const { totalProgress } = event.detail;
            updateBar.style.width = `${totalProgress * 100}%`;

            if (totalProgress === 1) {
                progressBar.classList.add('hide');
            } else {
                progressBar.classList.remove('hide');
            }
        });
    }
});