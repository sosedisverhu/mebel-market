export default (text, length) => {
    if (length === 11 || length === 12 || length === 13 || length === 14) {
        return text.much;
    }

    switch (length % 10) {
    case 1:
        return text.one;
    case 2:
    case 3:
    case 4:
        return text.several;
    default:
        return text.much;
    }
};
