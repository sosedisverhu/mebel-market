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
        minDiscountPrice,
        minPrice,
        actualPrice,
        minDiscount,
        warranty,
        categoryId,
        subCategoryId,
        alias,
        categoryFilters,
        subCategoryFilters,
        labels,
        viewOneColor
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
        minDiscountPrice,
        minPrice,
        actualPrice,
        minDiscount,
        warranty,
        categoryId,
        subCategoryId,
        alias,
        categoryFilters,
        subCategoryFilters,
        labels,
        viewOneColor
    };
}
