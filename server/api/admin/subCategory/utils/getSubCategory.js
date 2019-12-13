export default function getSubCategory (body) {
    const { id, texts, categoryId, alias, hidden, positionIndex, filters } = body;

    return {
        id,
        texts,
        hidden,
        categoryId,
        alias,
        positionIndex,
        filters
    };
}
