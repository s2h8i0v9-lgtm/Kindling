// static/js/app.js — Kindling · Studio Layout

// ── SECTION DEFINITIONS ───────────────────────────────────────
// Maps backend section IDs to display text and preview targets
const SECTION_ORDER = [
    'the_role',
    'the_mission',
    'must_haves',
    'nice_to_haves',
    'open_paths',
    'the_reality',
    'review_export'
];

const SECTION_META = {
    the_role: {
        pill:    '1 · The Role',
        name:    'Job title, location & employment type',
        preview: 'preview-role-content'
    },
    the_mission: {
        pill:    '2 · The Mission',
        name:    'Outcomes, responsibilities & impact',
        preview: 'preview-mission-content'
    },
    must_haves: {
        pill:    '3 · Must-Haves',
        name:    'Genuinely essential requirements only',
        preview: 'preview-must-content'
    },
    nice_to_haves: {
        pill:    '4 · Nice-to-Haves',
        name:    'Useful, but not a gatekeeper',
        preview: 'preview-nice-content'
    },
    open_paths: {
        pill:    '5 · Open Paths',
        name:    'Transferable skills & non-linear backgrounds',
        preview: 'preview-paths-content'
    },
    the_reality: {
        pill:    '6 · The Reality',
        name:    'Honest about tools, pace & day-one expectations',
        preview: 'preview-reality-content'
    },
    review_export: {
        pill:    '7 · Review',
        name:    'Final check & export',
        preview: 'preview-review-content'
    }
};

// ── STATE ─────────────────────────────────────────────────────
let currentSection  = 'the_role';
let isWaiting       = false;
let previewStarted  = false;
const previewData   = {};   // Accumulates answers per section

// ── DOM ELEMENTS ──────────────────────────────────────────────
const messagesEl      = document.getElementById('messages');
const userInput       = document.getElementById('user-input');
const sendBtn         = document.getElementById('send-btn');
const exportBtn       = document.getElementById('export-btn');

const pillEl          = document.getElementById('current-section-pill');
const sectionNameEl   = document.getElementById('current-section-name');
const progressEl      = document.getElementById('section-progress');

const previewEmpty    = document.getElementById('preview-empty');
const previewSections = document.getElementById('preview-sections');

const railDots = document.querySelectorAll('.rail-dot');
const secBtns  = document.querySelectorAll('.sec-btn'); // hidden, kept for compat

// ── BOOT ──────────────────────────────────────────────────────
window.addEventListener('load', () => {
    startSection('the_role');
});

// ── RAIL DOT CLICKS ───────────────────────────────────────────
// Rail dots use their position index to map to the section order
railDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        if (isWaiting) return;
        switchToSection(SECTION_ORDER[i], i);
    });
});

// ── SWITCH SECTION ────────────────────────────────────────────
function switchToSection(sectionId, dotIndex) {
    currentSection = sectionId;
    updateRailDots(dotIndex);
    updateSectionBar(sectionId, dotIndex);

    // Mirror active state on hidden sec-btns (original JS compat)
    secBtns.forEach(b => b.classList.remove('active'));
    if (secBtns[dotIndex]) secBtns[dotIndex].classList.add('active');

    clearMessages();
    startSection(sectionId);
}

// ── START A SECTION (API call) ────────────────────────────────
async function startSection(sectionId) {
    currentSection = sectionId;
    const dotIndex = SECTION_ORDER.indexOf(sectionId);

    updateSectionBar(sectionId, dotIndex);
    updateRailDots(dotIndex);

    try {
        const res  = await fetch(`/api/start/${sectionId}`);
        const data = await res.json();
        addMessage(data.message, 'bot');
    } catch {
        addMessage(
            'Spark Seed is having trouble connecting. Please refresh the page.',
            'bot'
        );
    }
}

// ── SEND A MESSAGE ────────────────────────────────────────────
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || isWaiting) return;

    addMessage(text, 'user');
    userInput.value = '';
    autoResize();

    setWaiting(true);
    const typingId = showTyping();

    try {
        const res  = await fetch('/api/chat', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                section_id: currentSection,
                message:    text
            })
        });
        const data = await res.json();
        removeTyping(typingId);
        addMessage(data.message, 'bot');
        updatePreview(currentSection, text);

    } catch {
        removeTyping(typingId);
        addMessage(
            'I had trouble connecting. Check your internet and try again.',
            'bot'
        );
    }

    setWaiting(false);
}

// ── PREVIEW PANEL ─────────────────────────────────────────────
function updatePreview(sectionId, text) {
    // First answer ever — swap empty state for live sections
    if (!previewStarted) {
        previewEmpty.style.display    = 'none';
        previewSections.style.display = 'block';
        previewStarted = true;
    }

    const meta = SECTION_META[sectionId];
    if (!meta) return;

    const contentEl = document.getElementById(meta.preview);
    if (!contentEl) return;

    // Append each answer on a new line so the preview builds up
    previewData[sectionId] = previewData[sectionId]
        ? previewData[sectionId] + '\n' + text
        : text;

    contentEl.textContent = previewData[sectionId];
    contentEl.classList.remove('empty');
}

// ── SECTION BAR ───────────────────────────────────────────────
function updateSectionBar(sectionId, dotIndex) {
    const meta = SECTION_META[sectionId];
    if (!meta) return;
    pillEl.textContent        = meta.pill;
    sectionNameEl.textContent = meta.name;
    progressEl.textContent    = `Step ${dotIndex + 1} of 7`;
}

// ── RAIL DOT STATES ───────────────────────────────────────────
function updateRailDots(activeIndex) {
    railDots.forEach((dot, i) => {
        dot.classList.remove('active', 'complete');
        if (i < activeIndex)  dot.classList.add('complete');
        if (i === activeIndex) dot.classList.add('active');
    });
}

// ── MESSAGE BUBBLES ───────────────────────────────────────────
function addMessage(text, sender) {
    const wrap   = document.createElement('div');
    wrap.className = `message ${sender}`;

    const label  = document.createElement('div');
    label.className   = 'message-sender';
    label.textContent = sender === 'bot' ? 'SPARK SEED' : 'YOU';

    const bubble = document.createElement('div');
    bubble.className   = 'message-bubble';
    bubble.textContent = text;

    wrap.appendChild(label);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollToBottom();
}

// ── TYPING INDICATOR ──────────────────────────────────────────
function showTyping() {
    const id  = `typing-${Date.now()}`;
    const div = document.createElement('div');
    div.id        = id;
    div.className = 'message bot';

    const label = document.createElement('div');
    label.className   = 'message-sender';
    label.textContent = 'SPARK SEED';

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML =
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>';

    div.appendChild(label);
    div.appendChild(indicator);
    messagesEl.appendChild(div);
    scrollToBottom();
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// ── HELPERS ───────────────────────────────────────────────────
function clearMessages()  { messagesEl.innerHTML = ''; }
function scrollToBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

function setWaiting(state) {
    isWaiting          = state;
    sendBtn.disabled   = state;
    userInput.disabled = state;
}

function autoResize() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 110) + 'px';
}

// ── INPUT EVENTS ──────────────────────────────────────────────
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

userInput.addEventListener('input', autoResize);

// ── EXPORT ────────────────────────────────────────────────────
exportBtn.addEventListener('click', async () => {
    exportBtn.textContent = 'Preparing…';
    exportBtn.disabled    = true;

    try {
        const res  = await fetch('/api/export');
        const data = await res.json();

        const blob = new Blob([data.jd], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'kindling-job-description.txt';
        a.click();
        URL.revokeObjectURL(url);

        exportBtn.textContent = 'Downloaded ✓';
        setTimeout(() => {
            exportBtn.textContent = 'Export ↓';
            exportBtn.disabled    = false;
        }, 3000);

    } catch {
        exportBtn.textContent = 'Export failed — try again';
        exportBtn.disabled    = false;
    }
});