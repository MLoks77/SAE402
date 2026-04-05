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
            toggleText.textContent = hotspotsVisible ? (currentLang === 'fr' ? "Cacher les Hotspots" : "Hide Hotspots") : (currentLang === 'fr' ? "Afficher les Hotspots" : "Show Hotspots");
        });
    }

    // Gestion de la Langue (FR / EN)
    const langBtn = document.getElementById('lang-btn');
    let currentLang = 'fr';

    const translations = {
        fr: {
            bateau: {
                siteTitle: "Le Bateau de Marbre",
                mainText: `Le "Bateau de Marbre" est une structure assez surprenante par sa conception.
                           Contrairement à ce que son nom indique, seule sa coque de 36 mètres de long
                           est réellement constituée de blocs de pierre massive sculptés, le tout étant soutenu par des piliers en pierre cachés sous l'eau. 
                           Le reste du bâtiment a été construit en bois, mais avec un effet de peinture en trompe-l'œil
                           qui imite parfaitement le marbre pour conserver une esthétique haut de gamme
                           tout en allégeant l'ensemble.<br><br>

                           Au niveau du design, on retrouve un mélange d'influences assez original.
                           La base respecte les codes chinois traditionnels, mais plusieurs détails
                           viennent d'Europe, comme les roues à aubes sur les côtés (qui sont purement
                           décoratives) ou le sol en carrelage aux motifs géométriques. C'est un vrai
                           témoignage d'ouverture architecturale pour l'époque.<br><br>

                           Enfin, la technique n'est pas en reste avec des détails bien pensés comme
                           les gouttières : l'eau de pluie est évacuée à travers quatre têtes de
                           dragons sculptées, alliant ainsi utilité et symbolisme. Aujourd'hui,
                           amarré sur la rive nord, c'est devenu l'un des points de vue les plus
                           appréciés pour son apparence unique et ses détails soignés.`,
                hotspot1: "ici est l'entrée du monument. L'entrée pour une demi-journée est de 70€ environ.",
                hotspot2: "La structure est solide, elle n'a pas bougé malgré les années d'érosion du Lac Kunming."
            },
            tour: {
                siteTitle: "La Tour de l'Encens Bouddhiste",
                mainText: `Érigée entre 1750 et 1764 sous le règne de l’empereur Qianlong, cette tour monumentale fut
                           conçue comme le point le plus haut du Palais d’Été. La tour fut construite avec pour
                           ambition d'avoir 9 étages, mais celle-ci fut transformée en tour bouddhiste lors de sa construction
                           et ne compte aujourd'hui que 3 étages.<br><br>

                           La tour s'élève à 41 mètres, repose sur une base massive de 21 mètres en pierre
                           taillée. Sa charpente complexe utilise des bois précieux assemblés grâce à des techniques
                           traditionnelles. Les façades sont ornées de carreaux jaunes aux bords verts et de murs
                           rougeâtres. Plusieurs pièces longent les portiques autour de la terrasse. L'intérieur est
                           entouré de huit piliers colossaux en bois de santal qui soutiennent la structure et
                           entourent une statue dorée représentant le Bouddha aux Mille Mains, celle-ci mesure cinq
                           mètres et pèse 5 tonnes.<br><br>

                           Les pèlerins bouddhistes viennent prier et faire des offrandes en
                           ce lieu. La tour illustre comment le pouvoir impérial et la dévotion religieuse
                           s'entrelaçaient dans la culture chinoise. <br><br>En décembre 1998, l'UNESCO inclut le
                           Palais d’Été dans sa liste du patrimoine mondial. La tour reste l'un des endroits de Pékin
                           offrant aux visiteurs une des meilleures vues sur la ville et l'ensemble du Palais d’Été.`,
                hotspot1: "Cet ornement en forme de bouchon protège le sommet de la tour. Il couronne l’édifice et marque le point le plus élevé du Palais d'été.",
                hotspot2: "L'accès à la tour est réglementé et nécessite un billet."
            },
            common: {
                byText: "Par",
                view3dTitle: "Vue 3D",
                instrRotate: "Utilisez le clic gauche pour pivoter",
                instrMove: "Utilisez le clic droit pour se déplacer",
                instrZoom: "Utilisez la molette pour zoomer",
                toggleHide: "Cacher les Hotspots",
                toggleShow: "Afficher les Hotspots",
                modeledBy: "Modélisé par"
            }
        },
        en: {
            bateau: {
                siteTitle: "The Marble Boat",
                mainText: `The "Marble Boat" is a structure with a surprising design. 
                           Contrary to its name, only its 36-meter-long hull is actually made of massive carved stone blocks, 
                           all supported by stone pillars hidden underwater. 
                           The rest of the building was constructed of wood, but with a trompe-l'oeil painting effect 
                           that perfectly imitates marble to maintain a high-end aesthetic while lightening the whole.<br><br>

                           In terms of design, we find an original blend of influences. 
                           The base follows traditional Chinese codes, but several details come from Europe, 
                           such as the paddle wheels on the sides (which are purely decorative) or the floor in 
                           geometric tile patterns. It is a true testament to architectural openness for the time.<br><br>

                           Finally, the technology is not to be outdone with well-thought-out details like 
                           the gutters: rainwater is evacuated through four carved dragon heads, 
                           thus combining utility and symbolism. Today, moored on the north shore, 
                           it has become one of the most appreciated viewpoints for its unique appearance and neat details.`,
                hotspot1: "Here is the entrance to the monument. The entrance fee for a half-day is around €70.",
                hotspot2: "The structure is solid, it hasn't moved despite years of erosion from Lake Kunming."
            },
            tour: {
                siteTitle: "Tower of Buddhist Incense",
                mainText: `Built between 1750 and 1764 during the reign of Emperor Qianlong, this monumental tower was 
                           designed as the highest point of the Summer Palace. The tower was built with the 
                           ambition of having 9 floors, but it was transformed into a Buddhist tower during its construction 
                           and now has only 3 floors.<br><br>

                           The tower rises 41 meters, resting on a massive 21-meter base of cut stone. 
                           Its complex framework uses precious woods assembled using traditional techniques. 
                           The facades are decorated with yellow tiles with green edges and reddish walls. 
                           Several rooms run along the porticos around the terrace. The interior is 
                           surrounded by eight colossal sandalwood pillars that support the structure and 
                           surround a golden statue representing the Thousand-Hand Buddha, which measures five 
                           meters and weighs 5 tons.<br><br>

                           Buddhist pilgrims come to pray and make offerings in this place. 
                           The tower illustrates how imperial power and religious devotion were 
                           intertwined in Chinese culture. <br><br>In December 1998, UNESCO included the 
                           Summer Palace in its list of World Heritage Sites. The tower remains one of the best 
                           places in Beijing, offering visitors one of the best views of the city and the entire Summer Palace.`,
                hotspot1: "This cap-shaped ornament protects the top of the tower. It crowns the building and marks the highest point of the Summer Palace.",
                hotspot2: "Access to the tower is regulated and requires a ticket."
            },
            common: {
                byText: "By",
                view3dTitle: "3D View",
                instrRotate: "Use left click to rotate",
                instrMove: "Use right click to move",
                instrZoom: "Use the scroll wheel to zoom",
                toggleHide: "Hide Hotspots",
                toggleShow: "Show Hotspots",
                modeledBy: "Modeled by"
            }
        }
    };

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'fr' ? 'en' : 'fr';
            langBtn.querySelector('span').textContent = currentLang === 'fr' ? 'EN' : 'FR';
            
            // Détecter quelle page on traduit
            const isTour = document.getElementById('site-title').textContent.includes('Tour') || 
                           document.getElementById('site-title').textContent.includes('Tower');
            const pageData = isTour ? translations[currentLang].tour : translations[currentLang].bateau;
            const common = translations[currentLang].common;

            // Appliquer les traductions communes
            document.getElementById('by-text').textContent = common.byText;
            document.getElementById('view3d-title').textContent = common.view3dTitle;
            document.getElementById('instr-rotate').textContent = common.instrRotate;
            document.getElementById('instr-move').textContent = common.instrMove;
            document.getElementById('instr-zoom').textContent = common.instrZoom;
            document.getElementById('toggle-text').textContent = hotspotsVisible ? common.toggleHide : common.toggleShow;
            document.getElementById('modeled-by').textContent = common.modeledBy;

            // Appliquer les traductions spécifiques
            document.getElementById('site-title').textContent = pageData.siteTitle;
            document.getElementById('main-text').innerHTML = pageData.mainText;
            
            // Hotspots (on utilise 1 et 2 pour la Tour, wheel et hull pour le Bateau)
            if (isTour) {
                document.getElementById('hotspot-1-text').textContent = pageData.hotspot1;
                document.getElementById('hotspot-2-text').textContent = pageData.hotspot2;
            } else {
                document.getElementById('hotspot-wheel-text').textContent = pageData.hotspot1;
                document.getElementById('hotspot-hull-text').textContent = pageData.hotspot2;
            }
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
