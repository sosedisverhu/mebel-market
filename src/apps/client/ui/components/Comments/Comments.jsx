import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';
import format from 'date-fns/format';
import classNames from 'classnames';

import saveReview from '../../../services/client/saveReview';
import getReviews from '../../../services/client/getReviews';
import styles from './Comments.css';

const mapStateToProps = ({ application, data }) => {
    return {
        langMap: application.langMap,
        reviews: data.reviews
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveReview: (...payload) => dispatch(saveReview(...payload)),
        getReviews: (...payload) => dispatch(getReviews(...payload))
    };
};

class Comments extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        saveReview: PropTypes.func.isRequired,
        getReviews: PropTypes.func.isRequired,
        productId: PropTypes.string.isRequired,
        reviews: PropTypes.array
    };

    static defaultProps = {
        reviews: []
    };

    state = {
        formIsOpen: false,
        inputName: '',
        inputEmailPhone: '',
        inputText: '',
        newRating: 0,
        reviews: []
    };

    componentDidMount () {
        this.props.getReviews()
            .then(() => {
                const { reviews, productId } = this.props;

                this.setState({
                    reviews: reviews.filter(review => review.productId === productId)
                });
            });
    }

    commentRating = () => {
        const rating = [];

        for (let i = 0; i < 5; i++) {
            rating.push(<div className={styles.star} key={i} />);
        }

        return rating;
    };

    changeRating = () => {
        const { newRating } = this.state;
        const rating = [];

        for (let i = 0; i < 5; i++) {
            const ratingVariant = (i < newRating) ? 'starYellow' : 'starGray';
            rating.push(<div key={i} onClick={() => this.handleClickStar(i + 1)} className={classNames(styles.rating, styles[ratingVariant])}/>);
        }

        return rating;
    };

    handleClickStar = newRating => {
        this.setState({ newRating });
    };

    toggleForm = () => {
        this.setState(state => ({ formIsOpen: !state.formIsOpen }));
    };

    handleSubmit = event => {
        event.preventDefault();
        const { inputName, inputEmailPhone, inputText, newRating } = this.state;

        this.props.saveReview({
            user: {
                name: inputName,
                emailOrPhone: inputEmailPhone,
                comment: inputText,
                mark: newRating
            },
            productId: this.props.productId
        });
    };

    handleChange = fieldName => e => {
        this.setState({ [fieldName]: e.target.value });
    };

    handleCancel = () => {
        this.setState({
            formIsOpen: false,
            inputName: '',
            inputEmailPhone: '',
            inputText: '',
            newRating: 0
        });
    };

    render () {
        const { langMap } = this.props;
        const { formIsOpen, inputName, inputEmailPhone, inputText, reviews } = this.state;
        const text = propOr('comments', {}, langMap);

        return (
            <div className={styles.commentsContainer}>
                <div className={styles.comments}>
                    {reviews.map((comment, i) =>
                        <div className={styles.comment} key={i}>
                            <div className={styles.commentInfo}>
                                <p className={styles.name}>{comment.user.name}</p>
                                <div className={styles.stars}>
                                    {this.commentRating()}
                                </div>
                                <p className={styles.date}>{format(comment.date, 'HH:mm - dd.MM.yyyy')}</p>
                            </div>
                            <p className={styles.commentText}>{comment.user.comment}</p>
                        </div>
                    )}
                    <a className={styles.showAll}>{text.showAll}</a>
                </div>
                <div className={styles.commentsForm}>
                    <div>
                        <a className={classNames(styles.showAll, styles.showAllMobile)}>{text.showAll}</a>
                        <p className={classNames(styles.feedbackTitle, { [styles.active]: formIsOpen })} onClick={this.toggleForm}>
                            {text.feedbackBtn}
                        </p>
                    </div>
                    <form onSubmit={this.handleSubmit} className={classNames(styles.form, { [styles.active]: formIsOpen })}>
                        <div className={styles.userRatingWrapper}>
                            <p className={styles.userRatingText}>{text.userRating}</p>
                            <div className={styles.userRating}>
                                {this.changeRating()}
                            </div>
                        </div>
                        <input
                            className={styles.commentInput}
                            type="text"
                            name='inputName'
                            placeholder={text.inputName}
                            value={inputName}
                            onChange={this.handleChange('inputName')}
                        />
                        <input
                            className={styles.commentInput}
                            type="text"
                            name='inputEmailPhone'
                            placeholder={text.inputEmailPhone}
                            value={inputEmailPhone}
                            onChange={this.handleChange('inputEmailPhone')}
                        />
                        <textarea
                            className={classNames(styles.commentInput, styles.inputText)}
                            name="inputText"
                            placeholder={text.inputText}
                            value={inputText}
                            onChange={this.handleChange('inputText')}
                        />
                        <button className={styles.feedbackBtn} type="submit">{text.feedbackBtn}</button>
                        <button className={styles.cancelBtn} onClick={this.handleCancel}>{text.cancelBtn}</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
