import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import pathOr from '@tinkoff/utils/object/pathOr';
import noop from '@tinkoff/utils/function/noop';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

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
    getProducts: payload => dispatch(getProducts(payload)),
    editCategory: payload => dispatch(editCategory(payload)),
    editSubCategory: payload => dispatch(editSubCategory(payload)),
    deleteCategories: payload => dispatch(deleteCategoriesByIds(payload)),
    deleteSubCategories: payload => dispatch(deleteSubCategoriesByIds(payload)),
    deleteProducts: payload => dispatch(deleteProductsByIds(payload))
});

const DEFAULT_LANG = 'ru';

const materialStyles = theme => ({
    root: {
        display: 'flex',
        '@media (max-width:1200px)': {
            flexDirection: 'column-reverse'
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
    categoryTitle: {
        height: '30px'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        products: PropTypes.array,
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

    constructor (props) {
        super(props);

        this.state = {
            loading: true,
            categories: [],
            activeCategory: null,
            subCategories: [],
            activeSubCategory: null,
            products: [],
            categoryFormShowed: false,
            subCategoryFormShowed: false,
            productFormShowed: false,
            editableCategory: {},
            editableSubCategory: {},
            isSelectedCategory: false,
            isSelectedSubCategory: false,
            valueForDelete: null
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
                const activeCategory = categories[0];
                const subCategories = this.getActiveSubCategories(activeCategory);
                const products = this.getCategoryProducts(activeCategory);

                this.setState({
                    loading: false,
                    categories,
                    activeCategory,
                    subCategories,
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

    getSubCategoryProducts = (activeSubCategory = this.state.activeSubCategory) => {
        return this.props.products.filter(product => product.subCategoryId === pathOr(['id'], '', activeSubCategory));
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
                const subCategories = this.getActiveSubCategories();
                this.setState({
                    subCategories,
                    activeSubCategory: subCategories[0]
                });
                this.handleCloseSubCategoryForm();
            });
    };

    handleCategoryDelete = category => () => {
        this.setState({
            valueForDelete: category
        });
    };

    handleClickBack = () => {
        this.setState({
            isSelectedCategory: false,
            isSelectedSubCategory: false,
            products: this.getCategoryProducts()
        });
    };

    handleWarningDisagree = () => {
        this.setState({
            valueForDelete: null
        });
    };

    handleWarningAgree = () => {
        const { deleteSubCategories, deleteCategories, getSubCategories, getProducts } = this.props;
        const { valueForDelete, activeCategory, categories, activeSubCategory } = this.state;
        const valueType = categories.includes(valueForDelete) ? 'category' : 'subCategory';

        if (valueType === 'category') {
            Promise.all([
                deleteCategories(valueForDelete.id),
                getSubCategories(),
                getProducts()
            ])
                .then(() => {
                })
                .then(() => {
                    const { categories } = this.props;
                    const newActiveCategory = activeCategory === valueForDelete ? categories[0] : activeCategory;

                    this.setState({
                        categories,
                        activeCategory: newActiveCategory,
                        products: this.getCategoryProducts(newActiveCategory),
                        valueForDelete: null
                    });
                });
        }

        if (valueType === 'subCategory') {
            Promise.all([
                deleteSubCategories(valueForDelete.id),
                getSubCategories(),
                getProducts()
            ])
                .then(() => {
                    this.props.getSubCategories()
                        .then(() => {
                            const subCategories = this.getActiveSubCategories();
                            const newActiveSubCategory = activeSubCategory === valueForDelete ? subCategories[0] : activeSubCategory;

                            this.setState({
                                subCategories,
                                activeSubCategory: newActiveSubCategory,
                                products: this.getSubCategoryProducts(newActiveSubCategory),
                                valueForDelete: null
                            });
                        });
                });
        }
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
            isSelectedCategory: true,
            activeCategory: category,
            subCategories: this.getActiveSubCategories(category),
            products: this.getCategoryProducts(category)
        });
    };

    handleSubCategoryClick = subCategory => () => {
        this.setState({
            isSelectedSubCategory: true,
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

    handleProductDelete = product => {
        const { isSelectedSubCategory } = this.state;

        return this.props.deleteProducts(product)
            .then(() => {
                this.props.getProducts()
                    .then(() => {
                        const products = !isSelectedSubCategory ? this.getCategoryProducts() : this.getSubCategoryProducts();

                        this.setState({ products });
                    });
            });
    };

    handleProductFormOpen = product => () => {
        this.setState({
            productFormShowed: true,
            editableProduct: product
        });
    };

    handleCloseProductForm = () => {
        this.setState({
            productFormShowed: false,
            editableProduct: null
        });
    };

    handleProductFormDone = () => {
        const { isSelectedSubCategory } = this.state;

        this.props.getProducts()
            .then(() => {
                const products = !isSelectedSubCategory ? this.getCategoryProducts() : this.getSubCategoryProducts();

                this.setState({ products });
                this.handleCloseProductForm();
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
            isSelectedSubCategory
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
                    {`В категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeCategory)}" нет подкатегорий`}
                </Typography>
            </div>;

        default:
            const categoriesWithSubCategories = categories.filter(category => {
                return this.props.subCategories.some(subCategory => subCategory.categoryId === category.id);
            });
            const haderText = !isSelectedSubCategory
                ? `Товары в категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeCategory)}"`
                : `Товары в подкатегории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeSubCategory)}"`;
            return <div>
                <AdminTable
                    headerRows={headerRows}
                    tableCells={tableCells}
                    values={products}
                    headerText={haderText}
                    deleteValueWarningTitle='Вы точно хотите удалить товар?'
                    deleteValuesWarningTitle='Вы точно хотите удалить следующие товары?'
                    filters={false}
                    isSmall
                    onDelete={this.handleProductDelete}
                    onFormOpen={this.handleProductFormOpen}
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
        const {
            editableCategory,
            valueForDelete,
            categories,
            subCategories,
            lang,
            categoryFormShowed,
            activeCategory,
            isSelectedCategory,
            subCategoryFormShowed,
            editableSubCategory
        } = this.state;

        return <main className={classes.root}>
            <div className={classes.content}>
                {this.renderTable()}
            </div>
            <DrawerDouble
                variant='permanent'
                isSelectedItem={isSelectedCategory}
                lang={lang}
                items={categories}
                subItems={subCategories}
                clickItem={this.handleCategoryClick}
                clickSubItem={this.handleSubCategoryClick}
                openFormItem={this.handleCategoryFormOpen}
                openFormSubItem={this.handleSubCategoryFormOpen}
                deleteItem={this.handleCategoryDelete}
                sortItemsEnd={this.onDragCategoriesEnd}
                sortSubItemsEnd={this.onDragSubCategoriesEnd}
                clickBack={this.handleClickBack}
                titleItems='Категории'
                titleSubItems={`Подкатегории в категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeCategory)}"`}
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
            <Dialog open={!!valueForDelete} onClose={this.handleWarningDisagree}>
                <DialogTitle>
                    {!isSelectedCategory
                        ? 'Вы точно хотите удалить категорию и все подкатегории и товары в ней?'
                        : 'Вы точно хотите удалить подкатегорию и все товары в ней?'}
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
