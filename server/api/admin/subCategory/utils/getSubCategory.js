export default function getSubCategory (body) {
    const { id, texts, categoryId, alias, hidden } = body;

    return {
        id,
        texts,
        hidden,
        categoryId,
        alias
    };
}
