export default function getProduct (body) {
    const { id, texts, characteristics, warranty, sizes, avatar, files, hidden, date, price, discount, categoryId, subCategoryId, alias, filters } = body;

    return {
        id,
        texts,
        characteristics,
        warranty,
        sizes,
        avatar,
        files,
        hidden,
        date,
        price,
        discount,
        categoryId,
        subCategoryId,
        alias,
        filters
    };
}
