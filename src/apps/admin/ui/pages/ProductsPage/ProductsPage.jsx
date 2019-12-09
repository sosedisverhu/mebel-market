import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import pathOr from '@tinkoff/utils/object/pathOr';
import noop from '@tinkoff/utils/function/noop';

import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Tooltip from '@material-ui/core/Tooltip';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import ReorderIcon from '@material-ui/icons/Reorder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FolderIcon from '@material-ui/icons/Folder';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { withStyles } from '@material-ui/core/styles';

import AdminTable from '../../components/AdminTable/AdminTable.jsx';
import ProductForm from '../../components/ProductForm/ProductForm';
import CategoryForm from '../../components/CategoryForm/CategoryForm';

import arrayMove from '../../../utils/arrayMove';

import getCategories from '../../../services/getCategories';
import editProductsCategory from '../../../services/editProductsCategory';
import deleteCategoriesByIds from '../../../services/deleteCategoriesByIds';
import getProducts from '../../../services/getProducts';
import deleteProductsByIds from '../../../services/deleteProductsByIds';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const ButtonSortable = SortableHandle(({ classes }) => (
    <ReorderIcon className={classes.buttonSortable}> reorder </ReorderIcon>
));

const ItemSortable = SortableElement(({ onFormOpen, onCategoryDelete, name, onCategoryClick, value, classes }) => (
    <ListItem onClick={onCategoryClick(value)} button className={classes.row}>
        <ButtonSortable classes={classes}/>
        <ListItemIcon>
            <FolderIcon/>
        </ListItemIcon>
        <ListItemText
            className={classes.listItemText}
            primary={name}
        />
        <div className={classes.valueActions}>
            <ListItemSecondaryAction>
                <IconButton onClick={onFormOpen(value)}>
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={onCategoryDelete(value)} edge="end" aria-label="delete">
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>
        </div>
    </ListItem>
));

const SortableWrapper = SortableContainer((
    {
        productsCategory,
        ...rest
    }) =>
    <List>
        {
            productsCategory.map((value, i) => {
                const name = pathOr(['texts', DEFAULT_LANG, 'name'], '', value);

                return <ItemSortable key={i} name={name} value={value} index={i} {...rest}/>;
            })
        }
    </List>
);

const headerRows = [
    { id: 'name', label: 'Название' },
    { id: 'price', label: 'Цена' },
    { id: 'active', label: 'Active' }
];

const tableCells = [
    { prop: product => pathOr(['texts', DEFAULT_LANG, 'name'], '', product) },
    { prop: product => product.price },
    { prop: product => product.hidden ? <CloseIcon/> : <CheckIcon/> }
];

const materialStyles = theme => ({
    root: {
        display: 'flex'
    },
    drawer: {
        width: '400px',
        flexShrink: 0
    },
    drawerPaper: {
        top: '0px',
        width: '400px',
        position: 'relative',
        minHeight: '100vh'
    },
    content: {
        flexGrow: 1,
        padding: '30px'
    },
    toolbar: {
        height: '0px'
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
    buttonSortable: {
        position: 'relative',
        marginRight: '12px',
        cursor: 'pointer'
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
    valueActions: {
        visibility: 'hidden'
    },
    listItemText: {
        cursor: 'default'
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh'
    }
});

const mapStateToProps = ({ application, products }) => {
    return {
        categories: application.productsCategories,
        products: products.products
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCategories: payload => dispatch(getCategories(payload)),
    deleteCategories: payload => dispatch(deleteCategoriesByIds(payload)),
    editProductsCategory: payload => dispatch(editProductsCategory(payload)),
    getProducts: payload => dispatch(getProducts(payload)),
    deleteProducts: payload => dispatch(deleteProductsByIds(payload))
});

const DEFAULT_LANG = 'ru';
const DEFAULT_ACTIVE_CATEGORY = { name: '', id: '' };

class ProductsPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        categories: PropTypes.array.isRequired,
        getCategories: PropTypes.func.isRequired,
        deleteCategories: PropTypes.func.isRequired,
        editProductsCategory: PropTypes.func.isRequired,
        getProducts: PropTypes.func.isRequired,
        deleteProducts: PropTypes.func.isRequired,
        products: PropTypes.array
    };

    static defaultProps = {
        categories: [],
        products: [],
        getCategories: noop,
        deleteCategories: noop,
        editProductsCategory: noop,
        getProducts: noop
    };

    state = {
        loading: true,
        activeProductCategory: DEFAULT_ACTIVE_CATEGORY,
        productFormShowed: false,
        categoryFormShowed: false,
        editableCategory: {},
        editableProduct: {},
        productsCategories: [],
        products: [],
        valueForDelete: null
    };

    componentDidMount () {
        Promise.all([
            this.props.getProducts(),
            this.props.getCategories()
        ])
            .then(() => {
                this.setState({
                    loading: false,
                    productsCategories: this.props.categories,
                    activeProductCategory: this.props.categories[0] || DEFAULT_ACTIVE_CATEGORY,
                    products: this.getCategoryProducts(this.props.categories[0])
                });
            });
    }

    getCategoryProducts = (activeCategory = this.state.activeProductCategory) => {
        return this.props.products.filter(product => product.categoryId === activeCategory.id);
    };

    handleProductFormOpen = product => () => {
        this.setState({
            productFormShowed: true,
            editableProduct: product
        });
    };

    handleCategoryFormOpen = category => () => {
        this.setState({
            categoryFormShowed: true,
            editableCategory: category
        });
    };

    handleCategoryFormDone = () => {
        const { activeProductCategory } = this.state;

        this.props.getCategories()
            .then(() => {
                const { categories } = this.props;

                this.setState({
                    productsCategories: categories,
                    activeProductCategory: categories.find(category => category.id === activeProductCategory.id) || categories[0]
                });
                this.handleCloseCategoryForm();

                this.props.getProducts()
                    .then(() => {
                        this.setState({
                            products: this.getCategoryProducts()
                        });
                    });
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

    handleCategoryDelete = category => () => {
        this.setState({
            valueForDelete: category
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

    handleWarningDisagree = () => {
        this.setState({
            valueForDelete: null
        });
    };

    handleWarningAgree = () => {
        const { valueForDelete, activeProductCategory } = this.state;

        this.props.deleteCategories(valueForDelete.id)
            .then(() => {
                this.setState({
                    productsCategories: this.props.categories,
                    activeProductCategory: activeProductCategory === valueForDelete && DEFAULT_ACTIVE_CATEGORY,
                    valueForDelete: null
                });
            });
    };

    handleCloseProductForm = () => {
        this.setState({
            productFormShowed: false,
            editableProduct: null
        });
    };

    handleCloseCategoryForm = () => {
        this.setState({
            categoryFormShowed: false
        });
    };

    handleCategoryClick = category => () => {
        this.setState({
            activeProductCategory: category,
            products: this.getCategoryProducts(category)
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { productsCategories } = this.state;
        const newValues = arrayMove(productsCategories, oldIndex, newIndex);

        newValues.forEach((category, i) => {
            category.positionIndex = i;

            this.props.editProductsCategory(category);
        });

        this.setState({
            productsCategories: newValues
        });
    };

    renderTable = () => {
        const { classes } = this.props;
        const {
            loading,
            activeProductCategory,
            editableProduct,
            productFormShowed,
            productsCategories,
            products
        } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        if (!productsCategories.length) {
            return <div>
                <Typography variant='h6' className={classes.categoryTitle}>Создайте сначала категорию</Typography>
            </div>;
        }

        if (!activeProductCategory) {
            return <div>
                <Typography variant='h6' className={classes.categoryTitle}>Выберите категорию</Typography>
            </div>;
        }

        return <div>
            <div className={classes.toolbar}/>
            <AdminTable
                headerRows={headerRows}
                tableCells={tableCells}
                values={products}
                headerText={`Товары в категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeProductCategory)}"`}
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
                        categories={productsCategories}
                        activeCategory={activeProductCategory}
                        product={editableProduct}
                        onDone={this.handleProductFormDone}/>
                </Paper>
            </Modal>
        </div>;
    };

    render () {
        const { classes } = this.props;
        const {
            editableCategory,
            valueForDelete,
            productsCategories,
            lang,
            categoryFormShowed
        } = this.state;

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
                    <Tooltip title='Добавление'>
                        <IconButton aria-label='Add' onClick={this.handleCategoryFormOpen()}>
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
                <Divider/>
                <div className={classes.toolbar}/>
                <SortableWrapper
                    axis='xy'
                    onFormOpen={this.handleCategoryFormOpen}
                    onCategoryDelete={this.handleCategoryDelete}
                    onCategoryClick={this.handleCategoryClick}
                    onSortEnd={this.onDragEnd}
                    productsCategory={productsCategories}
                    lang={lang}
                    useDragHandle
                    classes={classes}
                />
            </Drawer>
            <Modal open={categoryFormShowed} onClose={this.handleCloseCategoryForm} className={classes.modal} disableEnforceFocus>
                <Paper className={classes.modalContent}>
                    <CategoryForm categories={productsCategories} category={editableCategory} onDone={this.handleCategoryFormDone}/>
                </Paper>
            </Modal>
            <Dialog
                open={!!valueForDelete}
                onClose={this.handleWarningDisagree}
            >
                <DialogTitle>Вы точно хотите удалить категорию?</DialogTitle>
                <DialogContent className={classes.warningContent}>
                    <DialogContentText>{valueForDelete && valueForDelete.name}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleWarningDisagree} color='primary'>
                        Нет
                    </Button>
                    <Button onClick={this.handleWarningAgree} color='primary' autoFocus>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
        </main>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ProductsPage));
