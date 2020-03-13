import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import List from '@material-ui/core/List';
import pathOr from '@tinkoff/utils/object/pathOr';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ReorderIcon from '@material-ui/icons/Reorder';

const materialStyles = theme => ({
    toolbarNav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 18px',
        '@media (max-width:1200px)': {
            padding: '0'
        }
    },
    drawerTitle: {
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
        '@media (max-width:1200px)': {
            zIndex: '0',
            minHeight: 'unset',
            maxWidth: 'unset'
        }
    },
    buttonSortable: {
        position: 'relative',
        marginRight: '12px',
        cursor: 'pointer',
        zIndex: '1'
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
    itemCover: {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%'
    },
    buttonBack: {
        '@media (max-width:1200px)': {
            paddingRight: '0'
        }
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
        isSelectedItem: PropTypes.bool.isRequired,
        clickBack: PropTypes.func.isRequired
    };

    handleClickItem = (item) => () => {
        const { clickItem } = this.props;

        clickItem(item)();
    }

    handleClickSubItem = (item) => () => {
        const { clickSubItem } = this.props;
        clickSubItem(item)();
    }

    render () {
        const {
            classes,
            variant,
            openFormItem,
            openFormSubItem,
            items,
            subItems,
            sortItemsEnd,
            sortSubItemsEnd,
            deleteItem, titleItems,
            titleSubItems,
            isSelectedItem,
            clickBack
        } = this.props;

        return <Drawer className={classes.drawer} anchor='right' variant={variant} classes={{ paper: classes.drawerPaper }} >
            <div className={classes.toolbarNav}>
                {isSelectedItem && <Tooltip className={classes.buttonBack} title='Назад'>
                    <IconButton aria-label='Add' onClick={clickBack}>
                        <ArrowBack/>
                    </IconButton>
                </Tooltip>}
                <Typography variant='h6' className={classes.drawerTitle}>
                    {!isSelectedItem ? titleItems : titleSubItems}
                </Typography>
                <Tooltip title='Добавление'>
                    <IconButton aria-label='Add' onClick={!isSelectedItem ? openFormItem() : openFormSubItem()}>
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
            </div>
            <Divider/>
            <SortableWrapper
                onOpenFormItem={(item) => !isSelectedItem ? openFormItem(item) : openFormSubItem(item)}
                onClickItem={!isSelectedItem ? this.handleClickItem : this.handleClickSubItem }
                onDeleteItem={(item) => deleteItem(item)}
                onSortEnd={!isSelectedItem ? sortItemsEnd : sortSubItemsEnd}
                items={!isSelectedItem ? items : subItems}
                useDragHandle
                classes={classes}
            />
        </Drawer>;
    }
}

export default connect()(withStyles(materialStyles)(DrawerDouble));
