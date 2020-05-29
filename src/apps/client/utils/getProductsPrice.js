export default (basket, lang) => {
    const productsPrice = basket.reduce((sum, { quantity, product, properties }) => {
        const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
        const color = size.colors.find(color => color.id === properties.size.color.id);
        let productPrice = color.discountPrice || color.price;
        const allFeatures = size.features || [];
        const checkedFeatureIds = properties.features || {};
        const checkedFeatures = allFeatures.filter(feature => checkedFeatureIds[feature.id]);
        const featuresPrice = checkedFeatures.reduce((sum, { value }) => sum + value, 0);

        return sum + (quantity * (productPrice + featuresPrice));
    }, 0);

    return productsPrice;
};
