import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import pathOr from '@tinkoff/utils/object/pathOr';
import isEmpty from '@tinkoff/utils/is/empty';

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

import AdminTableSortable from '../../components/AdminTableSortable/AdminTableSortable.jsx';
import SubCategoryForm from '../../components/SubCategoryForm/SubCategoryForm';
import CategoryForm from '../../components/CategoryForm/CategoryForm';
import DrawerDouble from '../../components/DrawerDouble/DrawerDouble';
import AdminTable from '../../components/AdminTable/AdminTable';
import ProductForm from '../../components/ProductForm/ProductForm';

import arrayMove from '../../../utils/arrayMove';

import getCategories from '../../../services/getCategories';
import editCategory from '../../../services/editCategory';
import editSubCategory from '../../../services/editSubCategory';
import deleteCategoriesByIds from '../../../services/deleteCategoriesByIds';
import getSubCategories from '../../../services/getSubCategories';
import deleteSubCategoriesByIds from '../../../services/deleteSubCategoriesByIds';
import getProducts from '../../../services/getProducts';
import deleteProductsByIds from '../../../services/deleteProductsByIds';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import noop from "@tinkoff/utils/function/noop";

const mapStateToProps = ({ data }) => {
    return {
        categories: data.categories,
        subCategories: data.subCategories,
        products: data.products
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCategories: payload => dispatch(getCategories(payload)),
    getSubCategories: payload => dispatch(getSubCategories(payload)),
    editCategory: payload => dispatch(editCategory(payload)),
    editSubCategory: payload => dispatch(editSubCategory(payload)),
    deleteCategories: payload => dispatch(deleteCategoriesByIds(payload)),
    deleteSubCategories: payload => dispatch(deleteSubCategoriesByIds(payload)),
    getProducts: payload => dispatch(getProducts(payload)),
    deleteProducts: payload => dispatch(deleteProductsByIds(payload))
});

const DEFAULT_LANG = 'ru';
const DEFAULT_ACTIVE_CATEGORY = { name: '', id: '' };

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
        visibility: 'hidden',
        '@media (max-width:780px)': {
            visibility: 'visible'
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
        category,
        ...rest
    }) =>
    <List>
        {
            category.map((value, i) => {
                const name = pathOr(['texts', DEFAULT_LANG, 'name'], '', value);

                return <ItemSortable key={i} name={name} value={value} index={i} {...rest}/>;
            })
        }
    </List>
);

const headerRows = [
    { id: 'name', label: 'Название' },
    { id: 'active', label: 'Active' }
];

const tableCells = [
    { prop: subCategory => pathOr(['texts', DEFAULT_LANG, 'name'], '', subCategory) },
    { prop: subCategory => subCategory.hidden ? <CloseIcon/> : <CheckIcon/> }
];

class CategoriesPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getCategories: PropTypes.func.isRequired,
        getSubCategories: PropTypes.func.isRequired,
        editCategory: PropTypes.func.isRequired,
        editSubCategory: PropTypes.func.isRequired,
        deleteCategories: PropTypes.func.isRequired,
        deleteSubCategories: PropTypes.func.isRequired,
        categories: PropTypes.array.isRequired,
        subCategories: PropTypes.array,
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

    constructor(props) {
        super(props);

        const { products } = this.props;

        this.state = {
            loading: true,
            activeCategory: null,
            activeSubCategory: null,
            subCategoryFormShowed: false,
            categoryFormShowed: false,
            productFormShowed: false,
            editableCategory: {},
            editableSubCategory: {},
            categories: [],
            subCategories: [],
            valueForDelete: null,
            products
        };
    }

    componentDidMount () {
        const { getSubCategories, getCategories, getProducts } = this.props;

        Promise.all([
            getSubCategories(),
            getCategories(),
            getProducts()
        ])
            .then(() => {
                const { categories } = this.props;
                const products = this.getCategoryProducts(categories[0]);

                this.setState({
                    loading: false,
                    categories: categories,
                    products
                });
            });
    }

    getActiveSubCategories = (activeCategory = this.state.activeCategory) => {
        return this.props.subCategories.filter(subCategory => subCategory.categoryId === pathOr(['id'], '', activeCategory));
    };

    getCategoryProducts = (activeCategory = this.state.activeCategory) => {
        return this.props.products.filter(product => product.categoryId === pathOr(['id'], '', activeCategory));
    };

    setCategoryProducts = () => {
        this.setState({ products: this.getCategoryProducts() });
    }

    setActiveSubItem = (value) => {
        this.setState({ activeSubCategory: value });
    }

    getSubCategoryProducts = (activeSubCategory = this.state.activeSubCategory) => {
        return this.props.products.filter(product => product.subCategoryId === activeSubCategory.id);
    };

    handleCategoryFormOpen = category => () => {
        this.setState({
            categoryFormShowed: true,
            editableCategory: category
        });
    };

    handleSubCategoryFormOpen = subCategory => () => {
        this.setState({
            subCategoryFormShowed: true,
            editableSubCategory: subCategory
        });
    };

    handleCategoryFormDone = () => {
        const { activeCategory } = this.state;

        this.props.getCategories()
            .then(() => {
                const { categories } = this.props;

                this.setState({
                    categories: categories,
                    activeCategory: categories.find(category => category.id === pathOr(['id'], '', activeCategory)) || categories[0]
                });
                this.handleCloseCategoryForm();

                this.props.getSubCategories()
                    .then(() => {
                        this.setState({
                            subCategories: this.getActiveSubCategories()
                        });
                    });
            });
    };

    handleSubCategoryFormDone = () => {
        this.props.getSubCategories()
            .then(() => {
                this.setState({
                    subCategories: this.getActiveSubCategories()
                });
                this.handleCloseSubCategoryForm();
            });
    };

    handleCategoryDelete = category => () => {
        this.setState({
            valueForDelete: category
        });
    };

    handleWarningDisagree = () => {
        this.setState({
            valueForDelete: null
        });
    };

    handleWarningAgree = () => {
        const { valueForDelete, activeCategory, categories } = this.state;
        const valueType = categories.includes(valueForDelete) ? 'category' : 'subCategory';

        if (valueType === 'category') {
            return this.props.deleteCategories(valueForDelete.id)
                .then(() => {
                    getCategories();
                })
                .then(() => {
                    this.setState({
                        categories: this.props.categories,
                        activeCategory: activeCategory === valueForDelete && DEFAULT_ACTIVE_CATEGORY,
                        valueForDelete: null
                    });
                });
        }


        this.props.deleteSubCategories(valueForDelete.id)
            .then(() => {
                this.props.getSubCategories()
                    .then(() => {
                        this.setState({
                            subCategories: this.getActiveSubCategories(),
                            valueForDelete: null
                        });
                    });
            });
    };

    handleCloseSubCategoryForm = () => {
        this.setState({
            subCategoryFormShowed: false,
            editableSubCategory: null
        });
    };

    handleCloseCategoryForm = () => {
        this.setState({
            categoryFormShowed: false
        });
    };

    handleCategoryClick = category => () => {
        this.setState({
            activeCategory: category,
            subCategories: this.getActiveSubCategories(category),
            products: this.getCategoryProducts(category)
        });
    };

    handleSubCategoryClick = subCategory => () => {
        this.setState({
            activeSubCategory: subCategory,
            products: this.getSubCategoryProducts(subCategory)
        });
    };

    onDragCategoriesEnd = ({ oldIndex, newIndex }) => {
        const { categories } = this.state;
        const newValues = arrayMove(categories, oldIndex, newIndex);

        newValues.forEach((category, i) => {
            category.positionIndex = i;

            this.props.editCategory(category);
        });

        this.setState({
            categories: newValues
        });
    };

    onDragSubCategoriesEnd = ({ oldIndex, newIndex }) => {
        const { subCategories } = this.state;
        const newValues = arrayMove(subCategories, oldIndex, newIndex);

        newValues.forEach((subCategory, i) => {
            subCategory.positionIndex = i;

            this.props.editSubCategory(subCategory);
        });

        this.setState({
            subCategories: newValues
        });
    };

    renderTable = () => {
        const { classes } = this.props;
        const {
            loading,
            activeCategory,
            activeSubCategory,
            editableProduct,
            productFormShowed,
            categories,
            subCategories,
            products,
            subCategoryFormShowed,
            editableSubCategory
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

            case !activeCategory:
                return <div>
                    <Typography variant='h6' className={classes.categoryTitle}>
                        Выберите категорию
                    </Typography>
                </div>;

            case !subCategories.length:
                return <div>
                    <Typography variant='h6' className={classes.categoryTitle}>
                        В категории нет подкатегорий
                    </Typography>
                </div>;

            case isEmpty(activeSubCategory) && !products.length:
                return <div>
                    <Typography variant='h6' className={classes.categoryTitle}>
                        {`В категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeCategory)}" нет товаров`}
                    </Typography>
                </div>;

            case !isEmpty(activeSubCategory) && !products.length:
                return <div>
                    <Typography variant='h6' className={classes.categoryTitle}>
                        {`В подкатегории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeSubCategory)}" нет товаров`}
                    </Typography>
                </div>;

            default:
                const categoriesWithSubCategories = categories.filter(category => {
                    return this.props.subCategories.some(subCategory => subCategory.categoryId === category.id);
                });
                const haderText = isEmpty(activeSubCategory)
                    ? `Товары в категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeCategory)}"`
                    : `Товары в подкатегории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeSubCategory)}"`;
                return <div>
                    <AdminTable
                        headerRows={headerRows}
                        tableCells={tableCells}
                        values={products}
                        headerText={haderText}
                        onDelete={this.handleProductDelete}
                        deleteValueWarningTitle='Вы точно хотите удалить товар?'
                        deleteValuesWarningTitle='Вы точно хотите удалить следующие товары?'
                        filters={false}
                        onFormOpen={this.handleProductFormOpen}
                        isSmall
                    />
                    <Modal
                        open={subCategoryFormShowed}
                        onClose={this.handleCloseSubCategoryForm}
                        className={classes.modal}
                        disableEnforceFocus
                    >
                        <Paper className={classes.modalContent}>
                            <SubCategoryForm
                                categories={categories}
                                subCategories={subCategories}
                                activeCategory={activeCategory}
                                subCategory={editableSubCategory}
                                onDone={this.handleSubCategoryFormDone}/>
                        </Paper>
                    </Modal>
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
        const {
            editableCategory,
            valueForDelete,
            categories,
            subCategories,
            lang,
            categoryFormShowed,
            activeCategory,
            activeSubCategory
        } = this.state;

        return <main className={classes.root}>
            <div className={classes.content}>
                {this.renderTable()}
            </div>
            <DrawerDouble
                anchor='left'
                variant='permanent'
                items={categories}
                subItems={subCategories}
                openFormItem={this.handleCategoryFormOpen}
                deleteItem={this.handleCategoryDelete}
                clickItem={this.handleCategoryClick}
                openFormSubItem={this.handleSubCategoryFormOpen}
                activeItem={activeCategory}
                titleItems='Категории'
                titleSubItems={`Подкатегории в категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeCategory)}"`}
                lang={lang}
                clickSubItem={this.handleSubCategoryClick}
                sortItemsEnd={this.onDragCategoriesEnd}
                sortSubItemsEnd={this.onDragSubCategoriesEnd}
                setProductsItem={this.setCategoryProducts}
                setActiveSubItem={this.setActiveSubItem}
            />
            <Modal
                open={categoryFormShowed}
                onClose={this.handleCloseCategoryForm}
                className={classes.modal}
                disableEnforceFocus
            >
                <Paper className={classes.modalContent}>
                    <CategoryForm
                        categories={categories}
                        category={editableCategory}
                        onDone={this.handleCategoryFormDone}
                    />
                </Paper>
            </Modal>
            <Dialog open={!!valueForDelete} onClose={this.handleWarningDisagree}>
                <DialogTitle>
                    {subCategories
                        ? 'Вы точно хотите удалить категорию?'
                        : 'Вы точно хотите удалить подкатегорию?'}
                </DialogTitle>
                <DialogContent className={classes.warningContent}>
                    <DialogContentText>{pathOr(['texts', DEFAULT_LANG, 'name'], '', valueForDelete)}</DialogContentText>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(CategoriesPage));
