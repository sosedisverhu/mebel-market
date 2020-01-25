import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';

import getProducts from '../../../services/getProducts';
import getReviews from '../../../services/getReviews';
import DeleteReviewForm from '../../components/DeleteReviewForm/DeleteReviewForm';
import Reviews from '../../components/Reviews/Reviews';

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
    searchWrapper: {
        padding: '0 20px'
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

    state = {
        loading: true,
        searchValue: '',
        products: [],
        openedProduct: null,
        productReviews: [],
        productReviewsIsRendered: false,
        reviewsFormIsRendered: true,
        deleteFormIsOpen: false,
        deleteReview: null
    };

    componentDidMount () {
        Promise.all([
            this.props.getReviews(),
            this.props.getProducts()
        ])
            .then(() => {
                this.setState({
                    loading: false,
                    newReviews: this.props.reviews.filter(review => !review.checked)
                });
            });
    }

    onChangeSearch = event => {
        const searchValue = event.key === 'Enter' ? this.state.searchValue : event.target.value;
        const { products, reviews } = this.props;
        const searchValueFiltered = searchValue.trim().toUpperCase();
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
            openedProduct: product,
            productReviews,
            productReviewsIsRendered: true
        });
    };

    handleDeleteFormOpen = value => {
        this.setState({
            deleteFormIsOpen: true,
            deleteReview: value
        });
    };

    handleDeleteFormClose = () => {
        this.props.getReviews().then(() => {
            this.setState({
                deleteFormIsOpen: false,
                deleteReview: null
            });
        });
    };

    onOpenReviewForms = () => {
        this.setState({
            reviewsFormIsRendered: true
        });
    };

    onCloseReviewForms = () => {
        this.setState({
            reviewsFormIsRendered: false
        });
    };

    upDateReviews = () => {
        Promise.all([
            this.props.getReviews(),
            this.props.getProducts()
        ])
            .then(() => {
                const { reviews } = this.props;
                const { productReviewsIsRendered, openedProduct } = this.state;

                const productReviews = productReviewsIsRendered ? reviews.filter(review => review.checked && review.productId === openedProduct.id) : [];
                this.setState({
                    newReviews: reviews.filter(review => !review.checked),
                    productReviews
                });
            });
    };

    render () {
        const { classes } = this.props;
        const { loading, searchValue, newReviews, products, productReviewsIsRendered, openedProduct, productReviews, deleteFormIsOpen, deleteReview, reviewsFormIsRendered } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        return <div className={classes.root}>
            <Reviews
                classes={classes}
                reviews={newReviews}
                reviewsIsShow={reviewsFormIsRendered}
                headerRows={headerRows}
                onDelete={this.handleDeleteFormOpen}
                onAllowForms={this.onOpenReviewForms}
                updateReviews={this.upDateReviews}
                name='Новые отзывы'
            />
            <div className={classes.searchWrapper}>
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
                        reviewsIsShow={reviewsFormIsRendered}
                        headerRows={headerRows}
                        name={`Отзывы к товару ${openedProduct.texts.ru.name}`}
                        onDelete={this.handleDeleteFormOpen}
                        onAllowForms={this.onOpenReviewForms}
                        updateReviews={this.upDateReviews}
                        isDeleteButton
                    />
                    : <div className={classes.products}>
                        {products.length ? products.map(product => {
                            return (
                                <Card
                                    className={classes.productCard}
                                    onClick={() => this.onProductReviewsOpen(product.id)}
                                    key={product.id}
                                >
                                    <img className={classes.productAvatar}
                                        src={product.avatar}
                                        alt=''/>
                                    <Typography variant='h6' className={classes.tableTitle}>
                                        {product.texts.ru.name}
                                    </Typography>
                                </Card>
                            );
                        }) : searchValue.length ? <Typography variant='h6'>
                            {`По запросу «${searchValue}» не найдено товаров с отзывами`}
                        </Typography> : null}
                    </div>}
            </div>
            <Modal open={deleteFormIsOpen} onClose={this.handleDeleteFormOpen} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <DeleteReviewForm
                        review={deleteReview}
                        onClose={this.handleDeleteFormClose}
                        onCloseReviewForm={this.onCloseReviewForms}
                        updateReviews={this.upDateReviews}
                    />
                </Paper>
            </Modal>
        </div>;
    }
}

const mapStateToProps = ({ data }) => {
    return {
        reviews: data.reviews,
        products: data.products
    };
};

const mapDispatchToProps = dispatch => ({
    getReviews: payload => dispatch(getReviews(payload)),
    getProducts: payload => dispatch(getProducts(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ReviewsPage));
