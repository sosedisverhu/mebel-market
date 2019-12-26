import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import format from 'date-fns/format';

import getProducts from '../../../services/getProducts';
import getReviews from '../../../services/getReviews';
import Reviews from '../../components/Reviews/Reviews';
import Typography from '@material-ui/core/Typography';

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
    },
    products: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    productCard: {
        width: '23%',
        margin: '0 1% 1%',
        padding: '10px',
        cursor: 'pointer'
    },
    productAvatar: {
        width: '100%'
    },
    productName: {
        align: 'center'
    }
});

class ReviewsPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getReviews: PropTypes.func.isRequired,
        getProducts: PropTypes.func.isRequired,
        reviews: PropTypes.array,
        products: PropTypes.array
    };

    static defaultProps = {
        reviews: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            searchValue: '',
            products: [],
            productName: '',
            productReviews: null,
            productReviewsIsRendered: false
        };

        this.tableCells = [
            { prop: review => review.user.name },
            { prop: review => review.user.emailOrPhone },
            { prop: review => format(review.date, 'HH:mm - dd.MM.yyyy') },
            { prop: review => review.user.mark }
        ];
    }

    componentDidMount () {
        Promise.all([
            this.props.getReviews(),
            this.props.getProducts()
        ])
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    onChangeSearch = event => {
        const searchValue = event.key === 'Enter' ? this.state.searchValue : event.target.value;
        const { products, reviews } = this.props;
        const searchValueFiltered = searchValue.replace(/ /g, '').toUpperCase();
        const productsWithReviews = products.filter(product => {
            return reviews.filter(review => review.checked)
                .some(review => review.productId === product.id);
        });

        const filteredProducts = searchValueFiltered
            ? productsWithReviews.filter(product => {
                const names = product.texts.ru.name + product.texts.ua.name;
                return names.toUpperCase().includes(searchValueFiltered);
            }) : [];

        this.setState({
            searchValue,
            products: filteredProducts,
            productReviewsIsRendered: false
        });
    };

    onProductReviewsOpen = productId => {
        const { products, reviews } = this.props;
        const product = products.filter(product => {
            return product.id === productId;
        })[0];
        const productReviews = reviews.filter(review => {
            return (review.checked && review.productId === productId);
        });

        this.setState({
            productName: product.texts.ru.name,
            productReviews,
            productReviewsIsRendered: true
        });
    };

    render () {
        const { classes, reviews, getReviews } = this.props;
        const { loading, searchValue, products, productReviewsIsRendered, productName, productReviews } = this.state;
        const newReviews = reviews.filter(review => !review.checked);

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        return <div className={classes.root}>
            <Reviews
                classes={classes}
                reviews={newReviews}
                headerRows={headerRows}
                name='Новые отзывы'
            />
            <TextField
                label='Поиск комментариев по названию товара'
                margin='normal'
                variant='outlined'
                value={searchValue}
                onChange={this.onChangeSearch}
                onKeyPress={this.onChangeSearch}
                className={classes.tableTitle}
            />
            {productReviewsIsRendered
                ? <Reviews
                    classes={classes}
                    reviews={productReviews}
                    headerRows={headerRows}
                    name={`Отзывы к товару ${productName}`}
                />
                : <div className={classes.products}>
                    {products.map(product => {
                        return (
                            <Card
                                className={classes.productCard}
                                onClick={() => this.onProductReviewsOpen(product.id)}
                                key={product.id}
                            >
                                <img className={classes.productAvatar}
                                    src={product.avatar}
                                    alt=''/>
                                <Typography variant='h6' id='tableTitle' className={classes.tableTitle}>
                                    {product.texts.ru.name}
                                </Typography>
                            </Card>
                        );
                    })}
                </div>}
        </div>;
    }
}

const mapStateToProps = ({ data }) => {
    return {
        reviews: data.reviews,
        products: data.products
    };
};

const mapDispatchToProps = (dispatch) => ({
    getReviews: payload => dispatch(getReviews(payload)),
    getProducts: payload => dispatch(getProducts(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ReviewsPage));
