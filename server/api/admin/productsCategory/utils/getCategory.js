export default function getCategory (body) {
    const { texts, hidden, id, positionIndex } = body;

    return { texts, hidden, id, positionIndex };
}
