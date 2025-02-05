export function getInitials(inputString: string) {
    if (!inputString) return '';
    
    const words = inputString.trim().split(/\s+/);
    
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
        // If there's only one word, take the first two letters
        return words[0].slice(0, 2).toUpperCase();
    } else {
        // If the string is empty or contains only spaces
        return '';
    }
}