window.autoTrimImage = function(imageData) 
{
    const { data, width, height } = imageData;

    // Check if the image data is valid
    if (width <= 0 || height <= 0 || data.length !== width * height * 4) 
    {
        console.error("Invalid image data.");
        return null;
    }

    // Initialize boundaries with extreme values
    let top = height;
    let bottom = 0;
    let left = width;
    let right = 0;

    // Find the boundaries of non-transparent pixels
    for (let y = 0; y < height; y++) 
    {
        for (let x = 0; x < width; x++) 
        {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 0) 
            {
                top = Math.min(top, y);
                bottom = Math.max(bottom, y);
                left = Math.min(left, x);
                right = Math.max(right, x);
            }
        }
    }

    // Handle edge case where no non-transparent pixels were found
    if (top === height || left === width) 
    {
        console.error("No non-transparent pixels found.");
        return null;
    }

    // Calculate dimensions of the trimmed image with clamping
    const trimmedWidth = Math.min(right - left + 1, width);
    const trimmedHeight = Math.min(bottom - top + 1, height);

    // Create a new offscreen canvas for drawing
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = trimmedWidth;
    offscreenCanvas.height = trimmedHeight;

    // Draw the trimmed region onto the offscreen canvas
    offscreenCtx.putImageData(imageData, -left, -top);

    // Return the trimmed image as a data URL string
    return offscreenCanvas.toDataURL('image/png');
};
