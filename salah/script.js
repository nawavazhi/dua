// --- 1. Night Mode Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check saved theme on load
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️ Day Mode';
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️ Day Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙 Night Mode';
    }
});

// --- 2. Progress Tracker (Local Storage) ---
const checkboxes = document.querySelectorAll('.progress-check');

// Load saved progress
checkboxes.forEach(box => {
    const sectionId = box.getAttribute('data-section');
    if (localStorage.getItem('memorized_section_' + sectionId) === 'true') {
        box.checked = true;
    }
    
    // Save progress on click
    box.addEventListener('change', (e) => {
        localStorage.setItem('memorized_section_' + sectionId, e.target.checked);
    });
});

// --- 3. Audio Player Logic ---
function playWord(wordId) {
    // In the future, this will link to actual files like: assets/audio/word-by-word/allahu.mp3
    console.log(`Playing audio for word: ${wordId}`);
    
    // Example implementation once you upload audio files:
    // const audio = new Audio(`../assets/audio/words/${wordId}.mp3`);
    // audio.play();
    
    // For now, let's just give user feedback
    alert(`Play audio for: ${wordId} (Audio files needed in repository)`);
}
