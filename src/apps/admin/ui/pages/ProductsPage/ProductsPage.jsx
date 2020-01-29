import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import pathOr from '@tinkoff/utils/object/pathOr';
import noop from '@tinkoff/utils/function/noop';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

import AdminTable from '../../components/AdminTable/AdminTable.jsx';
import ProductForm from '../../components/ProductForm/ProductForm';

import getCategories from '../../../services/getCategories';
import getSubCategories from '../../../services/getSubCategories';
import editCategory from '../../../services/editCategory';
import getProducts from '../../../services/getProducts';
import deleteProductsByIds from '../../../services/deleteProductsByIds';

const headerRows = [
    { id: 'name', label: 'Название' },
    { id: 'actualPrice', label: 'Актуальная цена' },
    { id: 'active', label: 'Active' }
];

const tableCells = [
    { prop: product => pathOr(['texts', DEFAULT_LANG, 'name'], '', product) },
    { prop: product => product.actualPrice },
    { prop: product => product.hidden ? <CloseIcon/> : <CheckIcon/> }
];

const materialStyles = theme => ({
    root: {
        display: 'flex',
        '@media (max-width:1200px)': {
            flexDirection: 'column-reverse'
        }
    },
    drawer: {
        maxWidth: '400px',
        flexShrink: 0,
        '@media (max-width:1200px)': {
            width: 'calc(100% - 60px)',
            maxWidth: 'unset',
            margin: '30px 30px 0 30px',
            boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
        },
        '@media (max-width:600px)': {
            width: 'calc(100% - 30px)',
            margin: '15px 15px 0 15px'
        },
        '@media (max-width:400px)': {
            width: '100%',
            margin: '15px 0 0 0'
        }
    },
    drawerPaper: {
        top: '0px',
        maxWidth: '400px',
        position: 'relative',
        minHeight: '93vh',
        '@media (max-width:1200px)': {
            zIndex: '0',
            minHeight: 'unset',
            width: '100%',
            maxWidth: 'unset'
        }
    },
    content: {
        flexGrow: 1,
        padding: '30px',
        '@media (max-width:600px)': {
            padding: '15px'
        },
        '@media (max-width:400px)': {
            padding: '15px 0'
        }
    },
    toolbarNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 30px 5px 30px'
    },
    categoryTitle: {
        height: '30px'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        backgroundColor: 'white',
        zIndex: 1201,
        '&:hover $valueActions': {
            visibility: 'visible'
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.07)'
        }
    },
    listItemText: {
        cursor: 'default',
        '@media (max-width:600px)': {
            maxWidth: '120px'
        },
        '@media (max-width:400px)': {
            padding: '0'
        }
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh',
        '@media (max-width:1300px)': {
            width: '90%'
        }
    }
});

const mapStateToProps = ({ data }) => {
    return {
        categories: data.categories,
        subCategories: data.subCategories,
        products: data.products
    };
};

const mapDispatchToProps = dispatch => ({
    getCategories: payload => dispatch(getCategories(payload)),
    getSubCategories: payload => dispatch(getSubCategories(payload)),
    editCategory: payload => dispatch(editCategory(payload)),
    getProducts: payload => dispatch(getProducts(payload)),
    deleteProducts: payload => dispatch(deleteProductsByIds(payload))
});

const DEFAULT_LANG = 'ru';
const DEFAULT_ACTIVE_CATEGORY = { name: '', id: '' };

class ProductsPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        categories: PropTypes.array.isRequired,
        subCategories: PropTypes.array.isRequired,
        products: PropTypes.array,
        getCategories: PropTypes.func.isRequired,
        getSubCategories: PropTypes.func.isRequired,
        getProducts: PropTypes.func.isRequired,
        deleteProducts: PropTypes.func.isRequired
    };

    static defaultProps = {
        categories: [],
        subCategories: [],
        products: [],
        getCategories: noop,
        getProducts: noop
    };

    state = {
        loading: true,
        activeCategory: DEFAULT_ACTIVE_CATEGORY,
        productFormShowed: false,
        editableProduct: {},
        categories: [],
        subCategories: [],
        products: [],
        valueForDelete: null
    };

    componentDidMount () {
        const { getProducts, getCategories, getSubCategories } = this.props;

        Promise.all([
            getProducts(),
            getCategories(),
            getSubCategories()
        ])
            .then(() => {
                const { categories, subCategories } = this.props;

                this.setState({
                    loading: false,
                    categories: categories,
                    activeCategory: categories[0] || DEFAULT_ACTIVE_CATEGORY,
                    products: this.getCategoryProducts(categories[0]),
                    subCategories: subCategories.filter((category) => categories[0].id === category.categoryId)
                });
            });
    }

    getCategoryProducts = (activeCategory = this.state.activeCategory) => {
        return this.props.products.filter(product => product.categoryId === activeCategory.id);
    };

    handleProductFormOpen = product => () => {
        this.setState({
            productFormShowed: true,
            editableProduct: product
        });
    };

    handleProductFormDone = () => {
        this.props.getProducts()
            .then(() => {
                this.setState({
                    products: this.getCategoryProducts()
                });
                this.handleCloseProductForm();
            });
    };

    handleProductDelete = product => {
        return this.props.deleteProducts(product)
            .then(() => {
                this.props.getProducts()
                    .then(() => {
                        this.setState({
                            products: this.getCategoryProducts()
                        });
                    });
            });
    };

    handleCloseProductForm = () => {
        this.setState({
            productFormShowed: false,
            editableProduct: null
        });
    };

    handleCategoryClick = category => () => {
        this.setState({
            activeCategory: category,
            products: this.getCategoryProducts(category),
            subCategories: this.props.subCategories.filter(subCategory => category.id === subCategory.categoryId)
        });
    };

    renderTable = () => {
        const { classes } = this.props;
        const {
            loading,
            activeCategory,
            editableProduct,
            productFormShowed,
            categories,
            subCategories,
            products
        } = this.state;

        switch (true) {
        case loading:
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;

        case !categories.length:
            return <div>
                <Typography variant='h6' className={classes.categoryTitle}>
                    Создайте сначала категорию
                </Typography>
            </div>;

        case !subCategories.length:
            return <div>
                <Typography variant='h6' className={classes.categoryTitle}>
                    В категории нет подкатегорий
                </Typography>
            </div>;

        case !activeCategory:
            return <div>
                <Typography variant='h6' className={classes.categoryTitle}>
                    Выберите категорию
                </Typography>
            </div>;

        default:
            const categoriesWithSubCategories = categories.filter(category => {
                return this.props.subCategories.some(subCategory => subCategory.categoryId === category.id);
            });
            return <div>
                <AdminTable
                    headerRows={headerRows}
                    tableCells={tableCells}
                    values={products}
                    headerText={`Товары в категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeCategory)}"`}
                    onDelete={this.handleProductDelete}
                    deleteValueWarningTitle='Вы точно хотите удалить товар?'
                    deleteValuesWarningTitle='Вы точно хотите удалить следующие товары?'
                    filters={false}
                    onFormOpen={this.handleProductFormOpen}
                    isSmall
                />
                <Modal open={productFormShowed} onClose={this.handleCloseProductForm} className={classes.modal} disableEnforceFocus>
                    <Paper className={classes.modalContent}>
                        <ProductForm
                            categories={categoriesWithSubCategories}
                            subCategories={subCategories}
                            allSubCategories={this.props.subCategories}
                            activeCategory={activeCategory}
                            product={editableProduct}
                            onDone={this.handleProductFormDone}/>
                    </Paper>
                </Modal>
            </div>;
        }
    };

    render () {
        const { classes } = this.props;
        const { categories } = this.state;

        return <main className={classes.root}>
            <div className={classes.content}>
                {this.renderTable()}
            </div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                anchor="right"
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.toolbarNav}>
                    <Typography variant='h6' className={classes.categoryTitle}>Категории товаров</Typography>
                </div>
                <Divider/>
                <List>
                    {categories.map(category => {
                        return <ListItem
                            onClick={this.handleCategoryClick(category)}
                            className={classes.row}
                            button
                            key={category.id}
                        >
                            <ListItemIcon>
                                <FolderIcon/>
                            </ListItemIcon>
                            <ListItemText
                                className={classes.listItemText}
                                primary={category.texts.ru.name}
                            />
                        </ListItem>;
                    })}
                </List>
            </Drawer>
        </main>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ProductsPage));
