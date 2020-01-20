export default function getProduct (body) {
    const {
        id,
        texts,
        views,
        characteristics,
        sizes,
        avatar,
        files,
        hidden,
        date,
        discountPrice,
        price,
        actualPrice,
        discount,
        warranty,
        categoryId,
        subCategoryId,
        alias,
        categoryFilters,
        subCategoryFilters,
        article
    } = body;

    return {
        id,
        texts,
        views,
        characteristics,
        sizes,
        avatar,
        files,
        hidden,
        date,
        discountPrice,
        price,
        actualPrice,
        discount,
        warranty,
        categoryId,
        subCategoryId,
        alias,
        categoryFilters,
        subCategoryFilters,
        article
    };
}
