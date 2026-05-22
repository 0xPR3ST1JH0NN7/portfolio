/* ========================================================
   GESTIONE LINGUA E TRADUZIONI
======================================================== */
const phrasesIT = ['PENETRATION TESTER', 'RED TEAM OPERATOR'];
const phrasesEN = ['PENETRATION TESTER', 'RED TEAM OPERATOR'];
let currentPhrases = phrasesEN;

function setLang(lang) {
    localStorage.setItem('portfolio_lang', lang);
    
    document.querySelectorAll('[data-en]').forEach(el => {
        const translatedText = el.getAttribute('data-' + lang);
        
        // Aggiorna il testo visibile
        el.innerHTML = translatedText;
        
        // Sincronizza l'attributo data-text per l'effetto CSS Glitch
        if (el.classList.contains('glitch-text') || el.hasAttribute('data-text')) {
            el.setAttribute('data-text', translatedText);
        }
        
        // Aggiorna i collegamenti href per link specifici per lingua
        if (el.hasAttribute('data-link-' + lang)) {
            el.href = el.getAttribute('data-link-' + lang);
        }
    });
    
    // Aggiorna interfaccia bottoni lingua
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-it').classList.toggle('active', lang === 'it');
    
    // Aggiorna la variabile per l'effetto macchina da scrivere
    currentPhrases = lang === 'it' ? phrasesIT : phrasesEN;
}

// Inizializza al caricamento
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('portfolio_lang') || 'en';
    setLang(savedLang);
});

/* ========================================================
   EFFETTO MATRIX CANVAS SULLO SFONDO
======================================================== */
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

/* ========================================================
   EFFETTO MACCHINA DA SCRIVERE (TYPEWRITER)
======================================================== */
let phraseIndex = 0;
let typingTimer;

function typingEffect() {
    let typewriterElement = document.getElementById('typewriter');
    if(!typewriterElement) return;

    let currentWord = currentPhrases[phraseIndex].split("");
    var loopTyping = function() {
        if (currentWord.length > 0) {
            typewriterElement.innerHTML += currentWord.shift();
            typingTimer = setTimeout(loopTyping, 80);
        } else {
            setTimeout(deletingEffect, 2000);
        }
    };
    loopTyping();
}

function deletingEffect() {
    let typewriterElement = document.getElementById('typewriter');
    if(!typewriterElement) return;

    let currentWord = typewriterElement.innerHTML.split("");
    var loopDeleting = function() {
        if (currentWord.length > 0) {
            currentWord.pop();
            typewriterElement.innerHTML = currentWord.join("");
            typingTimer = setTimeout(loopDeleting, 40);
        } else {
            phraseIndex = (phraseIndex + 1) % currentPhrases.length;
            setTimeout(typingEffect, 500);
        }
    };
    loopDeleting();
}
setTimeout(typingEffect, 500);

/* ========================================================
   GESTIONE SCHEDE DEL TERMINALE
======================================================== */
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

/* ========================================================
   FILTRAGGIO DELLE SCHEDE SU PUBBLICAZIONI
======================================================== */
function filterCategory(category, element) {
    const tabs = document.querySelectorAll('.terminal-tabs .tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    const posts = document.querySelectorAll('.post-item');
    posts.forEach(post => {
        if (category === 'all' || post.classList.contains(category)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

/* ========================================================
   GESTIONE SEZIONE PUBBLICAZIONI (Tab & Filtri HTB)
======================================================== */
function switchPubTab(btnElement, tabId) {
    // Rimuove la classe attiva da tutti i blocchi di contenuto
    const contents = document.querySelectorAll('.pub-tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Rimuove la classe attiva da tutti i bottoni in alto
    const tabs = document.querySelectorAll('#publications .terminal-tabs .tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Aggiunge la classe attiva per mostrare solo il blocco corretto
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Accende il bottone su cui hai appena cliccato
    if (btnElement) {
        btnElement.classList.add('active');
    }
}

function filterDifficulty(diff, btnElement) {
    // Gestione stato visivo bottoni filtro
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    btnElement.classList.add('active');

    // Mostra/Nascondi le card di HTB in base all'attributo data-difficulty
    const items = document.querySelectorAll('.htb-item');
    items.forEach(item => {
        if (diff === 'all' || item.getAttribute('data-difficulty') === diff) {
            // Usa stringa vuota per ripristinare il display: flex di default del CSS
            item.style.display = ''; 
            // Breve animazione per il rientro
            item.style.animation = 'fadeIn 0.3s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

/* ========================================================
   NAVIGAZIONE SEZIONE PUBBLICAZIONI E SHUFFLE
======================================================== */
function openSection(sectionId) {
    document.getElementById('choice-menu').style.display = 'none';
    document.getElementById('htb-section').style.display = 'none';
    document.getElementById('articles-section').style.display = 'none';
    
    document.getElementById(sectionId).style.display = 'block';
}

function backToMenu() {
    document.getElementById('htb-section').style.display = 'none';
    document.getElementById('articles-section').style.display = 'none';
    
    const menu = document.getElementById('choice-menu');
    menu.style.display = 'grid'; 
    menu.style.animation = 'fadeIn 0.4s ease';
}

function shuffleHTBMachines() {
    const grid = document.getElementById('htb-grid');
    if (!grid) return;
    
    const items = Array.from(grid.children);
    
    // Algoritmo Fisher-Yates per mescolare in modo casuale
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    
    // Reinserisce gli elementi mescolati nella griglia
    items.forEach(item => grid.appendChild(item));
}

// Mescola le macchine appena la pagina ha finito di caricarsi
window.addEventListener('DOMContentLoaded', () => {
    shuffleHTBMachines();
});