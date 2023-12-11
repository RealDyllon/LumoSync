export function getContrast(hexColor: string): string {
  // Convert hexColor to RGB
  let r = parseInt(hexColor.substring(1,3),16);
  let g = parseInt(hexColor.substring(3,5),16);
  let b = parseInt(hexColor.substring(5,7),16);

  // Calculate relative luminance for the color
  let colorLuminance = 0.2126 * (r/255) + 0.7152 * (g/255) + 0.0722 * (b/255);

  // Calculate relative luminance for black and white
  let blackLuminance = 0;
  let whiteLuminance = 1;

  // Calculate contrast ratio
  let contrastWithBlack = (colorLuminance + 0.05) / (blackLuminance + 0.05);
  let contrastWithWhite = (whiteLuminance + 0.05) / (colorLuminance + 0.05);

  // Return the color with greater contrast
  return contrastWithBlack > contrastWithWhite ? 'black' : 'white';
}

// console.log(getContrast('#ffa500')); // Outputs: 'black'
