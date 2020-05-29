export default (shares, productId, type) => {
    return shares.filter(share => share.type === type).reduce((counter, share) => {
        if (share.products.some(shareProductId => shareProductId === productId)) {
            return counter + 1;
        }
        return counter;
    }, 0);
};
