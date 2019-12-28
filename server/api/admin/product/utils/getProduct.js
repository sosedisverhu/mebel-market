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
        discount,
        categoryId,
        subCategoryId,
        alias,
        categoryFilters,
        subCategoryFilters
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
        discount,
        categoryId,
        subCategoryId,
        alias,
        categoryFilters,
        subCategoryFilters
    };
}
