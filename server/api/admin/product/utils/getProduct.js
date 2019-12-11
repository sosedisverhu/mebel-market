export default function getProduct (body) {
    const { id, texts, characteristics, warranty, sizes, avatar, files, hidden, date, basePrice, price, discount, categoryId, subCategoryId, alias } = body;

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
        basePrice,
        price,
        discount,
        categoryId,
        subCategoryId,
        alias
    };
}
