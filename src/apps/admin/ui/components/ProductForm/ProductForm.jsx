import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';
import reduceObj from '@tinkoff/utils/object/reduce';
import findIndex from '@tinkoff/utils/array/findIndex';

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
import updateProductColor from '../../../services/updateProductColor';

const PRODUCTS_VALUES = ['name', 'hidden'];
const CATEGORY_FILTER_NAME_REGEX = /categoryFilter-/g;
const SUB_CATEGORY_FILTER_NAME_REGEX = /subCategoryFilter-/g;

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
        updateProductColor: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        product: PropTypes.object,
        categories: PropTypes.array,
        subCategories: PropTypes.array,
        allSubCategories: PropTypes.array,
        activeCategory: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        product: {},
        categories: [],
        subCategories: [],
        allSubCategories: [],
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
            ru_shortDescription: ru.shortDescription || '',
            ua_shortDescription: ua.shortDescription || '',
            ru_seoTitle: ru.seoTitle || '',
            ua_seoTitle: ua.seoTitle || '',
            ru_seoDescription: ru.seoDescription || '',
            ua_seoDescription: ua.seoDescription || '',
            ru_seoKeywords: { words: ru.seoKeywords && ru.seoKeywords.split(', ') || [], input: '' },
            ua_seoKeywords: { words: ua.seoKeywords && ua.seoKeywords.split(', ') || [], input: '' },
            ru_characteristics: pathOr(['characteristics', 'ru', 'characteristics'], [], product),
            ua_characteristics: pathOr(['characteristics', 'ua', 'characteristics'], [], product),
            ru_sizes: pathOr(['sizes', 'ru'], '', product) || [],
            ua_sizes: pathOr(['sizes', 'ua'], '', product) || [],
            avatar: { files: product.avatar ? [product.avatar] : [] },
            files: { files: product.files ? product.files : [] },
            hidden: (categoryHidden ? false : product.hidden) || false,
            date: product.date,
            minDiscountPrice: product.minDiscountPrice,
            minPrice: product.minPrice,
            minDiscount: product.minDiscount,
            warranty: product.warranty,
            categoryId: activeCategory.id,
            subCategoryId: product.subCategoryId ? product.subCategoryId : subCategories[0].id,
            alias: product.alias,
            lang: 'ru',
            ...(product.categoryFilters || [])
                .reduce((categoryFilters, categoryFilter) => ({
                    ...categoryFilters,
                    [`categoryFilter-${categoryFilter.id}`]: categoryFilter.value
                }), {}),
            ...(product.subCategoryFilters || [])
                .reduce((subCategoryFilters, subCategoryFilter) => ({
                    ...subCategoryFilters,
                    [`subCategoryFilter-${subCategoryFilter.id}`]: subCategoryFilter.value
                }), {}),
            ...pick(PRODUCTS_VALUES, product)
        };
        this.id = prop('id', product);

        const categoryFilters = pathOr(['filters', 'ru'], [], activeCategory);
        const subCategoryFilters = pathOr(['filters', 'ru'], [], subCategories.find(subCategory => subCategory.id === this.initialValues.subCategoryId));

        this.state = {
            lang: 'ru',
            categoryHidden,
            errorText: '',
            categoryFilters,
            subCategoryFilters
        };
    }

    getProductPayload = values => {
        const {
            ru_name: ruName,
            ua_name: uaName,
            ru_description: ruDescription,
            ua_description: uaDescription,
            ru_shortDescription: ruShortDescription,
            ua_shortDescription: uaShortDescription,
            ua_seoTitle: uaSeoTitle,
            ru_seoTitle: ruSeoTitle,
            ua_seoDescription: uaSeoDescription,
            ru_seoDescription: ruSeoDescription,
            ua_seoKeywords: uaSeoKeywords,
            ru_seoKeywords: ruSeoKeywords,
            ru_characteristics: ruCharacteristics,
            ua_characteristics: uaCharacteristics,
            ru_sizes: ruSizes,
            ua_sizes: uaSizes,
            hidden,
            warranty,
            categoryId,
            subCategoryId,
            id,
            alias
        } = values;

        const categoryFilters = reduceObj((categoryFilters, filterValue, filterName) => {
            if (CATEGORY_FILTER_NAME_REGEX.test(filterName)) {
                const id = filterName.replace(CATEGORY_FILTER_NAME_REGEX, '');
                const filterIndex = findIndex(filter => filter.id === id, this.state.categoryFilters);
                if (filterIndex === -1) {
                    return categoryFilters;
                }
                const filterType = this.state.categoryFilters[filterIndex].type;
                let value;

                if (filterType === 'range') {
                    value = filterValue;
                } else {
                    const filterValueIndex = findIndex((option) => option.id === filterValue, this.state.categoryFilters[filterIndex].options);

                    if (filterValueIndex === -1) return categoryFilters;

                    value = this.state.categoryFilters[filterIndex].options[filterValueIndex].id;
                }

                return [
                    ...categoryFilters,
                    {
                        id: filterName.replace(CATEGORY_FILTER_NAME_REGEX, ''),
                        value
                    }
                ];
            }
            return categoryFilters;
        }, [], values);

        const subCategoryFilters = reduceObj((subCategoryFilters, filterValue, filterName) => {
            if (SUB_CATEGORY_FILTER_NAME_REGEX.test(filterName)) {
                const id = filterName.replace(SUB_CATEGORY_FILTER_NAME_REGEX, '');
                const filterIndex = findIndex(filter => filter.id === id, this.state.subCategoryFilters);

                if (filterIndex === -1) {
                    return subCategoryFilters;
                }
                const filterType = this.state.subCategoryFilters[filterIndex].type;
                let value;

                if (filterType === 'range') {
                    value = filterValue;
                } else {
                    const filterValueIndex = findIndex(option => option.id === filterValue, this.state.subCategoryFilters[filterIndex].options);

                    if (filterValueIndex === -1) {
                        return subCategoryFilters;
                    }

                    value = this.state.subCategoryFilters[filterIndex].options[filterValueIndex].id;
                }

                return [
                    ...subCategoryFilters,
                    {
                        id: filterName.replace(SUB_CATEGORY_FILTER_NAME_REGEX, ''),
                        value
                    }
                ];
            }

            return subCategoryFilters;
        }, [], values);

        const sizes = {
            ru: ruSizes.map(size => ({
                name: size.name,
                id: size.id,
                colors: size.colors.map(color => ({
                    id: color.id,
                    name: color.name,
                    article: color.article,
                    price: +color.price,
                    discountPrice: +color.discountPrice,
                    discount: +color.discount,
                    file: color.file,
                    action: color.action
                })),
                features: (size.features || []).map(feature => ({
                    id: feature.id,
                    name: feature.name,
                    value: +feature.value
                }))
            })),
            ua: uaSizes.map(size => ({
                name: size.name,
                id: size.id,
                colors: size.colors.map(color => ({
                    id: color.id,
                    name: color.name,
                    article: color.article,
                    price: +color.price,
                    discountPrice: +color.discountPrice,
                    discount: +color.discount,
                    file: color.file,
                    action: color.action
                })),
                features: (size.features || []).map(feature => ({
                    id: feature.id,
                    name: feature.name,
                    value: +feature.value
                }))
            }))
        };

        return {
            texts: {
                ru: {
                    name: ruName,
                    description: ruDescription,
                    shortDescription: ruShortDescription,
                    seoTitle: ruSeoTitle,
                    seoDescription: ruSeoDescription,
                    seoKeywords: ruSeoKeywords.words.join(', ')
                },
                ua: {
                    name: uaName,
                    description: uaDescription,
                    shortDescription: uaShortDescription,
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
            sizes,
            hidden,
            minDiscountPrice: sizes.ru[0].colors[0].discountPrice,
            minDiscount: sizes.ru[0].colors[0].discount,
            warranty,
            minPrice: sizes.ru[0].colors[0].price,
            categoryId,
            subCategoryId,
            id,
            alias,
            categoryFilters,
            subCategoryFilters
        };
    };

    handleSubmit = values => {
        const productPayload = this.getProductPayload(values);
        const { editProduct, saveProduct, updateProductAvatar, updateProductColor, updateProductFiles, onDone } = this.props;
        const { minDiscountPrice, minPrice } = productPayload;

        productPayload.actualPrice = minDiscountPrice || minPrice;

        (this.id ? editProduct({ ...productPayload, id: this.id }) : saveProduct(productPayload))
            .then(product => {
                const { files } = values.files;
                const formData = new FormData();
                const removedFiles = [];
                const oldFiles = [];

                files.forEach((file, i) => {
                    if (file.content) {
                        formData.append(`product-${product.id}-file-${i}`, file.content);
                    } else {
                        oldFiles.push({
                            path: file.path || file,
                            index: i
                        });
                    }
                });

                formData.append('removedFiles', JSON.stringify(removedFiles));
                formData.append('oldFiles', JSON.stringify(oldFiles));

                return updateProductFiles(formData, product.id);
            })
            .then(product => {
                const { files } = values.avatar;

                if (!files[0].content) return product;

                const formData = new FormData();
                formData.append(`product-${product.id}-avatar`, files[0].content);

                return updateProductAvatar(formData, product.id);
            })
            .then(product => {
                const formData = new FormData();

                values.ru_sizes.forEach(size => {
                    size.colors.forEach(color => {
                        const { files } = color.file;

                        if (files && files[0].content) {
                            formData.append(`color-${size.id}-${color.id}-file`, files[0].content);
                        }
                    });
                });

                return updateProductColor(formData, product.id);
            })
            .then(onDone)
            .catch(error => {
                if (error.code === 'duplication') {
                    this.setState({
                        errorText: 'Введите уникальные алиас и артикул для товара'
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
            const activeSubCategories = this.props.allSubCategories.filter(subCategory => subCategory.categoryId === activeCategory.id);
            const newSubCategoryFilters = activeSubCategories[0].filters.ru;
            const categoryFilters = pathOr(['filters', 'ru'], [], activeCategory);

            this.subCategoriesOptions = activeSubCategories.map(subCategory => ({ value: subCategory.id, name: subCategory.texts.ru.name }));

            this.setState({
                categoryHidden: activeCategory.hidden,
                categoryFilters,
                subCategoryFilters: newSubCategoryFilters
            });

            categoryFilters.map(categoryFilter => {
                values[`categoryFilter-${categoryFilter.id}`] = undefined;
            });

            newSubCategoryFilters.map(subCategoryFilter => {
                values[`subCategoryFilter-${subCategoryFilter.id}`] = undefined;
            });

            values.subCategoryId = this.subCategoriesOptions[0].value;
            break;

        case 'subCategoryId':
            const subCategoryFilters = this.props.allSubCategories.find(subCategory => subCategory.id === changes.subCategoryId).filters.ru;
            this.setState({
                subCategoryFilters
            });

            subCategoryFilters.map(subCategoryFilter => {
                values[`subCategoryFilter-${subCategoryFilter.id}`] = undefined;
            });
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
        const { categoryHidden, errorText, categoryFilters, subCategoryFilters } = this.state;

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
                        categoryFilters,
                        subCategoryFilters
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

const mapDispatchToProps = dispatch => ({
    saveProduct: payload => dispatch(saveProduct(payload)),
    editProduct: payload => dispatch(editProduct(payload)),
    updateProductFiles: (...payload) => dispatch(updateProductFiles(...payload)),
    updateProductAvatar: (...payload) => dispatch(updateProductAvatar(...payload)),
    updateProductColor: (...payload) => dispatch(updateProductColor(...payload))
});

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(ProductForm));
