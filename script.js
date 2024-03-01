document.addEventListener('DOMContentLoaded', function() 
{
    const script = document.createElement('script');
    script.src = 'autoTrimImage.js';
    document.head.appendChild(script);

    // Function to handle the drag enter event
    function handleDragEnter(event) 
    {
        event.preventDefault();
        document.getElementById('dropArea').textContent = 'Come on! Drop it already :)';
    }

    // Function to handle the drag leave event
    function handleDragLeave(event) 
    {
        event.preventDefault();
        document.getElementById('dropArea').textContent = 'Drag & Drop Image Here';
    }

    // Function to handle the drag over event
    function handleDragOver(event) 
    {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    // Function to handle the drop event
    function handleDrop(event) 
    {
        event.preventDefault();

        const file = event.dataTransfer.files[0];
        handleFile(file);

        // Reset drop area text
        document.getElementById('dropArea').textContent = 'Drag & Drop Image Here';
    }

    // Function to handle file input
    function handleFile(file) 
    {
        const reader = new FileReader();
    
        reader.onload = function(e) 
        {
            const img = new Image();
            img.onload = function() 
            {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
    
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
    
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
                // Automatically trim the image
                const trimmedImageDataURL = autoTrimImage(imageData);
    
                // Clear any existing images
                const output = document.getElementById('output');
                while (output.firstChild) {
                    output.removeChild(output.firstChild);
                }
    
                // Display the trimmed image
                const trimmedImage = document.createElement('img');
                trimmedImage.src = trimmedImageDataURL;
                output.appendChild(trimmedImage);
    
                // Show the download button
                const downloadButton = document.getElementById('downloadButton');
                downloadButton.style.display = 'block';
                downloadButton.addEventListener('click', function() 
                {
                    const a = document.createElement('a');
                    a.href = trimmedImageDataURL;
                    a.download = file.name; // Use the original image file name for download
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Add event listeners for drag and drop
    const dropArea = document.getElementById('dropArea');
    dropArea.addEventListener('dragenter', handleDragEnter);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('drop', handleDrop);

    // Add an event listener to the file input element
    document.getElementById('fileInput').addEventListener('change', function (event) 
    {
        const file = event.target.files[0];
        handleFile(file);
    });

});
