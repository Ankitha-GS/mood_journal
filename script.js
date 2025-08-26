document.getElementById("date").innerText = new Date().toDateString();

let selectedMood = null;
const moodButtons = document.querySelectorAll(".mood-buttons button");
const saveBtn = document.getElementById("saveBtn");
const historyList = document.getElementById("history");
const feedbackElement = document.getElementById("feedback");

const moodQuotes = {
    "Happy": ["You radiate happiness! 🌟", "Keep smiling; it lights up your world!", "Your joy is contagious!"],
    "Neutral": ["Calm and steady wins the race.", "Even small moments matter today.", "Neutral days are a chance to create your vibe."],
    "Sad": ["This too shall pass 🌈", "Your courage is stronger than sadness.", "Tough times build stronger hearts."],
    "Angry": ["Breathe. You are bigger than anger.", "Turn your energy into something amazing!", "Peace starts within you."],
    "Excited": ["Your excitement is inspiring!", "Turn that energy into incredible things!", "Ride the wave of your passion!"]
};

moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        moodButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedMood = btn.getAttribute("data-mood");
    });
});

saveBtn.addEventListener("click", () => {
    if (!selectedMood) {
        alert("Please select a mood!");
        return;
    }
    const note = document.getElementById("note").value;
    const entry = { date: new Date().toLocaleDateString(), mood: selectedMood, note: note };

    let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
    entries.push(entry);
    localStorage.setItem("moodEntries", JSON.stringify(entries));

    document.getElementById("note").value = "";
    selectedMood = null;
    moodButtons.forEach(b => b.classList.remove("selected"));

    loadHistory();
    renderChart();

    const quotes = moodQuotes[entry.mood];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    feedbackElement.textContent = randomQuote;
    feedbackElement.classList.add("show");
    setTimeout(() => feedbackElement.classList.remove("show"), 7000);
});

function loadHistory() {
    historyList.innerHTML = "";
    let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
    entries.slice().reverse().forEach(e => {
        let li = document.createElement("li");
        li.textContent = `${e.date}: ${e.mood} - ${e.note}`;
        historyList.appendChild(li);
    });
}

function renderChart() {
    let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
    let moodCount = {};
    entries.forEach(e => {
        moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
    });

    const ctx = document.getElementById('moodChart').getContext('2d');
    if (window.moodChartInstance) window.moodChartInstance.destroy();
    window.moodChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(moodCount),
            datasets: [{
                data: Object.values(moodCount),
                backgroundColor: ['#FFD93D','#A0CED9','#FF6F91','#FF9671','#C3F584']
            }]
        }
    });
}

loadHistory();
renderChart();
