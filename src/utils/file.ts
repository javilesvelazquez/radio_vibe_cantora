export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const validateImageSize = (file: File, maxSizeInBytes: number = 300000): boolean => {
  if (file.size > maxSizeInBytes) {
    console.warn(`Image too large: ${file.size} bytes. Limit is ${maxSizeInBytes} bytes.`);
    // Using a more subtle way to inform the user if alert is blocked
    const msg = `La imagen es demasiado grande. Por favor usa una menor a ${Math.round(maxSizeInBytes / 1024)}KB.`;
    if (typeof window !== 'undefined') {
      alert(msg);
    }
    return false;
  }
  return true;
};
