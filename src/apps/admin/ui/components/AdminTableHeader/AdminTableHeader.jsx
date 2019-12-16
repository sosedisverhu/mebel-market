import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';

import noop from '@tinkoff/utils/function/noop';

const materialStyles = theme => ({
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: '0 0 auto'
    },
    itemsNumber: {
        display: 'flex',
        alignItems: 'center',
        width: '130px',
        justifyContent: 'space-between'
    },
    valuesActions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closeIcon: {
        cursor: 'pointer'
    },
    toolbar: {
        width: '100%',
        marginTop: theme.spacing.unit * 3
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
        maxHeight: '100vh'
    },
    warningContent: {
        paddingBottom: '0'
    }
});

class AdminTableHeader extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        headerText: PropTypes.string,
        deleteValuesWarningTitle: PropTypes.string,
        selected: PropTypes.array,
        onDelete: PropTypes.func,
        onFormOpen: PropTypes.func,
        onFiltersOpen: PropTypes.func,
        onSelectedCloseClick: PropTypes.func,
        filters: PropTypes.bool
    };

    static defaultProps = {
        headerText: '',
        deleteValuesWarningTitle: '',
        selected: [],
        onDelete: noop,
        onFormOpen: noop,
        onFiltersOpen: noop,
        onSelectedCloseClick: noop,
        filters: true
    };

    state = {
        warningShowed: false
    };

    handleSelectedCloseClick = () => {
        this.props.onSelectedCloseClick();
    };

    handleWarningDisagree = () => {
        this.setState({
            warningShowed: false
        });
    };

    handleWarningAgree = () => {
        const ids = this.props.selected.map(category => category.id);

        this.props.onDelete(ids)
            .then(() => {
                this.setState({
                    warningShowed: false
                });
            });
    };

    handleDelete = () => {
        this.setState({
            warningShowed: true
        });
    };

    render () {
        const { classes, selected, headerText, deleteValuesWarningTitle, filters } = this.props;
        const { warningShowed } = this.state;

        return <div>
            <Toolbar
                className={classNames(classes.toolbar, {
                    [classes.highlight]: selected.length > 0
                })}
            >
                <div className={classes.title}>
                    {selected.length > 0 ? (
                        <div className={classes.itemsNumber}>
                            <CloseIcon className={classes.closeIcon} onClick={this.handleSelectedCloseClick}/>
                            <Typography color='inherit' variant='subtitle1'>
                                {selected.length} выбрано
                            </Typography>
                        </div>
                    ) : (
                        <Typography variant='h6' id='tableTitle'>
                            {headerText}
                        </Typography>
                    )}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {selected.length > 0 ? (
                        <Tooltip title='Delete'>
                            <IconButton aria-label='Delete' onClick={this.handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <div className={classes.valuesActions}>
                            { filters && <Tooltip title='Фильтрация'>
                                <IconButton aria-label='Filters' onClick={this.props.onFiltersOpen}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip> }
                            <Tooltip title='Добавление'>
                                <IconButton aria-label='Add' onClick={this.props.onFormOpen()}>
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </Toolbar>
            <Dialog
                open={warningShowed}
                onClose={this.handleWarningDisagree}
            >
                <DialogTitle>{deleteValuesWarningTitle}</DialogTitle>
                <DialogContent className={classes.warningContent}>
                    <List>
                        {
                            selected.map((category, i) => <ListItem key={i}>
                                <ListItemText
                                    primary={category.texts.ru.name}
                                />
                            </ListItem>)
                        }
                    </List>
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
        </div>;
    }
}

export default withStyles(materialStyles)(AdminTableHeader);
