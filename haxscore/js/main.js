// Script for the Map and Light/Dark Mode Toggle

document.addEventListener('DOMContentLoaded', () => {

    // for scroll behavioiur vis a vis review header - broken
    // const reviewHeader = document.querySelector('.review-header');
    // const mainNav = document.querySelector('header'); // The main global nav

    // // Only run this script if we are actually on a page that has a review header
    // if (reviewHeader && mainNav) {
    //     window.addEventListener('scroll', () => {
    //         // If the user scrolls down past the height of the main navigation bar...
    //         if (window.scrollY > mainNav.offsetHeight) {
    //             reviewHeader.classList.add('is-scrolled'); // Turn on compact mode
    //         } else {
    //             reviewHeader.classList.remove('is-scrolled'); // Revert to large mode
    //         }
    //     });
    // }

    // Theme
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check if user has a saved preference, otherwise default to light
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply the saved theme on load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.innerText = '☀️';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerText = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerText = '🌙';
            }
        });
    }

    // map
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // Initialize map centered on the NY/NJ/PA TriState region
        const map = L.map('map').setView([40.7, -74.5], 7);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Array of Hackathon locations
        const hackathons = [
            {
                name: "HackRU - Spring 2023",
                lat: 40.5032860,
                lng: -74.4520966,
                org: "Undergraduate Student Alliance of Computing Scientists (USACS) x Rutgers University",
                location: "College Ave Student Center, New Brunswick, NJ",
                summary: "The first ever hackathon for our founder during his freshmen year. Exciting experience! <cite>Reviewed Feb 2023</cite>",
                link: "reviews/hackru-2023.html"
            },
            {
                name: "HackRU - Spring 2024",
                lat: 40.5235051,
                lng: -74.4581316,
                org: "Undergraduate Student Alliance of Computing Scientists (USACS) x Rutgers University",
                location: "Busch Student Center, Piscataway, NJ",
                summary: "Good venue, though the judging criteria was a bit vague. <cite>Reviewed Feb 2024</cite>",
                link: "reviews/hackru-2024.html"
            },
            {
                name: "HealthHack - 2024",
                lat: 40.49592587902012,
                lng: -74.44977158729839,
                org: "Rutgers Health",
                location: "RWJ University Hospital, New Brunswick, NJ",
                summary: "Focused on healthcare innovation, with great industry mentors. Won $750! <cite>Reviewed Dec 2024</cite>",
                link: "reviews/healthhack-2024.html"
            },
            {
                name: "NexHacks - 2026 (Inaugural Edition)",
                lat: 40.44402161381973,
                lng: -79.94219197908494,
                org: "NexHacks x Carnegie Mellon University",
                location: "Jared L Cohon Hall, Pittsburgh, PA",
                summary: "The inaugural edition of NexHacks at CMU. Exciting to see how this new hackathon evolves! <cite>Reviewed Jan 2026</cite>",
                link: "reviews/nexhacks-2026.html"
            },
            {
                name: "UHACCS - Spring 2026",
                lat: 40.52363092133433,
                lng: -74.43711106075385,
                org: "Undergraduate Student Alliance of Computing Scientists (USACS) x Rutgers University",
                location: "Livingston Student Center, Piscataway, NJ",
                summary: "Small event but learnt a lot. <cite>Reviewed Feb 2026</cite>",
                link: "reviews/uhaccs-2026.html"
            },
            {
                name: "YHack - 2026",
                lat: 41.31715734356258, 
                lng: -72.92229596365036,
                org: "Yale University",
                location: "OC Marsh Hall, New Haven, CT",
                summary: "Secured a DOUBLE WIN, 2 awards totalling more than $2,000!! A very fruitful experience! <cite>Reviewed Mar 2026</cite>",
                link: "reviews/yhack-2026.html"
            }
        ];

        // Add pins to map
        hackathons.forEach(hack => {
            
            // Only attempt to add a marker if we have valid coordinates
            if (hack.lat !== undefined && hack.lng !== undefined) {
                
                // Short Preview Card inside the popup
                const popupContent = `
                    <div class="short-card">
                        <h4>${hack.name}</h4>
                        <p class="location-text">${hack.location}</p>
                        <p class="org">${hack.org}</p>
                        <p>${hack.summary}</p>
                        <a href="${hack.link}">Read the Full Review &rarr;</a>
                    </div>
                `;

                L.marker([hack.lat, hack.lng])
                    .addTo(map)
                    .bindPopup(popupContent);
            } else {
                console.warn(`Skipping map marker for ${hack.name} due to missing coordinates.`);
            }
        });
    }
});