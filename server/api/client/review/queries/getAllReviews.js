import Review from '../model';

export default function getAllReviews () {
    return Review.find({});
}
