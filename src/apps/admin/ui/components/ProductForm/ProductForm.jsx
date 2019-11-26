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

        const { product } = this.props;
        const ru = pathOr(['texts', 'ru'], '', product);
        const ua = pathOr(['texts', 'ua'], '', product);
        const categoryHidden = this.props.activeCategory.hidden;

        this.categoriesOptions = this.props.categories.map(category => ({
            value: category.id,
            name: category.texts.ua.name
        }));

        this.initialValues = {
            views: 0,
            categoryId: this.props.activeCategory.id,
            avatar: {
                files: product.avatar ? [product.avatar] : [],
                removedFiles: []
            },
            files: {
                files: product.files ? product.files : [],
                removedFiles: []
            },
            date: product.date,
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            lang: 'ru',
            hidden: (categoryHidden ? false : product.hidden) || false,
            price: product.price,
            ...pick(PRODUCTS_VALUES, product)
        };
        this.id = prop('id', product);
        this.state = {
            lang: 'ru',
            errorText: '',
            removedFiles: [],
            categoryHidden
        };
    }

    getProductPayload = (
        {
            ru_name: ruName,
            ua_name: uaName,
            hidden,
            price,
            categoryId,
            id
        }) => {
        return {
            texts: {
                ru: {
                    name: ruName
                },
                ua: {
                    name: uaName
                }
            },
            hidden,
            price,
            categoryId,
            id
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
            // .then(product => {
            //     const { files } = values.files;
            //     if (files[0].content) {
            //         const formData = new FormData();
            //
            //         formData.append(`product-${product.id}-file`, files[0].content);
            //
            //         return updateProductFiles(formData, product.id);
            //     }
            // })
            .then(() => {
                onDone();
            });
    };

    handleChange = (values, changes) => {
        if ('lang' in changes) {
            this.setState({
                lang: changes.lang
            });

            this.categoriesOptions = this.props.categories.map(category => ({
                value: category.id,
                name: category.texts[changes.lang].name
            }));
        }

        if ('categoryId' in changes) {
            const activeCategory = this.props.categories.find(category => category.id === changes.categoryId);

            this.setState({
                categoryHidden: activeCategory.hidden
            });
        }
    };

    render () {
        const { lang, categoryHidden } = this.state;

        return <Form
            initialValues={this.initialValues}
            lang={lang}
            schema={getSchema({
                data: {
                    title: this.id ? 'Редактирование товара' : 'Добавление товара',
                    categoriesOptions: this.categoriesOptions,
                    categoryHidden
                },
                settings: { lang }
            })}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
        />;
    }
}

export default connect(null, mapDispatchToProps)(ProductForm);
