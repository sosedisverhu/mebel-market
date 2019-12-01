export default function getCategory (body) {
    const { texts, hidden, id, positionIndex, alias } = body;

    return { texts, hidden, id, positionIndex, alias };
}
