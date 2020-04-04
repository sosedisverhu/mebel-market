import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getSchema from './SubCategoryFormSchema';
import saveSubCategory from '../../../services/saveSubCategory';
import editSubCategory from '../../../services/editSubCategory';

const SUB_CATEGORIES_VALUES = ['name', 'hidden', 'positionIndex'];

const mapDispatchToProps = (dispatch) => ({
    saveSubCategory: payload => dispatch(saveSubCategory(payload)),
    editSubCategory: payload => dispatch(editSubCategory(payload))
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

class SubCategoryForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        saveSubCategory: PropTypes.func.isRequired,
        editSubCategory: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        subCategory: PropTypes.object,
        categories: PropTypes.array,
        subCategories: PropTypes.array,
        activeCategory: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        subCategory: {},
        categories: [],
        subCategories: [],
        activeCategory: {}
    };

    constructor (...args) {
        super(...args);

        const { subCategory, activeCategory } = this.props;
        const ru = pathOr(['texts', 'ru'], '', subCategory);
        const ua = pathOr(['texts', 'ua'], '', subCategory);
        const categoryHidden = activeCategory.hidden;

        this.initialValues = {
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            ru_seoTitle: ru.seoTitle || '',
            ua_seoTitle: ua.seoTitle || '',
            ru_seoDescription: ru.seoDescription || '',
            ua_seoDescription: ua.seoDescription || '',
            ru_seoKeywords: { words: ru.seoKeywords && ru.seoKeywords.split(', ') || [], input: '' },
            ua_seoKeywords: { words: ua.seoKeywords && ua.seoKeywords.split(', ') || [], input: '' },
            categoryId: activeCategory.id,
            hidden: (categoryHidden ? false : subCategory.hidden) || false,
            alias: subCategory.alias,
            sizeFilter: subCategory.sizeFilter,
            colorFilter: subCategory.colorFilter,
            lang: 'ru',
            ...pick(SUB_CATEGORIES_VALUES, subCategory),
            ua_filters: pathOr(['filters', 'ua'], [], subCategory),
            ru_filters: pathOr(['filters', 'ru'], [], subCategory)
        };
        this.id = prop('id', subCategory);
        this.state = {
            lang: 'ru',
            activeCategory: activeCategory,
            categoryHidden,
            errorText: ''
        };
    }

    getSubCategoryPayload = (
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
            categoryId,
            positionIndex,
            id,
            alias,
            sizeFilter,
            colorFilter,
            ua_filters: uaFilters,
            ru_filters: ruFilters
        }) => {
        return {
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
            filters: {
                ua: uaFilters,
                ru: ruFilters
            },
            hidden,
            categoryId,
            positionIndex,
            id,
            alias,
            sizeFilter,
            colorFilter
        };
    };

    checkOptions = filters => {
        return filters.map(filter => {
            const filteredOptions = filter.options.filter(option => option.name);
            return { ...filter, options: filteredOptions };
        });
    };

    handleSubmit = values => {
        const { editSubCategory, saveSubCategory, onDone, subCategories } = this.props;
        const subCategoryPayload = this.getSubCategoryPayload(values);
        const { filters } = subCategoryPayload;

        filters.ua = this.checkOptions(filters.ua);
        filters.ru = this.checkOptions(filters.ru);

        (this.id
            ? editSubCategory({ ...subCategoryPayload, id: this.id })
            : saveSubCategory({
                ...subCategoryPayload,
                positionIndex: subCategoryPayload.positionIndex || subCategories.length
            }))
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    this.setState({
                        errorText: 'Введите уникальные алиас для подкатегории'
                    });
                } else {
                    this.setState({
                        errorText: 'Что-то пошло не так. Перезагрузите страницы и попробуйте снова'
                    });
                }
            });
    };

    handleChange = (values, changes) => {
        switch (Object.keys(changes)[0]) {
        case 'lang':
            this.setState({
                lang: changes.lang
            });
            break;

        case 'categoryId':
            const activeCategory = this.props.categories.find(category => category.id === changes.categoryId);
            const { lang } = this.state;

            this.setState({
                categoryHidden: activeCategory.hidden
            });

            values.subCategoryId = activeCategory.texts[lang].subCategory[0].id;
            break;
        }
    };

    handleHideFailMessage = () => {
        this.setState({
            errorText: ''
        });
    };

    render () {
        const { classes } = this.props;
        const { categoryHidden, errorText } = this.state;

        return <div>
            <Form
                initialValues={this.initialValues}
                langs={['ru', 'ua']}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование подкатегории' : 'Добавление подкатегории',
                        categoryHidden
                    }
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
                            <ErrorIcon className={classNames(classes.icon, classes.iconVariant)}/>
                            {errorText}
                        </span>
                    }
                />
            </Snackbar>
        </div>;
    }
}

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(SubCategoryForm));
