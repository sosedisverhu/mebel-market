import Review from '../model';

export default function editReview (review) {
    return Review.findOneAndUpdate({ id: review.id }, review, { new: true });
}
