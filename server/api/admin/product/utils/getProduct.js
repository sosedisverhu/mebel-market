export default function getProduct (body) {
    const { id, texts, avatar, files, hidden, views, date, price, categoryId, subCategoryId } = body;

    return {
        id,
        texts,
        avatar,
        files,
        hidden,
        views,
        date,
        price,
        categoryId,
        subCategoryId
    };
}
