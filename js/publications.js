document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting to load publications');
    
    // First, let's verify the container exists
    const publicationsContainer = document.querySelector('#publication-section .row.d-flex');
    console.log('Looking for publications container...');
    console.log('Container found:', publicationsContainer);
    
    if (!publicationsContainer) {
        console.error('Could not find publications container element. Check if the selector is correct.');
        return;
    }
    
    // Fetch publications data
    console.log('Fetching publications.json...');
    fetch('publications.json')
        .then(response => {
            console.log('Fetch response received:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Publications data loaded:', data);
            
            if (!data.publications || !Array.isArray(data.publications)) {
                console.error('Invalid publications data format:', data);
                return;
            }
            
            console.log(`Found ${data.publications.length} publications to display`);
            
            // Clear existing content
            publicationsContainer.innerHTML = '';
            
            // Create publication cards
            data.publications.forEach((pub, index) => {
                console.log(`Creating card for publication ${index + 1}:`, pub.title);
                console.log('Image path:', pub.image);
                
                const publicationCard = `
                    <div class="col-md-4 d-flex ftco-animate">
                        <div class="blog-entry justify-content-end">
                            <a href="${pub.link}" class="block-20 zoom-effect" style="background-image: url('${pub.image}'); background-size: cover; background-position: center;">
                            </a>
                            <div class="text mt-3 float-right d-block">
                                <span class="position d-flex justify-content-left" style="font-size: smaller;">${pub.year} ${pub.venue}</span>
                                <h3 class="heading">
                                    <a href="${pub.link}">${pub.title}</a>
                                </h3>
                                <p>${pub.authors}</p>
                            </div>
                        </div>
                    </div>
                `;
                publicationsContainer.innerHTML += publicationCard;
            });
            
            // Add event listeners for image loading errors
            const images = publicationsContainer.querySelectorAll('.block-20');
            console.log(`Found ${images.length} images to check`);
            
            images.forEach(img => {
                img.addEventListener('error', function() {
                    console.error('Failed to load image:', this.style.backgroundImage);
                    // Fallback to a default image if needed
                    this.style.backgroundImage = "url('images/default-publication.jpg')";
                });
            });
            
            console.log('All publication cards have been created and added to the container');
            
            // Trigger main.js initialization after publications are loaded
            if (typeof initMainJS === 'function') {
                console.log('Triggering main.js initialization...');
                initMainJS();
            }
        })
        .catch(error => {
            console.error('Error loading publications:', error);
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
        });
}); 