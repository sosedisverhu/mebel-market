import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import editReview from '../../../services/editReview';

import noop from '@tinkoff/utils/function/noop';
import format from 'date-fns/format';

import Form from '../Form/Form';
import getSchema from './ReviewFormSchema';

class ReviewForm extends Component {
    static propTypes = {
        review: PropTypes.object.isRequired,
        editReview: PropTypes.func,
        onDone: PropTypes.func
    };

    static defaultProps = {
        onDone: noop
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
            .then(this.props.onDone);
    };

    render () {
        const formatOrderDate = this.formatReviewDate(this.props.review);
        const { emailOrPhone } = this.initialValues;

        return <div>
            <Form
                initialValues={this.initialValues}
                onSubmit={this.handleSubmit}
                schema={getSchema({
                    data: {
                        date: formatOrderDate,
                        contact: emailOrPhone
                    }
                })}
            />
        </div>;
    }
}

const mapDispatchToProps = (dispatch) => ({
    editReview: payload => dispatch(editReview(payload))
});

export default connect(null, mapDispatchToProps)(ReviewForm);
