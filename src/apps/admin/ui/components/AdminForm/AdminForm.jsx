import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import getSchema from './AdminFormSchema';
import saveAdmin from '../../../services/saveAdmin';
import editAdmin from '../../../services/editAdmin';

import Form from '../Form/Form';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

const ADMIN_VALUES = ['login', 'email', 'password', 'sections'];

const mapDispatchToProps = (dispatch) => ({
    saveAdmin: payload => dispatch(saveAdmin(payload)),
    editAdmin: payload => dispatch(editAdmin(payload))
});

const materialStyles = theme => ({
    error: {
        backgroundColor: theme.palette.error.dark
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
    margin: {
        margin: theme.spacing.unit
    }
});

class AdminForm extends Component {
    static propTypes = {
        saveAdmin: PropTypes.func.isRequired,
        editAdmin: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
        onDone: PropTypes.func,
        admin: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        admin: {}
    };

    constructor (...args) {
        super(...args);

        const { admin } = this.props;

        this.initialValues = {
            ...pick(ADMIN_VALUES, admin)
        };
        this.id = prop('id', admin);
        this.state = {};
    }

    getAdminPayload = (
        {
            login,
            email,
            password,
            sections,
            id
        }) => {
        return {
            login,
            email,
            password,
            sections,
            id
        };
    };

    handleSubmit = values => {
        const adminPayload = this.getAdminPayload(values);
        const { editAdmin, saveAdmin, onDone } = this.props;

        (this.id ? editAdmin({ ...adminPayload, id: this.id }) : saveAdmin(adminPayload))
            .then(() => {
                onDone();
            })
            .catch(error => {
                this.setState({
                    errorText: 'Что-то пошло не так. Перезагрузите страницы и попробуйте снова'
                });
            });
    };

    handleHideFailMessage = () => {
        this.setState({
            errorText: ''
        });
    };

    render () {
        const { classes } = this.props;
        const { errorText } = this.state;

        return <div>
            <Form
                initialValues={this.initialValues}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование админа' : 'Добавление админа'
                    }
                })}
                onSubmit={this.handleSubmit}
            />
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                onClose={this.handleHideFailMessage}
                open={!!errorText}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={classNames(classes.error, classes.margin)}
                    message={
                        <span id='client-snackbar' className={classes.message}>
                            <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
                            { errorText }
                        </span>
                    }
                />
            </Snackbar>
        </div>;
    }
}

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(AdminForm));
