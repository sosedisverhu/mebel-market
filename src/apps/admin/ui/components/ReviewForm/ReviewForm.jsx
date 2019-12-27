import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import editReview from '../../../services/editReview';
import deleteReview from '../../../services/deleteReviewByIds';

import noop from '@tinkoff/utils/function/noop';
import format from 'date-fns/format';

import Form from '../Form/Form';
import getSchema from './ReviewFormSchema';

class ReviewForm extends Component {
    static propTypes = {
        review: PropTypes.object.isRequired,
        editReview: PropTypes.func.isRequired,
        updateReviews: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        onDelete: PropTypes.func,
        isDeleteButton: PropTypes.bool
    };

    static defaultProps = {
        onDone: noop,
        onDelete: noop,
        isDeleteButton: false
    };

    constructor (props) {
        super(props);

        const { review } = this.props;

        this.initialValues = {
            name: review.user.name,
            emailOrPhone: review.user.emailOrPhone,
            comment: review.user.comment,
            mark: review.user.mark,
            date: review.date,
            id: review.id
        };
    }

    getReviewPayload = (
        {
            name,
            emailOrPhone,
            comment,
            mark,
            date,
            id
        }) => {
        return {
            user: {
                name: name,
                emailOrPhone: emailOrPhone,
                comment: comment,
                mark: mark
            },
            date,
            id
        };
    };

    formatReviewDate = review => format(review.date, 'HH:mm - dd.MM.yyyy');

    handleSubmit = values => {
        const reviewPayload = this.getReviewPayload(values);

        this.props.editReview({ ...reviewPayload, checked: true })
            .then(this.props.onDone)
            .then(this.props.updateReviews);
    };

    render () {
        const { isDeleteButton, review, onDelete } = this.props;
        const formatOrderDate = this.formatReviewDate(review);
        const { emailOrPhone } = this.initialValues;

        return <Form
            initialValues={this.initialValues}
            onSubmit={this.handleSubmit}
            schema={getSchema({
                data: {
                    date: formatOrderDate,
                    contact: emailOrPhone,
                    isDeleteButton,
                    onDelete: () => onDelete(review)
                }
            })}
        />;
    }
}

const mapDispatchToProps = dispatch => ({
    editReview: payload => dispatch(editReview(payload)),
    deleteReview: payload => dispatch(deleteReview(payload))
});

export default connect(null, mapDispatchToProps)(ReviewForm);
