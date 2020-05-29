import find from '@tinkoff/utils/array/find';

function getIsShareProduct (currentProductId, basket, lang = 'ru') {
    let isShare = false;

    basket.forEach(({ product, properties }) => {
        const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
        (size.shares || []).forEach(share => {
            if (share.products.some(product => product.value === currentProductId)) {
                isShare = true;
            }
        });
    });

    return isShare;
}

export default (basket, lang = 'ru') => {
    let shares = [];
    const resultShares = [];

    basket.forEach(({ product, quantity, properties }) => {
        const size = product.sizes[lang].find(productSize => productSize.id === properties.size.id);
        const color = size.colors.find(color => color.id === properties.size.color.id);

        for (let i = 0; i < quantity; i++) {
            const sharesProducts = [];
            (size.shares || []).forEach(share => {
                const products = share.products.map(shareProduct => {
                    return {
                        id: shareProduct.value,
                        inCart: false,
                        price: color.discountPrice || color.price
                    };
                });
                const shareProducts = {
                    type: share.type,
                    products: products,
                    value: +share.value
                };

                sharesProducts.push(shareProducts);
            });

            if (sharesProducts.length) shares.push(sharesProducts);
        }
    });

    basket.forEach(({ product, quantity }) => {
        const isShareProduct = getIsShareProduct(product.id, basket, lang);

        if (!isShareProduct) return;

        const discountProductId = product.id;

        for (let i = 0; i < quantity; i++) {
            let flagIsThisProductInShares = false;

            shares.forEach(shareProducts => {
                if (flagIsThisProductInShares) return;

                const shareProduct = find(shareProduct => shareProduct.products.some(productItem => productItem.inCart), shareProducts);

                if (shareProduct && !shareProduct.products.some(product => product.id === discountProductId)) return;

                shareProducts.forEach(shareProduct => {
                    if (flagIsThisProductInShares) return;

                    shareProduct.products.forEach(productItem => {
                        if (productItem.id === discountProductId && !productItem.inCart) {
                            productItem.inCart = true;
                            flagIsThisProductInShares = true;
                        }
                    });
                });
            });
        }
    });

    shares.forEach(shareProducts => {
        const shareResultItem = find(shareProduct => shareProduct.products.some(productItem => productItem.inCart), shareProducts);

        if (!shareResultItem) return;

        const productsInCart = shareResultItem.products.filter(product => product.inCart);
        const shareResultItemProducts = productsInCart.map(product => {
            return product.id;
        });

        let shareResultItemValue = shareResultItem.value;
        if (shareResultItem.type === 'present') {
            shareResultItemValue = productsInCart.reduce((sum, currentProduct) => {
                return sum + currentProduct.price;
            }, 0);
        }

        resultShares.push({
            type: shareResultItem.type,
            products: shareResultItemProducts,
            value: shareResultItemValue
        });
    });

    return resultShares;
};
