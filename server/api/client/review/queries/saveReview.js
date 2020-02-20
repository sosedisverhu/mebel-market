import Review from '../model';

export default function saveReview (reviewInfo) {
    return Review.create(reviewInfo);
}
