import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import pathOr from '@tinkoff/utils/object/pathOr';

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

import arrayMove from '../../../utils/arrayMove';

import getCategories from '../../../services/getCategories';
import editCategory from '../../../services/editCategory';
import editSubCategory from '../../../services/editSubCategory';
import deleteCategoriesByIds from '../../../services/deleteCategoriesByIds';
import getSubCategories from '../../../services/getSubCategories';
import deleteSubCategoriesByIds from '../../../services/deleteSubCategoriesByIds';

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

const mapStateToProps = ({ data }) => {
    return {
        categories: data.categories,
        subCategories: data.subCategories
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCategories: payload => dispatch(getCategories(payload)),
    getSubCategories: payload => dispatch(getSubCategories(payload)),
    editCategory: payload => dispatch(editCategory(payload)),
    editSubCategory: payload => dispatch(editSubCategory(payload)),
    deleteCategories: payload => dispatch(deleteCategoriesByIds(payload)),
    deleteSubCategories: payload => dispatch(deleteSubCategoriesByIds(payload))
});

const DEFAULT_LANG = 'ru';
const DEFAULT_ACTIVE_CATEGORY = { name: '', id: '' };

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
        subCategories: PropTypes.array
    };

    static defaultProps = {
        categories: [],
        subCategories: []
    };

    state = {
        loading: true,
        activeCategory: DEFAULT_ACTIVE_CATEGORY,
        subCategoryFormShowed: false,
        categoryFormShowed: false,
        editableCategory: {},
        editableSubCategory: {},
        categories: [],
        subCategories: [],
        valueForDelete: null
    };

    componentDidMount () {
        Promise.all([
            this.props.getSubCategories(),
            this.props.getCategories()
        ])
            .then(() => {
                this.setState({
                    loading: false,
                    categories: this.props.categories,
                    activeCategory: this.props.categories[0] || DEFAULT_ACTIVE_CATEGORY,
                    subCategories: this.getCategory(this.props.categories[0])
                });
            });
    }

    getCategory = (activeCategory = this.state.activeCategory) => {
        return this.props.subCategories.filter(subCategory => subCategory.categoryId === activeCategory.id);
    };

    handleSubCategoryFormOpen = subCategory => () => {
        this.setState({
            subCategoryFormShowed: true,
            editableSubCategory: subCategory
        });
    };

    handleCategoryFormOpen = category => () => {
        this.setState({
            categoryFormShowed: true,
            editableCategory: category
        });
    };

    handleCategoryFormDone = () => {
        const { activeCategory } = this.state;

        this.props.getCategories()
            .then(() => {
                const { categories } = this.props;

                this.setState({
                    categories: categories,
                    activeCategory: categories.find(category => category.id === activeCategory.id) || categories[0]
                });
                this.handleCloseCategoryForm();

                this.props.getSubCategories()
                    .then(() => {
                        this.setState({
                            subCategories: this.getCategory()
                        });
                    });
            });
    };

    handleSubCategoryFormDone = () => {
        this.props.getSubCategories()
            .then(() => {
                this.setState({
                    subCategories: this.getCategory()
                });
                this.handleCloseSubCategoryForm();
            });
    };

    handleCategoryDelete = category => () => {
        this.setState({
            valueForDelete: category
        });
    };

    handleSubCategoryDelete = subcategory => {
        return this.props.deleteSubCategories(subcategory)
            .then(() => {
                this.props.getSubCategories()
                    .then(() => {
                        this.setState({
                            subCategories: this.getCategory()
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
        const { valueForDelete, activeCategory } = this.state;

        this.props.deleteCategories(valueForDelete.id)
            .then(() => {
                getCategories();
            })
            .then(() => {
                this.props.subCategories.forEach((subCategory) => {
                    if (subCategory.categoryId === valueForDelete.id) {
                        this.handleSubCategoryDelete(subCategory.id);
                    }
                });
            })
            .then(() => {
                this.setState({
                    categories: this.props.categories,
                    activeCategory: activeCategory === valueForDelete && DEFAULT_ACTIVE_CATEGORY,
                    valueForDelete: null
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
            subCategories: this.getCategory(category)
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
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

    onDragSubCategoryEnd = (oldIndex, newIndex) => {
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
            editableSubCategory,
            subCategoryFormShowed,
            categories,
            subCategories
        } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        if (!categories.length) {
            return <div>
                <Typography variant='h6' className={classes.categoryTitle}>
                    Создайте сначала категорию
                </Typography>
            </div>;
        }

        if (!activeCategory) {
            return <div>
                <Typography variant='h6' className={classes.categoryTitle}>
                    Выберите категорию
                </Typography>
            </div>;
        }

        return <div>
            <div className={classes.toolbar}/>
            <AdminTableSortable
                headerRows={headerRows}
                tableCells={tableCells}
                values={subCategories}
                headerText={`Подкатегории в категории "${pathOr(['texts', DEFAULT_LANG, 'name'], '', activeCategory)}"`}
                onDelete={this.handleSubCategoryDelete}
                deleteValueWarningTitle='Вы точно хотите удалить подкатегорию?'
                deleteValuesWarningTitle='Вы точно хотите удалить следующие подкатегории?'
                filters={false}
                onFormOpen={this.handleSubCategoryFormOpen}
                onDragEnd={this.onDragSubCategoryEnd}
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
        </div>;
    };

    render () {
        const { classes } = this.props;
        const {
            editableCategory,
            valueForDelete,
            categories,
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
                    <Typography variant='h6' className={classes.categoryTitle}>
                        Категории
                    </Typography>
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
                    category={categories}
                    lang={lang}
                    useDragHandle
                    classes={classes}
                />
            </Drawer>
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
                    Вы точно хотите удалить категорию?
                </DialogTitle>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(CategoriesPage));
