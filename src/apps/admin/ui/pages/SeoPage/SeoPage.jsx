import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SwipeableViews from 'react-swipeable-views';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Modal from '@material-ui/core/Modal';

import SeoTabs from '../../components/SeoTabs/SeoTabs.jsx';
import SeoForm from '../../components/SeoForm/SeoForm.jsx';

import { connect } from 'react-redux';
import getAllSeo from '../../../services/getAllSeo';
import editProduct from '../../../services/editProduct';
import search from '../../../services/search';

import find from '@tinkoff/utils/array/find';
import prop from '@tinkoff/utils/object/prop';

const materialStyles = theme => ({
    paper: {
        padding: '0 24px 24px 24px'
    },
    container: {
        padding: '24px 0',
        width: '100%'
    },
    headerContainer: {
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start'
    },
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchWrapp: {
        display: 'flex',
        marginTop: '15px',
        flexDirection: 'column',
        alignItems: 'center'
    },
    search: {
        maxWidth: '370px',
        width: '100%',
        padding: '0'
    },
    products: {
        padding: '48px'
    },
    cardContainer: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        padding: '45px'
    },
    card: {
        maxWidth: '345px',
        border: '1px solid transparent',
        cursor: 'pointer',
        paddingBottom: '16px'
    },
    cardLink: {
        textDecoration: 'none',
        margin: '20px 10px',
        width: '254px'
    },
    media: {
        height: 0,
        paddingTop: '56.25%',
        backgroundSize: '190px'
    },
    selectedProductItem: {
        border: '1px solid rgb(63, 80, 181)'
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
    }
});

const PAGES = [
    { title: 'Главная', page: 'main' },
    { title: 'Доставка и оплата', page: 'delivery-and-payment' },
    { title: 'Партнёры', page: 'partners' },
    { title: 'Статьи', page: 'articles' },
    { title: 'Контакты', page: 'contacts' },
    { title: 'Поиск', page: 'search' },
    { title: 'Акции', page: 'promotions' },
    { title: 'Заказы', page: 'order' }
];

const mapDispatchToProps = (dispatch) => ({
    getAllSeo: payload => dispatch(getAllSeo(payload)),
    editProduct: payload => dispatch(editProduct(payload)),
    search: payload => dispatch(search(payload))
});

class SeoPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getAllSeo: PropTypes.func.isRequired,
        editProduct: PropTypes.func.isRequired,
        search: PropTypes.func.isRequired
    };

    static defaultProps = {
        categories: []
    };

    constructor (...args) {
        super(...args);
        this.state = {
            loading: true,
            tabsValue: 0,
            tips: [],
            searchTxt: '',
            selectedProductItem: null
        };
    }

    componentDidMount () {
        this.props.getAllSeo()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    handleTableChange = event => () => {
        this.setState({
            tabsValue: event
        });
    };

    handleSearchChange = event => {
        const searchTxt = event.target.value;

        this.setState({
            searchTxt
        });

        if (!searchTxt.length) {
            this.setState({
                tips: [],
                selectedProductItem: {}
            });
        }

        this.props.search(searchTxt)
            .then(products => {
                const { selectedProductItem } = this.state;
                let newTips;

                if (products) {
                    newTips = products.map(product => {
                        return {
                            ...product
                        };
                    });
                }

                const newSelectedProduct = selectedProductItem ? find(tip => tip.id === selectedProductItem.id, newTips) : null;

                this.setState({
                    tips: newTips,
                    selectedProductItem: newSelectedProduct
                });
            });
    };

    handleSelectedProduct = product => () => {
        this.setState({
            selectedProductItem: product
        });
    };

    handleCloseProductSeoForm = () => {
        this.setState({
            selectedProductItem: null
        });
    };

    handleFormDone = selectedProductItem => values => {
        const result = {
            ...selectedProductItem,
            texts: {
                ru: {
                    ...selectedProductItem.texts.ru,
                    ...values.texts.ru
                },
                ua: {
                    ...selectedProductItem.texts.ua,
                    ...values.texts.ua
                }
            }
        };

        const formData = new FormData();

        formData.append('product', JSON.stringify(result));
        formData.append('photos', JSON.stringify({
            files: result.photos,
            removedFiles: []
        }));

        return this.props.editProduct(formData)
            .then(() => {
                const { searchTxt } = this.state;

                this.props.search(searchTxt)
                    .then(products => {
                        const { selectedProductItem } = this.state;
                        const newTips = products
                            .map(product => {
                                return {
                                    ...product
                                };
                            });
                        const newSelectedProduct = selectedProductItem ? find(tip => tip.id === selectedProductItem.id, newTips) : null;

                        this.setState({
                            tips: newTips,
                            selectedProductItem: newSelectedProduct
                        });
                    });
            });
    };

    renderEditPagesSeo = () => {
        const { classes } = this.props;

        return <div>
            <Paper className={classes.paper}>
                <div className={classes.headerContainer}>
                    <Typography variant='h6' id='seoTitle'>SEO</Typography>
                </div>
                <SeoTabs pages={PAGES} option='staticSeo'/>
            </Paper>
        </div>;
    };

    renderEditProductSeo = () => {
        const { classes } = this.props;
        const { searchTxt, tips, selectedProductItem } = this.state;
        const id = prop('id', selectedProductItem);
        const values = {
            ...(selectedProductItem || {})
        };
        const check = (prop) => id === prop;

        return <div>
            <div className={classes.searchWrapp}>
                <TextField
                    label='Поиск'
                    value={searchTxt}
                    onChange={this.handleSearchChange}
                    margin='normal'
                    className={classes.search}
                    variant='outlined'
                />
            </div>
            {
                searchTxt.length !== 0 && <div className={classes.products}>
                    <Typography variant='h6'>{` По запросу '${searchTxt}' ${(!tips.length && searchTxt.length) ? 'ничего не найдено' : 'найдено'}`}</Typography>
                    <div className={classes.cardContainer}>
                        {
                            tips.map(tip => {
                                return <div key={tip.id} onClick={this.handleSelectedProduct(tip)} className={classes.cardLink}>
                                    <Card className={classNames(classes.card, { [classes.selectedProductItem]: check(tip.id) })}>
                                        <CardMedia
                                            className={classes.media}
                                            image={tip.avatar}
                                            title={tip.texts.ru.name}
                                        />
                                        <CardHeader
                                            title={tip.texts.ru.name}
                                        />
                                    </Card>
                                </div>;
                            })
                        }
                    </div>
                </div>
            }
            <Modal open={!!id} onClose={this.handleCloseProductSeoForm} className={classes.modal} disableEnforceFocus>
                <Paper className={classes.modalContent}>
                    <SeoForm values={values} onSubmit={this.handleFormDone(selectedProductItem)} />
                </Paper>
            </Modal>
        </div>;
    };

    render () {
        const { classes } = this.props;
        const { loading, tabsValue } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div className={classes.container}>
            <AppBar position='static' color='default'>
                <Tabs
                    value={tabsValue}
                    onChange={this.handleChange}
                    indicatorColor='primary'
                    textColor='primary'
                    variant='fullWidth'
                >
                    <Tab onClick={this.handleTableChange(0)} label='Редактирование SEO страниц' />
                    <Tab onClick={this.handleTableChange(1)} label='Поиск по товарам' />
                </Tabs>
            </AppBar>
            <SwipeableViews
                index={tabsValue}
                onChangeIndex={this.handleChangeIndex}
            >
                {this.renderEditPagesSeo(0)}
                {this.renderEditProductSeo(1)}
            </SwipeableViews>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(SeoPage));
