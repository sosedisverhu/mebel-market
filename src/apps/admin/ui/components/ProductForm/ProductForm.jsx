import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getSchema from './ProductFormSchema';
import saveProduct from '../../../services/saveProduct';
import editProduct from '../../../services/editProduct';
import updateProductFiles from '../../../services/updateProductFiles';
import updateProductAvatar from '../../../services/updateProductAvatar';

import Form from '../Form/Form';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

const PRODUCTS_VALUES = ['name', 'hidden'];

const mapDispatchToProps = (dispatch) => ({
    saveProduct: payload => dispatch(saveProduct(payload)),
    editProduct: payload => dispatch(editProduct(payload)),
    updateProductFiles: (...payload) => dispatch(updateProductFiles(...payload)),
    updateProductAvatar: (...payload) => dispatch(updateProductAvatar(...payload))
});

class ProductForm extends Component {
    static propTypes = {
        saveProduct: PropTypes.func.isRequired,
        editProduct: PropTypes.func.isRequired,
        updateProductFiles: PropTypes.func.isRequired,
        updateProductAvatar: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        product: PropTypes.object,
        categories: PropTypes.array,
        activeCategory: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        product: {},
        categories: [],
        activeCategory: {}
    };

    constructor (...args) {
        super(...args);

        const defaultLang = this.state ? this.state.lang : 'ru';
        const { product, categories, activeCategory } = this.props;
        const ru = pathOr(['texts', 'ru'], '', product);
        const ua = pathOr(['texts', 'ua'], '', product);
        const categoryHidden = activeCategory.hidden;

        this.categoriesOptions = categories.map(category => ({
            value: category.id,
            name: category.texts[defaultLang].name
        }));

        this.subCategoriesOptions = activeCategory.texts[defaultLang].subCategory.map(category => ({
            value: category.id,
            name: category.name
        }));

        this.initialValues = {
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            ru_description: ru.description || '',
            ua_description: ua.description || '',
            ru_characteristics: pathOr(['characteristics', 'ru', 'characteristics'], [], product),
            ua_characteristics: pathOr(['characteristics', 'ua', 'characteristics'], [], product),
            warranty: product.warranty || '',
            sizes: product.sizes || [],
            avatar: { files: product.avatar ? [product.avatar] : [] },
            files: { files: product.files ? product.files : [] },
            hidden: (categoryHidden ? false : product.hidden) || false,
            date: product.date,
            price: product.price,
            discount: product.discount,
            categoryId: activeCategory.id,
            subCategoryId: product.subCategoryId ? product.subCategoryId : activeCategory.texts.ru.subCategory[0].id,
            alias: product.alias,
            lang: 'ru',
            ...pick(PRODUCTS_VALUES, product)
        };
        this.id = prop('id', product);
        this.state = {
            lang: 'ru',
            activeCategory: activeCategory,
            categoryHidden
        };
    }

    getProductPayload = (
        {
            ru_name: ruName,
            ua_name: uaName,
            ru_description: ruDescription,
            ua_description: uaDescription,
            ru_characteristics: ruCharacteristics,
            ua_characteristics: uaCharacteristics,
            maxWeight,
            warranty,
            sizes,
            hidden,
            price,
            discount,
            categoryId,
            subCategoryId,
            id,
            alias
        }) => {
        return {
            texts: {
                ru: {
                    name: ruName,
                    description: ruDescription
                },
                ua: {
                    name: uaName,
                    description: uaDescription
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
            price,
            discount,
            categoryId,
            subCategoryId,
            id,
            alias
        };
    };

    handleSubmit = values => {
        event.preventDefault();

        const productPayload = this.getProductPayload(values);
        const { editProduct, saveProduct, updateProductAvatar, updateProductFiles, onDone } = this.props;

        (this.id ? editProduct({ ...productPayload, id: this.id }) : saveProduct(productPayload))
            .then(product => {
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

                files.forEach((file, i) => {
                    if (file.content) {
                        formData.append(`product-${product.id}-file-${i}`, file.content);
                    } else {
                        oldFiles.push({
                            path: file.path,
                            index: i
                        });
                    }
                });
                formData.append('removedFiles', JSON.stringify(removedFiles));
                formData.append('oldFiles', JSON.stringify(oldFiles));
                return updateProductFiles(formData, product.id);
            })
            .then(() => {
                onDone();
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

            this.subCategoriesOptions = activeCategory.texts[lang].subCategory.map(category => ({
                value: category.id,
                name: category.name
            }));

            values.subCategoryId = activeCategory.texts[lang].subCategory[0].id;
            break;
        }
    };

    render () {
        const { categoryHidden } = this.state;

        return <Form
            initialValues={this.initialValues}
            langs={['ru', 'ua']}
            schema={getSchema({
                data: {
                    title: this.id ? 'Редактирование товара' : 'Добавление товара',
                    categoriesOptions: this.categoriesOptions,
                    subCategoriesOptions: this.subCategoriesOptions,
                    categoryHidden
                }
            })}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
        />;
    }
}

export default connect(null, mapDispatchToProps)(ProductForm);
