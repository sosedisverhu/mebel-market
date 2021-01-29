export default function isScrolledIntoView (el, { offset = 0, full = false } = {}) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    if (full) {
        // Only completely visible elements return true:
        return (elemTop >= 0) && (elemBottom <= window.innerHeight);
    } else {
        // Partially visible elements return true:
        return elemTop + offset < window.innerHeight && elemBottom >= 0;
    }
}
