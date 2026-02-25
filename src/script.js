/**
 * Twitch Emote Resizer - Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const dropZone = document.getElementById('dropZone');
    const previewContainer = document.getElementById('previewContainer');
    const resultsSection = document.getElementById('resultsSection');
    
    const sizes = [28, 56, 112];
    const canvases = {
        28: document.getElementById('canvas28'),
        56: document.getElementById('canvas56'),
        112: document.getElementById('canvas112')
    };
    
    const downloadButtons = {
        28: document.getElementById('download28'),
        56: document.getElementById('download56'),
        112: document.getElementById('download112')
    };

    // Handle File Selection
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) processImage(file);
    });

    // Drag and Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-indigo-500', 'bg-indigo-50/50');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-indigo-500', 'bg-indigo-50/50');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-indigo-500', 'bg-indigo-50/50');
        const file = e.dataTransfer.files[0];
        if (file) processImage(file);
    });

    function processImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Check if square (optional, but requested 1:1)
                if (img.width !== img.height) {
                    console.warn('Image is not square. It will be stretched/cropped to fit.');
                }
                
                generateResizedImages(img);
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function generateResizedImages(img) {
        sizes.forEach(size => {
            const canvas = canvases[size];
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.clearRect(0, 0, size, size);
            
            // Draw image resized
            // We use imageSmoothingQuality 'high' for better results
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(img, 0, 0, size, size);
            
            // Setup download button
            downloadButtons[size].onclick = () => {
                const link = document.createElement('a');
                link.download = `twitch-emote-${size}x${size}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
        });
    }
});
