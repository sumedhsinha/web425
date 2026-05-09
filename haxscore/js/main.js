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

    // Favicon - switches with theme
    const favicon = document.getElementById('favicon');

    function updateFavicon(isDarkMode) {
        if (!favicon) return;
        const filename = isDarkMode ? 'hax_dark.svg' : 'hax_light.svg';
        const currentHref = favicon.getAttribute('href') || '';

        // Preserve the page-specific relative path and only swap light/dark file.
        if (currentHref.includes('hax_light.svg') || currentHref.includes('hax_dark.svg')) {
            favicon.setAttribute('href', currentHref.replace(/hax_(light|dark)\.svg$/, filename));
            return;
        }

        const lastSlash = currentHref.lastIndexOf('/');
        const prefix = lastSlash >= 0 ? currentHref.slice(0, lastSlash + 1) : '';
        favicon.setAttribute('href', `${prefix}${filename}`);
    }

    // Theme
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check if user has a saved preference, otherwise default to light
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply the saved theme on load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.innerText = '☀️';
        updateFavicon(true);
    } else {
        updateFavicon(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerText = '☀️';
                updateFavicon(true);
            } else {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerText = '🌙';
                updateFavicon(false);
            }
        });
    }

    // map
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // Initialize map centered on New Brunswick / Piscataway, NJ
        const map = L.map('map', {
            zoomControl: true
        }).setView([40.50567186596019, -74.45408580372482], 13);

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
                link: "../reviews/hackru-2023.html",
                image: "../images/merch/IMG_7031.jpeg"
            },
            {
                name: "HackRU - Spring 2024",
                lat: 40.5235051,
                lng: -74.4581316,
                org: "Undergraduate Student Alliance of Computing Scientists (USACS) x Rutgers University",
                location: "Busch Student Center, Piscataway, NJ",
                summary: "Good venue, though the judging criteria was a bit vague. <cite>Reviewed Feb 2024</cite>",
                link: "../reviews/hackru-2024.html",
                image: "../images/travel/IMG_2081.jpeg"
            },
            {
                name: "HealthHack - 2024",
                lat: 40.49592587902012,
                lng: -74.44977158729839,
                org: "Rutgers Health",
                location: "RWJ University Hospital, New Brunswick, NJ",
                summary: "Focused on healthcare innovation, with great industry mentors. Won $750! <cite>Reviewed Dec 2024</cite>",
                link: "../reviews/healthhack-2024.html",
                image: "../images/healthhack-2024/IMG_7032.jpeg"
            },

            {
                name: "Rutgers Datathon - 2025",
                lat: 40.52342741886011, 
                lng: -74.4594333645459,
                org: "Rutgers Data Science Club x Rutgers University",
                location: "Busch Student Center, Piscataway, NJ",
                summary: "This event was organized by Rutgers Data Science Club in collaboration with some other clubs and a sponsor",
                link: "../reviews/nda.html",
                image: "../images/travel/IMG_2207.jpeg"
            },

            {
                name: "NexHacks - 2026 (Inaugural Edition)",
                lat: 40.44402161381973,
                lng: -79.94219197908494,
                org: "NexHacks x Carnegie Mellon University",
                location: "Jared L Cohon Hall, Pittsburgh, PA",
                summary: "The inaugural edition of NexHacks at CMU. Exciting to see how this new hackathon evolves! <cite>Reviewed Apr 2026</cite>",
                link: "../reviews/nexhacks-2026.html",
                image: "../images/nexhacks-2026/IMG_1341.jpeg"
            },
            {
                name: "UHACCS - Spring 2026",
                lat: 40.52363092133433,
                lng: -74.43711106075385,
                org: "Undergraduate Student Alliance of Computing Scientists (USACS) x Rutgers University",
                location: "Livingston Student Center, Piscataway, NJ",
                summary: "Small event but learnt a lot. <cite>Reviewed Feb 2026</cite>",
                link: "../reviews/uhaccs-2026.html",
                image: "../images/yhack-2026/IMG_2086.jpeg"
            },
            {
                name: "YHack - 2026",
                lat: 41.31715734356258, 
                lng: -72.92229596365036,
                org: "Yale University",
                location: "OC Marsh Hall, New Haven, CT",
                summary: "Secured a DOUBLE WIN, 2 awards totalling more than $2,000!! A very fruitful experience! <cite>Reviewed Apr 2026</cite>",
                link: "../reviews/yhack-2026.html",
                image: "../images/yhack-2026/IMG_2090.jpeg"
            }
        ];

        // Timeline and Map Navigation
        class EventNavigator {
            constructor(hackathons) {
                this.hackathons = hackathons;
                this.currentIndex = 0;
                this.map = map;
                this.markers = [];
                this.init();
            }
            
            init() {
                // Build timeline
                this.buildTimeline();
                
                // Add all markers
                this.hackathons.forEach((hack, index) => {
                    if (hack.lat !== undefined && hack.lng !== undefined) {
                        const popupContent = `
                            <div class="short-card">
                                <div class="map-popup-image-frame">
                                    <img src="${hack.image || '../images/intro.png'}" alt="Hackathon event image" class="map-popup-image">
                                </div>
                                <p class="location-text">${hack.location}</p>
                                <p class="org">${hack.org}</p>
                                <p>${hack.summary}</p>
                                <a href="${hack.link}">Read the Full Review &rarr;</a>
                            </div>
                        `;

                        const marker = L.marker([hack.lat, hack.lng])
                            .addTo(map)
                            .bindPopup(popupContent, {
                                maxWidth: 350,
                                autoPan: false,
                                autoPanSpeed: 10
                            });
                        
                        // Click marker to select event
                        marker.on('click', () => this.selectEvent(index));
                        this.markers.push(marker);
                    }
                });
                
                // Setup navigation buttons
                const prevBtn = document.getElementById('prevEvent');
                const nextBtn = document.getElementById('nextEvent');
                
                if (prevBtn) prevBtn.addEventListener('click', () => this.previousEvent());
                if (nextBtn) nextBtn.addEventListener('click', () => this.nextEvent());
                
                // Update display
                this.updateDisplay();
            }
            
            buildTimeline() {
                const timelineEventsContainer = document.getElementById('timelineEvents');
                if (!timelineEventsContainer) return;
                
                this.hackathons.forEach((hack, index) => {
                    const btn = document.createElement('button');
                    btn.className = 'timeline-event';
                    if (index === 0) btn.classList.add('active');
                    
                    // Extract year from event name or use current year
                    const year = hack.name.match(/\d{4}/) ? hack.name.match(/\d{4}/)[0] : new Date().getFullYear();
                    
                    btn.innerHTML = `
                        ${hack.name.split(' - ')[0]}
                        <span class="timeline-event-date">${year}</span>
                    `;
                    
                    btn.addEventListener('click', () => this.selectEvent(index));
                    timelineEventsContainer.appendChild(btn);
                });
            }
            
            selectEvent(index) {
                this.currentIndex = index;
                this.updateDisplay();
            }
            
            updateDisplay() {
                const hack = this.hackathons[this.currentIndex];
                
                // Update map card header
                const eventName = document.getElementById('eventName');
                const eventCounter = document.getElementById('eventCounter');
                const eventTotal = document.getElementById('eventTotal');
                
                if (eventName) eventName.textContent = hack.name;
                if (eventCounter) eventCounter.textContent = this.currentIndex + 1;
                if (eventTotal) eventTotal.textContent = this.hackathons.length;
                
                // Update navigation buttons
                const prevBtn = document.getElementById('prevEvent');
                const nextBtn = document.getElementById('nextEvent');
                
                if (prevBtn) prevBtn.disabled = this.currentIndex === 0;
                if (nextBtn) nextBtn.disabled = this.currentIndex === this.hackathons.length - 1;
                
                // Update timeline active state
                const timelineButtons = document.querySelectorAll('.timeline-event');
                timelineButtons.forEach((btn, index) => {
                    btn.classList.toggle('active', index === this.currentIndex);
                });
                
                // Highlight marker and open popup
                if (this.markers[this.currentIndex]) {
                    const marker = this.markers[this.currentIndex];
                    const markerLatLng = marker.getLatLng();

                    // Keep the selected pin in focus by centering first, then opening the popup.
                    this.map.flyTo(markerLatLng, this.map.getZoom(), { animate: true, duration: 0.35 });
                    this.map.once('moveend', () => {
                        marker.openPopup();
                    });
                }
            }
            
            previousEvent() {
                if (this.currentIndex > 0) {
                    this.selectEvent(this.currentIndex - 1);
                }
            }
            
            nextEvent() {
                if (this.currentIndex < this.hackathons.length - 1) {
                    this.selectEvent(this.currentIndex + 1);
                }
            }
        }
        
        // Initialize event navigator
        new EventNavigator(hackathons);
    }
});

// Image Modal Functionality - Works on any page
class ImageModal {
    constructor() {
        this.modal = document.getElementById('imageModal');
        if (!this.modal) return; // Exit if modal doesn't exist on page
        
        this.modalImage = document.getElementById('modalImage');
        this.modalCaption = document.getElementById('modalCaption');
        this.modalCounter = document.getElementById('modalCounter');
        this.modalClose = document.getElementById('modalClose');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.images = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        // Get all images from figures and hero containers
        const heroImages = Array.from(document.querySelectorAll('.hero-img-container img'));
        const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
        this.images = [...heroImages, ...galleryImages];
        
        if (this.images.length === 0) return; // No images to work with
        
        // Add click listeners to images
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => this.openModal(index));
        });
        
        // Add close button listener
        this.modalClose.addEventListener('click', () => this.closeModal());
        
        // Add nav buttons
        this.prevBtn.addEventListener('click', () => this.showPrevious());
        this.nextBtn.addEventListener('click', () => this.showNext());
        
        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowLeft') this.showPrevious();
            if (e.key === 'ArrowRight') this.showNext();
        });
    }
    
    openModal(index) {
        this.currentIndex = index;
        this.updateModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    updateModal() {
        const img = this.images[this.currentIndex];
        const figure = img.closest('figure');
        const caption = figure ? figure.querySelector('figcaption') : null;
        
        this.modalImage.src = img.src;
        this.modalImage.alt = img.alt;
        
        if (caption) {
            this.modalCaption.innerHTML = caption.innerHTML;
        } else {
            this.modalCaption.innerHTML = '';
        }
        
        this.modalCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        
        // Update button states
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.images.length - 1;
    }
    
    showPrevious() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateModal();
        }
    }
    
    showNext() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateModal();
        }
    }
}

// Initialize modal when DOM is loaded (if it exists on the page)
document.addEventListener('DOMContentLoaded', () => {
    new ImageModal();
});