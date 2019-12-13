import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';
import reduceObj from '@tinkoff/utils/object/reduce';
import findIndex from '@tinkoff/utils/array/findIndex';
import isObject from '@tinkoff/utils/is/plainObject';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getSchema from './ProductFormSchema';
import saveProduct from '../../../services/saveProduct';
import editProduct from '../../../services/editProduct';
import updateProductFiles from '../../../services/updateProductFiles';
import updateProductAvatar from '../../../services/updateProductAvatar';

const PRODUCTS_VALUES = ['name', 'hidden'];
const FILTER_NAME_REGEX = /filter-/g;

const mapDispatchToProps = (dispatch) => ({
    saveProduct: payload => dispatch(saveProduct(payload)),
    editProduct: payload => dispatch(editProduct(payload)),
    updateProductFiles: (...payload) => dispatch(updateProductFiles(...payload)),
    updateProductAvatar: (...payload) => dispatch(updateProductAvatar(...payload))
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

class ProductForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        saveProduct: PropTypes.func.isRequired,
        editProduct: PropTypes.func.isRequired,
        updateProductFiles: PropTypes.func.isRequired,
        updateProductAvatar: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        product: PropTypes.object,
        categories: PropTypes.array,
        subCategories: PropTypes.array,
        activeCategory: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        product: {},
        categories: [],
        subCategories: [],
        activeCategory: {}
    };

    constructor (...args) {
        super(...args);

        const defaultLang = this.state ? this.state.lang : 'ru';
        const { product, categories, activeCategory, subCategories } = this.props;
        const ru = pathOr(['texts', 'ru'], '', product);
        const ua = pathOr(['texts', 'ua'], '', product);
        const categoryHidden = activeCategory.hidden;

        this.categoriesOptions = categories.map(category => ({
            value: category.id,
            name: category.texts[defaultLang].name
        }));

        this.subCategoriesOptions = subCategories.map(subCategory => ({
            value: subCategory.id,
            name: subCategory.texts[defaultLang].name
        }));

        this.initialValues = {
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            ru_description: ru.description || '',
            ua_description: ua.description || '',
            ru_seoTitle: ru.seoTitle || '',
            ua_seoTitle: ua.seoTitle || '',
            ru_seoDescription: ru.seoDescription || '',
            ua_seoDescription: ua.seoDescription || '',
            ru_seoKeywords: { words: ru.seoKeywords && ru.seoKeywords.split(', ') || [], input: '' },
            ua_seoKeywords: { words: ua.seoKeywords && ua.seoKeywords.split(', ') || [], input: '' },
            ru_characteristics: pathOr(['characteristics', 'ru', 'characteristics'], [], product),
            ua_characteristics: pathOr(['characteristics', 'ua', 'characteristics'], [], product),
            warranty: product.warranty || '',
            sizes: product.sizes || [],
            avatar: { files: product.avatar ? [product.avatar] : [] },
            files: { files: product.files ? product.files : [] },
            hidden: (categoryHidden ? false : product.hidden) || false,
            date: product.date,
            discountPrice: product.discountPrice,
            price: product.price,
            discount: product.discount,
            categoryId: activeCategory.id,
            subCategoryId: product.subCategoryId ? product.subCategoryId : subCategories[0].id,
            alias: product.alias,
            lang: 'ru',
            filters: [],
            ...pick(PRODUCTS_VALUES, product),
            ...(product.filters || [])
                .reduce((filters, filter) => ({ ...filters, [`filter-${filter.id}`]: isObject(filter.value.ru) ? filter.value.ru.name : filter.value.ru }), {})
        };
        console.log('this.initialValues', this.initialValues);
        this.id = prop('id', product);

        const filtersCategory = pathOr(['filters', 'ru'], [], activeCategory);        
        const activeSubCategory = subCategories.find(subCategory => subCategory.id === this.initialValues.subCategoryId);
        const filtersSubCategory = pathOr(['filters', 'ru'], [], activeSubCategory);

        this.state = {
            lang: 'ru',
            activeCategory,
            categoryHidden,
            errorText: '',
            filters: [...filtersCategory, ...filtersSubCategory]
        };
    }

    getFiltersArray = (values, filtersObj) => {
        const filters = reduceObj((filters, filterValue, filterName) => {
            if (FILTER_NAME_REGEX.test(filterName)) {
                const id = filterName.replace(FILTER_NAME_REGEX, '');
                const filterIndex = findIndex(filter => filter.id === id, this.state.filters);
                console.log('filterIndex', filterIndex);
                if (filterIndex === -1) {
                    return filters;
                }
                const filterType = this.state.filters[filterIndex].type;
                let value;

                if (filterType === 'range') {
                    value = {
                        ua: +filterValue,
                        ru: +filterValue
                    };
                } else {
                    const filterValueIndex = findIndex((option) => option.name === filterValue, this.state.filters[filterIndex].options);
                    console.log('filterName', filterName);

                    value = reduceObj((resultFilterValue, filtersArr, lang) => {
                        resultFilterValue[lang] = filtersArr[filterIndex].options[filterValueIndex].name;

                        return resultFilterValue;
                    }, {}, filtersObj);
                }

                return [
                    ...filters,
                    {
                        id: filterName.replace(FILTER_NAME_REGEX, ''),
                        value
                    }
                ];
            }

            return filters;
        }, [], values);

        return filters;
    }

    getProductPayload = (values) => {
        const {
            ru_name: ruName,
            ua_name: uaName,
            ru_description: ruDescription,
            ua_description: uaDescription,
            ua_seoTitle: uaSeoTitle,
            ru_seoTitle: ruSeoTitle,
            ua_seoDescription: uaSeoDescription,
            ru_seoDescription: ruSeoDescription,
            ua_seoKeywords: uaSeoKeywords,
            ru_seoKeywords: ruSeoKeywords,
            ru_characteristics: ruCharacteristics,
            ua_characteristics: uaCharacteristics,
            warranty,
            sizes,
            hidden,
            discountPrice,
            price,
            discount,
            categoryId,
            subCategoryId,
            id,
            alias
        } = values;

        const activeCategory = this.props.categories.find(category => category.id === categoryId);
        const activeSubCategory = this.props.subCategories.find(subCategory => subCategory.id === subCategoryId);
        
        console.log('activeCategory.filters -----', activeCategory.filters);
        console.log('activeSubCategory.filters -----', activeSubCategory.filters);        

        const allCategoriesFiltersUA = [...activeCategory.filters.ua, ...activeSubCategory.filters.ua];
        const allCategoriesFiltersRU = [...activeCategory.filters.ru, ...activeSubCategory.filters.ru];
        const allCategoriesFiltersAll = {
            ua: allCategoriesFiltersUA,
            ru: allCategoriesFiltersRU
        }
        
        console.log('allCategoriesFiltersAll', allCategoriesFiltersAll); 
        console.log('values -----', values);
        const filters = reduceObj((filters, filterValue, filterName) => {
            if (FILTER_NAME_REGEX.test(filterName)) {
                const id = filterName.replace(FILTER_NAME_REGEX, '');
                const filterIndex = findIndex(filter => filter.id === id, this.state.filters);
                if (filterIndex === -1) {
                    return filters;
                }
                const filterType = this.state.filters[filterIndex].type;
                let value;

                if (filterType === 'range') {
                    value = {
                        ua: +filterValue,
                        ru: +filterValue
                    };
                } else {
                    const filterValueIndex = findIndex((option) => option.name === filterValue, this.state.filters[filterIndex].options);

                    value = reduceObj((resultFilterValue, filtersArr, lang) => {
                        resultFilterValue[lang] = filtersArr[filterIndex].options[filterValueIndex].name;

                        return resultFilterValue;
                    }, {}, allCategoriesFiltersAll);
                }

                return [
                    ...filters,
                    {
                        id: filterName.replace(FILTER_NAME_REGEX, ''),
                        value
                    }
                ];
            }

            return filters;
        }, [], values);
        

        // const filtersCategory = this.getFiltersArray(values, activeCategory.filters);
        // const filtersSubCategory = this.getFiltersArray(values, activeSubCategory.filters);

        console.log('filters +++++++', filters);

        return {
            texts: {
                ru: {
                    name: ruName,
                    description: ruDescription,
                    seoTitle: ruSeoTitle,
                    seoDescription: ruSeoDescription,
                    seoKeywords: ruSeoKeywords.words.join(', ')
                },
                ua: {
                    name: uaName,
                    description: uaDescription,
                    seoTitle: uaSeoTitle,
                    seoDescription: uaSeoDescription,
                    seoKeywords: uaSeoKeywords.words.join(', ')
                }
            },
            characteristics: {
                ru: {
                    characteristics: ruCharacteristics
                },
                ua: {
                    characteristics: uaCharacteristics
                }
            },
            warranty,
            sizes,
            hidden,
            discountPrice,
            discount,
            price,
            categoryId,
            subCategoryId,
            id,
            alias,
            filters
        };
    };

    handleSubmit = values => {
        const productPayload = this.getProductPayload(values);
        const { editProduct, saveProduct, updateProductAvatar, updateProductFiles, onDone } = this.props;

        (this.id ? editProduct({ ...productPayload, id: this.id }) : saveProduct(productPayload))
            .then(product => {
                console.log('product', product);
                const { files } = values.avatar;
                if (files[0].content) {
                    const formData = new FormData();

                    formData.append(`product-${product.id}-avatar`, files[0].content);

                    return updateProductAvatar(formData, product.id);
                }
            })
            .then(product => {
                const { files } = values.files;
                const formData = new FormData();
                const removedFiles = [];
                const oldFiles = [];
                const id = pathOr(['id'], this.id, product);

                files.forEach((file, i) => {
                    if (file.content) {
                        formData.append(`product-${id}-file-${i}`, file.content);
                    } else {
                        oldFiles.push({
                            path: file.path,
                            index: i
                        });
                    }
                });
                formData.append('removedFiles', JSON.stringify(removedFiles));
                formData.append('oldFiles', JSON.stringify(oldFiles));
                return updateProductFiles(formData, id);
            })
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    this.setState({
                        errorText: 'Введите уникальные алиас для товара'
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
                categoryHidden: activeCategory.hidden,
                filters: pathOr(['filters', 'ru'], [], activeCategory)
            });

            console.log('activeCategory', activeCategory);
            console.log('activeCategory.texts[lang]', activeCategory.texts[lang]);

            this.subCategoriesOptions = activeCategory.texts[lang].subCategory.map(category => ({
                value: category.id,
                name: category.name
            }));

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
        const { categoryHidden, errorText, filters } = this.state;

        console.log('filters', filters);
        console.log('subCategoriesOptions', this.subCategoriesOptions);

        return <div>
            <Form
                initialValues={this.initialValues}
                langs={['ru', 'ua']}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование товара' : 'Добавление товара',
                        categoriesOptions: this.categoriesOptions,
                        subCategoriesOptions: this.subCategoriesOptions,
                        categoryHidden,
                        filters
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
                            <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
                            {errorText}
                        </span>
                    }
                />
            </Snackbar>
        </div>;
    }
}

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(ProductForm));
