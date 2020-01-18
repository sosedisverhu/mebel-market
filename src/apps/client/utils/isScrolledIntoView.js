export default function isScrolledIntoView (el, { full = false } = {}) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    if (full) {
        // Only completely visible elements return true:
        return (elemTop >= 0) && (elemBottom <= window.innerHeight);
    } else {
        // Partially visible elements return true:
        return elemTop < window.innerHeight && elemBottom >= 0;
    }
}
