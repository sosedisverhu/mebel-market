export default function getCategory (body) {
    const { texts, hidden, id, positionIndex, alias, filters } = body;

    return { texts, hidden, id, positionIndex, alias, filters };
}
