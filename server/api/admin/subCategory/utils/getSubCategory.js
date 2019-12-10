export default function getSubCategory (body) {
    const { id, texts, categoryId, alias, hidden, positionIndex } = body;

    return {
        id,
        texts,
        hidden,
        categoryId,
        alias,
        positionIndex
    };
}
