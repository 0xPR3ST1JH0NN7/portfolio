// Gestione multilingua
const phrasesIT = ['PENETRATION TESTER', 'RED TEAM OPERATOR'];
const phrasesEN = ['PENETRATION TESTER', 'RED TEAM OPERATOR'];
let currentPhrases = phrasesIT;

function setLang(lang) {
    localStorage.setItem('portfolio_lang', lang);
    
    // Aggiorna tutti gli elementi testuali
    document.querySelectorAll('[data-it]').forEach(el => {
        el.innerHTML = el.getAttribute('data-' + lang);
    });
    
    // Aggiorna lo stato visivo dei pulsanti lingua
    document.getElementById('lang-it').classList.toggle('active', lang === 'it');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    
    // Aggiorna la macchina da scrivere
    currentPhrases = lang === 'it' ? phrasesIT : phrasesEN;
}

// Inizializza la lingua al caricamento
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('portfolio_lang') || 'en';
    setLang(savedLang);
});

// Sfondo a matrice
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const katakana = '0123456789ABCDEFHIJKLMNOPQRSTUVWXYZ☠☣⚡';
const alphabet = katakana.split('');
const fontSize = 14;
const columns = canvas.width / fontSize;
const rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#40000a';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        if(Math.random() > 0.98) {
            ctx.fillStyle = '#ff003c';
        } else {
            ctx.fillStyle = '#4a030d';
        }
        
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}
setInterval(drawMatrix, 33);

// Effetto macchina da scrivere
let charIndex = 0;
let phraseIndex = 0;
let typingTimer;

function typingEffect() {
    let currentWord = currentPhrases[phraseIndex].split("");
    var loopTyping = function() {
        if (currentWord.length > 0) {
            document.getElementById('typewriter').innerHTML += currentWord.shift();
            typingTimer = setTimeout(loopTyping, 80);
        } else {
            setTimeout(deletingEffect, 2000);
        }
    };
    loopTyping();
}

function deletingEffect() {
    let currentWord = document.getElementById('typewriter').innerHTML.split("");
    var loopDeleting = function() {
        if (currentWord.length > 0) {
            currentWord.pop();
            document.getElementById('typewriter').innerHTML = currentWord.join("");
            typingTimer = setTimeout(loopDeleting, 40);
        } else {
            phraseIndex = (phraseIndex + 1) % currentPhrases.length;
            setTimeout(typingEffect, 500);
        }
    };
    loopDeleting();
}
setTimeout(typingEffect, 500);

// Gestione schede del terminale
function switchTab(evt, tabId) {
    const contents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
    }
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}