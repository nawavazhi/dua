document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch the master JSON data
    fetch('../assets/data/database.json')
        .then(response => response.json())
        .then(data => {
            buildSchedule(data.salah_guide.schedule);
            buildSections(data.salah_guide.sections, data.global_dictionary);
        })
        .catch(error => console.error('Error loading JSON:', error));
});

function buildSchedule(scheduleData) {
    const container = document.getElementById('schedule-container');
    let tbody = '';
    
    scheduleData.forEach(item => {
        tbody += `<tr>
            <td><strong>${item.prayer}</strong></td>
            <td>${item.time}</td>
            <td>${item.sunnah_before}</td>
            <td>${item.fardh}</td>
            <td>${item.sunnah_after}</td>
        </tr>`;
    });

    container.innerHTML = `
        <table>
            <thead>
                <tr><th>Prayer</th><th>Time</th><th>Sunnah (Before)</th><th>Fardh</th><th>Sunnah (After)</th></tr>
            </thead>
            <tbody>${tbody}</tbody>
        </table>
    `;
}

// 2. The engine now references the global dictionary using the sequence keys
function buildSections(sectionsData, dictionary) {
    const container = document.getElementById('sections-container');
    
    sectionsData.forEach(section => {
        let tbody = '';
        
        section.sequence.forEach(wordKey => {
            // Find the word in the global dictionary
            const wordData = dictionary[wordKey];
            
            if (wordData) {
                tbody += `<tr>
                    <td class="arabic">${wordData.ar}</td>
                    <td class="trans">${wordData.tr}</td>
                    <td class="eng">${wordData.en}</td>
                    <td class="malayalam">${wordData.ml}</td>
                </tr>`;
            } else {
                console.warn(`Word key missing from dictionary: ${wordKey}`);
            }
        });

        const sectionHTML = `
            <div class="card">
                <h2>${section.title}</h2>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Arabic (അറബി)</th><th>Transliteration</th><th>English</th><th>Malayalam (മലയാളം)</th></tr>
                        </thead>
                        <tbody>${tbody}</tbody>
                    </table>
                </div>
            </div>
        `;
        container.innerHTML += sectionHTML;
    });
}
