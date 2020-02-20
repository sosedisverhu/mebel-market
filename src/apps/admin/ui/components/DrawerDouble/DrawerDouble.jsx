import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isEmpty from '@tinkoff/utils/is/empty';

import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import {SortableContainer, SortableElement, SortableHandle} from "react-sortable-hoc";
import List from "@material-ui/core/List";
import pathOr from "@tinkoff/utils/object/pathOr";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FolderIcon from "@material-ui/icons/Folder";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ReorderIcon from "@material-ui/icons/Reorder";

const materialStyles = theme => ({
    toolbarNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 18px'
    },
    categoryTitle: {
        lineHeight: '1.4',
        padding: '0 15px'
    },
    drawer: {
        width: '30%',
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
        width: '100%',
        position: 'relative',
        minHeight: '93vh',
        border: '2px solid red',
        '@media (max-width:1200px)': {
            zIndex: '0',
            minHeight: 'unset',
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
    buttonSortable: {
        position: 'relative',
        marginRight: '12px',
        cursor: 'pointer',
        zIndex: '1'
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        backgroundColor: 'white',
        zIndex: 1201,
        position: 'relative',
        '&:hover $valueActions': {
            visibility: 'visible'
        },
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.07)'
        }
    },
    valueActions: {
        visibility: 'hidden',
        zIndex: '1',
        '@media (max-width:780px)': {
            visibility: 'visible'
        }
    },
    listItemText: {
        cursor: 'default',
        paddingLeft: '0',
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
    },
    itemCover: {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%'
    }
});

const DEFAULT_LANG = 'ru';

const ButtonSortable = SortableHandle(({ classes }) => (
    <ReorderIcon className={classes.buttonSortable}> reorder </ReorderIcon>
));

const ItemSortable = SortableElement(({ onOpenFormItem, onDeleteItem, name, onClickItem, value, classes }) => (
    <ListItem button className={classes.row}>
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
                <IconButton onClick={onOpenFormItem(value)}>
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={onDeleteItem(value)} edge="end" aria-label="delete">
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>
        </div>
        <div className={classes.itemCover} onClick={onClickItem(value)}/>
    </ListItem>
));

const SortableWrapper = SortableContainer((
    {
        items,
        ...rest
    }) =>
    <List>
        { items.map((value, i) => {
            const name = pathOr(['texts', DEFAULT_LANG, 'name'], '', value);

            return <ItemSortable key={i} name={name} value={value} index={i} {...rest}/>;
        }) }
    </List>
);

class DrawerDouble extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        anchor: PropTypes.string.isRequired,
        variant: PropTypes.string.isRequired,
        openFormItem: PropTypes.func.isRequired,
        items: PropTypes.array.isRequired,
        subItems: PropTypes.array.isRequired,
        sortItemsEnd: PropTypes.func.isRequired,
        sortSubItemsEnd: PropTypes.func.isRequired,
        deleteItem: PropTypes.func.isRequired,
        clickItem: PropTypes.func.isRequired,
        clickSubItem: PropTypes.func.isRequired,
        openFormSubItem: PropTypes.func.isRequired,
        titleItems: PropTypes.string.isRequired,
        titleSubItems: PropTypes.string.isRequired,
        setProductsItem: PropTypes.func.isRequired,
        setActiveSubItem: PropTypes.func.isRequired

        // getCategories: PropTypes.func.isRequired,
        // getSubCategories: PropTypes.func.isRequired,
        // editCategory: PropTypes.func.isRequired,
        // editSubCategory: PropTypes.func.isRequired,
        // deleteCategories: PropTypes.func.isRequired,
        // deleteSubCategories: PropTypes.func.isRequired,
        // categories: PropTypes.array.isRequired,
        // subCategories: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.state = {
            isSubItemsActive: false
        }
    }

    handleClickItem = (item) => () => {
        const { clickItem } = this.props;
        this.setState({isSubItemsActive: true});

        clickItem(item)();
    }

    handleClickSubItem = (item) => () => {
        const { clickSubItem, setActiveSubItem } = this.props;
        setActiveSubItem(item);
        clickSubItem(item)();
    }

    handleClickBack = () => {
        const { setProductsItem, setActiveSubItem } = this.props;
        this.setState({isSubItemsActive: false});
        setActiveSubItem(null);
        setProductsItem();
    };

    render () {
        const { classes, anchor, variant, openFormItem, openFormSubItem, items, subItems, sortItemsEnd, sortSubItemsEnd, deleteItem, titleItems, titleSubItems } = this.props;
        const { isSubItemsActive } = this.state;

        return <Drawer className={classes.drawer} anchor={anchor} variant={variant} classes={{ paper: classes.drawerPaper }} >
            <div className={classes.toolbarNav}>
                {isSubItemsActive && <Tooltip title='Назад'>
                    <IconButton aria-label='Add' onClick={this.handleClickBack}>
                        <ArrowBack/>
                    </IconButton>
                </Tooltip>}
                <Typography variant='h6' className={classes.categoryTitle}>
                    {!isSubItemsActive ? titleItems : titleSubItems}
                </Typography>
                <Tooltip title='Добавление'>
                    <IconButton aria-label='Add' onClick={openFormItem()}>
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
            </div>
            <Divider/>
            <SortableWrapper
                onOpenFormItem={(item) => !isSubItemsActive ? openFormItem(item) : openFormSubItem(item)}
                onClickItem={!isSubItemsActive ? this.handleClickItem : this.handleClickSubItem }
                onDeleteItem={(item) => deleteItem(item)}
                onSortEnd={!isSubItemsActive ? sortItemsEnd : sortSubItemsEnd}
                items={!isSubItemsActive ? items : subItems}
                useDragHandle
                classes={classes}
            />
        </Drawer>;
    }
}

export default connect()(withStyles(materialStyles)(DrawerDouble));
