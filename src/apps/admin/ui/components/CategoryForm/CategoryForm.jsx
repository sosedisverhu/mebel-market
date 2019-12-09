import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getSchema from './CategoryFormSchema';
import saveProductsCategory from '../../../services/saveCategory';
import editProductsCategory from '../../../services/editCategory';
import classNames from 'classnames';

const CATEGORIES_VALUES = ['name', 'id', 'hidden', 'positionIndex'];

const mapDispatchToProps = (dispatch) => ({
    saveProductsCategory: payload => dispatch(saveProductsCategory(payload)),
    editProductsCategory: payload => dispatch(editProductsCategory(payload))
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

class CategoryForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        saveProductsCategory: PropTypes.func.isRequired,
        editProductsCategory: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        category: PropTypes.object,
        categories: PropTypes.array
    };

    static defaultProps = {
        onDone: noop,
        category: {},
        categories: []
    };

    constructor (...args) {
        super(...args);

        const { category } = this.props;
        const ru = pathOr(['texts', 'ru'], {}, category);
        const ua = pathOr(['texts', 'ua'], {}, category);

        this.initialValues = {
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            ru_seoTitle: ru.seoTitle || '',
            ua_seoTitle: ua.seoTitle || '',
            ru_seoDescription: ru.seoDescription || '',
            ua_seoDescription: ua.seoDescription || '',
            ru_seoKeywords: { words: ru.seoKeywords && ru.seoKeywords.split(', ') || [], input: '' },
            ua_seoKeywords: { words: ua.seoKeywords && ua.seoKeywords.split(', ') || [], input: '' },
            alias: category.alias || '',
            hidden: category.hidden || false,
            ...pick(CATEGORIES_VALUES, category)
        };

        this.state = {
            id: prop('id', category),
            lang: 'ua',
            errorText: ''
        };
    }

    getCategoryPayload = (
        {
            ru_name: ruName,
            ua_name: uaName,
            ua_seoTitle: uaSeoTitle,
            ru_seoTitle: ruSeoTitle,
            ua_seoDescription: uaSeoDescription,
            ru_seoDescription: ruSeoDescription,
            ua_seoKeywords: uaSeoKeywords,
            ru_seoKeywords: ruSeoKeywords,
            hidden,
            positionIndex,
            id,
            alias
        }) => {
        return {
            hidden,
            positionIndex,
            texts: {
                ru: {
                    name: ruName,
                    seoTitle: ruSeoTitle,
                    seoDescription: ruSeoDescription,
                    seoKeywords: ruSeoKeywords.words.join(', ')
                },
                ua: {
                    name: uaName,
                    seoTitle: uaSeoTitle,
                    seoDescription: uaSeoDescription,
                    seoKeywords: uaSeoKeywords.words.join(', ')
                }
            },
            id,
            alias
        };
    };

    handleChange = (values, changes) => {
        if ('lang' in changes) {
            this.setState({
                lang: values.lang
            });
        }
    };

    handleSubmit = values => {
        event.preventDefault();

        const { id } = this.state;
        const { editProductsCategory, saveProductsCategory, categories, onDone } = this.props;
        const categoryPayload = this.getCategoryPayload(values);

        (
            id
                ? editProductsCategory({ ...categoryPayload, id })
                : saveProductsCategory({
                    ...categoryPayload,
                    positionIndex: categoryPayload.positionIndex || categories.length
                })
        )
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    this.setState({
                        errorText: 'Введите уникальные алиас'
                    });
                } else {
                    this.setState({
                        errorText: 'Что-то пошло не так. Перезагрузите страницы и попробуйте снова'
                    });
                }
            });
    };

    handleHideFailMessage = () => {
        this.setState({
            errorText: ''
        });
    };

    render () {
        const { classes } = this.props;
        const { id, errorText } = this.state;

        return <div>
            <Form
                initialValues={this.initialValues}
                langs={['ru', 'ua']}
                schema={getSchema({
                    data: { title: id ? 'Редактирование категории' : 'Добавление категории' }
                })}
                onChange={this.handleChange}
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

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(CategoryForm));
