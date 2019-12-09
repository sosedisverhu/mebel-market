import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import getSchema from './PartnerFormSchema';
import savePartner from '../../../services/savePartner';
import editPartner from '../../../services/editPartner';

import Form from '../Form/Form';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

const PARTNERS_VALUES = ['name', 'hidden'];

const mapDispatchToProps = (dispatch) => ({
    savePartner: payload => dispatch(savePartner(payload)),
    editPartner: payload => dispatch(editPartner(payload))
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

class PartnerForm extends Component {
    static propTypes = {
        savePartner: PropTypes.func.isRequired,
        editPartner: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
        onDone: PropTypes.func,
        partner: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        partner: {}
    };

    constructor (...args) {
        super(...args);

        const { partner } = this.props;
        const ru = pathOr(['texts', 'ru'], '', partner);
        const ua = pathOr(['texts', 'ua'], '', partner);

        this.initialValues = {
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            ru_content: ru.content || '',
            ua_content: ua.content || '',
            hidden: partner.hidden || false,
            ...pick(PARTNERS_VALUES, partner)
        };
        this.id = prop('id', partner);
        this.state = {};
    }

    getPartnerPayload = (
        {
            ru_name: ruName,
            ua_name: uaName,
            ru_content: ruContent,
            ua_content: uaContent,
            hidden,
            id
        }) => {
        return {
            texts: {
                ru: {
                    name: ruName,
                    content: ruContent
                },
                ua: {
                    name: uaName,
                    content: uaContent
                }
            },
            hidden,
            id
        };
    };

    handleSubmit = values => {
        const partnerPayload = this.getPartnerPayload(values);
        const { editPartner, savePartner, onDone } = this.props;

        (this.id ? editPartner({ ...partnerPayload, id: this.id }) : savePartner(partnerPayload))
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
                langs={['ru', 'ua']}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование партнёра' : 'Добавление партнёра'
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

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(PartnerForm));
