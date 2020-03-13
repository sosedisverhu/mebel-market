import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import deleteReview from '../../../services/deleteReviewByIds';

import Form from '../Form/Form';
import getSchema from './DeleteReviewFormSchema';

const DeleteReviewForm = props => {
    const onDeleteReview = () => {
        const { review, onClose, deleteReview, onCloseReviewForm, updateReviews } = props;

        deleteReview([review.id]).then(() => updateReviews())
            .then(() => {
                onClose();
                onCloseReviewForm();
            });
    };

    return <Form
        onSubmit={onDeleteReview}
        schema={getSchema({
            data: {
                onCancellation: props.onClose
            }
        })}
    />;
};

DeleteReviewForm.propTypes = {
    review: PropTypes.object.isRequired,
    deleteReview: PropTypes.func.isRequired,
    onCloseReviewForm: PropTypes.func.isRequired,
    updateReviews: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    deleteReview: payload => dispatch(deleteReview(payload))
});

export default connect(null, mapDispatchToProps)(DeleteReviewForm);
