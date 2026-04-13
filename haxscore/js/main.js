document.addEventListener('DOMContentLoaded', () => {
    // Only run map logic if the map element exists (i.e., on index.html)
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // Initialize map centered roughly on North America/Europe
        const map = L.map('map').setView([39.8283, -98.5795], 3);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Array of Hackathon locations (Mock data - replace with your own)
        const hackathons = [
            {
                name: "SF Hacks 2025",
                lat: 37.7749,
                lng: -122.4194,
                summary: "An incredible 48-hour event focused on AI and accessibility.",
                link: "reviews/sf-hacks-2025.html"
            },
            {
                name: "London FinTech Hack",
                lat: 51.5074,
                lng: -0.1278,
                summary: "Great venue, though the judging criteria was a bit vague. <cite>Reviewed on Oct 2025</cite>",
                link: "reviews/london-fintech.html"
            },
            {
                name: "Toronto HackTheNorth",
                lat: 43.6510,
                lng: -79.3470,
                summary: "Massive scale, excellent food, highly competitive environment.",
                link: "reviews/hack-the-north.html"
            }
        ];

        // Add pins to map
        hackathons.forEach(hack => {
            // HTML for the "Short Preview Card" inside the popup
            const popupContent = `
                <div class="short-card">
                    <h4>${hack.name}</h4>
                    <p>${hack.summary}</p>
                    <a href="${hack.link}">Read Full Review &rarr;</a>
                </div>
            `;

            L.marker([hack.lat, hack.lng])
                .addTo(map)
                .bindPopup(popupContent);
        });
    }
});