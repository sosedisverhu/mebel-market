export default (value, currency = true) => {
    const innerValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');

    return `${innerValue}${currency ? '\u00A0\u20B4' : ''}`;
};
