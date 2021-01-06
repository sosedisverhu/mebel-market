export default (shares) => {
    const sharesPrice = shares.reduce((sum, currentShare) => {
        return sum + currentShare.value;
    }, 0);

    return sharesPrice;
};
