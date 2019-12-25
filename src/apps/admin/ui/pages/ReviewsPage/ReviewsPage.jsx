import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import format from 'date-fns/format';

import getReviews from '../../../services/getReviews';
import ReviewsPageInfo from '../../components/ReviewsPageInfo/ReviewsPageInfo';

const headerRows = [
    { id: 'name', label: 'Имя' },
    { id: 'emailOrPhone', label: 'Телефон/E-mail' },
    { id: 'date', label: 'Дата' },
    { id: 'mark', label: 'Оценка' }
];

const materialStyles = theme => ({
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        position: 'absolute',
        maxWidth: '1200px',
        width: '90vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh',
        '@media (max-width: 780px)': {
            padding: '15px',
            maxHeight: '90vh'
        }
    },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    valuesActions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    toolbar: {
        width: '100%',
        marginTop: theme.spacing.unit * 3
    },
    rowLabel: {
        '@media (max-width: 780px)': {
            padding: '4px 24px'
        },
        '@media (max-width: 600px)': {
            padding: '2px 12px'
        },
        '@media (max-width: 425px)': {
            padding: '2px 6px'
        }
    },
    tableTitle: {
        width: '100%'
    }
});

const mapStateToProps = ({ data }) => {
    return {
        reviews: data.reviews
    };
};

const mapDispatchToProps = (dispatch) => ({
    getReviews: payload => dispatch(getReviews(payload))
});

class ReviewsPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getReviews: PropTypes.func.isRequired,
        reviews: PropTypes.array
    };

    static defaultProps = {
        reviews: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true
        };

        this.tableCells = [
            { prop: review => review.user.name },
            { prop: review => review.user.emailOrPhone },
            { prop: review => format(review.date, 'HH:mm - dd.MM.yyyy') },
            { prop: review => review.user.mark }
        ];
    }

    componentDidMount () {
        this.props.getReviews()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    render () {
        const { classes, reviews } = this.props;
        const { loading } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }
        const checkedReviews = reviews.filter(review => review.checked);
        const newReviews = reviews.filter(review => !review.checked);

        return <div className={classes.root}>
            <ReviewsPageInfo
                classes={classes}
                reviews={newReviews}
                headerRows={headerRows}
                name='Новые отзывы'
            />
            <ReviewsPageInfo
                classes={classes}
                reviews={checkedReviews}
                headerRows={headerRows}
                name='Проверенные отзывы'
            />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ReviewsPage));
