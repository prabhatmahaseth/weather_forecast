// mock weather data generator
function getMockWeather(city) {
    // randomize some values for demo
    const conditions = [
        {text: 'Sunny', icon: '☀️', class: 'sun', colors: ['#fbbf24','#f59e0b','#f97316']},
        {text: 'Cloudy', icon: '☁️', class: 'cloud', colors: ['#9ca3af','#6b7280','#4b5563']},
        {text: 'Rainy', icon: '🌧️', class: 'rain', colors: ['#3b82f6','#2563eb','#1e40af']},
        {text: 'Snowy', icon: '❄️', class: 'snow', colors: ['#bfdbfe','#93c5fd','#ffffff']},
    ];
    const choice = conditions[Math.floor(Math.random() * conditions.length)];

    const current = {
        city: city || 'Unknown',
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: choice.text,
        icon: choice.icon,
        iconClass: choice.class,
        humidity: Math.floor(Math.random() * 60) + 20,
        wind: Math.floor(Math.random() * 30) + 5,
        bgColors: choice.colors
    };

    // create 3-day forecast
    const forecast = [];
    const now = new Date();
    for (let i = 1; i <= 3; i++) {
        const day = new Date(now);
        day.setDate(now.getDate() + i);
        const c = conditions[Math.floor(Math.random() * conditions.length)];
        forecast.push({
            date: day.toDateString().slice(0, 10),
            icon: c.icon,
            iconClass: c.class,
            low: Math.floor(Math.random() * 10) + 5,
            high: Math.floor(Math.random() * 15) + 15,
            desc: c.text
        });
    }
    return {current, forecast};
}

function updateUI(weather) {
    const body = document.body;
    // reset any existing inline background
    body.style.background = '';
    if (weather.current && weather.current.bgColors) {
        const [c1, c2, c3] = weather.current.bgColors;
        body.style.background = `linear-gradient(to bottom right, ${c1}, ${c2}, ${c3})`;
    }

    document.getElementById('cityName').textContent = weather.current.city;
    document.getElementById('conditionText').textContent = weather.current.condition;
    document.getElementById('currentTemp').textContent = weather.current.temperature + '°C';
    document.getElementById('humidity').textContent = weather.current.humidity;
    document.getElementById('wind').textContent = weather.current.wind;

    const iconEl = document.getElementById('weatherIcon');
    iconEl.textContent = weather.current.icon;
    iconEl.className = weather.current.iconClass + ' text-6xl';

    // forecast cards
    const cardsContainer = document.getElementById('forecastCards');
    cardsContainer.innerHTML = '';
    weather.forecast.forEach(day => {
        const card = document.createElement('div');
        // use gradient background based on weather type
        const gradient = {
            Sunny: 'bg-gradient-to-br from-yellow-200 to-yellow-400',
            Cloudy: 'bg-gradient-to-br from-gray-300 to-gray-500',
            Rainy: 'bg-gradient-to-br from-blue-300 to-blue-500',
            Snowy: 'bg-gradient-to-br from-blue-100 to-white'
        }[day.desc] || 'bg-white';

        card.className = `forecast-card ${gradient} bg-opacity-60 backdrop-blur-md rounded-lg p-4 text-center animate-fadeIn transition-transform cursor-pointer`;
        card.innerHTML = `
            <div class="text-lg font-semibold mb-2">${day.date}</div>
            <div class="text-4xl ${day.iconClass} mb-2">${day.icon}</div>
            <div class="flex justify-center space-x-2">
                <span>${day.low}°</span>/
                <span>${day.high}°</span>
            </div>
            <div class="mt-1 text-sm text-gray-700">${day.desc}</div>
        `;
        card.addEventListener('click', () => {
            showModal(day);
        });
        cardsContainer.appendChild(card);
    });

    // attach close handler each time
    document.getElementById('modalClose').addEventListener('click', hideModal);

}

function performSearch() {
    const city = document.getElementById('cityInput').value || 'Cuttack';
    const data = getMockWeather(city);
    updateUI(data);
}

document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('refreshBtn').addEventListener('click', () => {
    const icon = document.getElementById('refreshIcon');
    icon.classList.add('spin');
    setTimeout(() => icon.classList.remove('spin'), 600);
    performSearch();
});

// dark mode toggle
const darkToggle = document.getElementById('darkToggle');
darkToggle.addEventListener('change', () => {
    if (darkToggle.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

// modal utilities
function showModal(day) {
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalCity').textContent = day.date + ' - ' + day.desc;
    document.getElementById('modalDetails').textContent = `Low: ${day.low}°, High: ${day.high}°`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function hideModal() {
    const modal = document.getElementById('detailsModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// initial load
performSearch();
