export default function getProduct (body) {
    const { id, texts, avatar, files, hidden, date, price, categoryId, subCategoryId, alias } = body;

    return {
        id,
        texts,
        avatar,
        files,
        hidden,
        date,
        price,
        categoryId,
        subCategoryId,
        alias
    };
}
