
export const splitCamelCase = (text) => {
    return text.replace(/([a-z])([A-Z])/g, '$1 $2');
};

export const truncateText = (text, maxLength) => {
    const formattedText = splitCamelCase(text);

    if (formattedText.length > maxLength) {
        return formattedText.slice(0, maxLength - 3) + '...';
    }
    return formattedText;
};