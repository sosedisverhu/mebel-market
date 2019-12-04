import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getSchema from './ArticleFormSchema';
import saveArticle from '../../../services/saveArticle';
import editArticle from '../../../services/editArticle';

import Form from '../Form/Form';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

const NEWS_VALUES = ['name', 'hidden'];

const mapDispatchToProps = (dispatch) => ({
    saveArticle: payload => dispatch(saveArticle(payload)),
    editArticle: payload => dispatch(editArticle(payload)),
});

class ArticleForm extends Component {
    static propTypes = {
        saveArticle: PropTypes.func.isRequired,
        editArticle: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        article: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        article: {}
    };

    constructor (...args) {
        super(...args);

        const { article } = this.props;
        const ru = pathOr(['texts', 'ru'], '', article);
        const ua = pathOr(['texts', 'ua'], '', article);


        this.initialValues = {
            date: article.date,
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            ru_preview: ru.preview || '',
            ua_preview: ua.preview || '',
            ru_content: ru.content || '',
            ua_content: ua.content || '',
            lang: 'ru',
            hidden: article.hidden || false,
            alias: article.alias,
            ...pick(NEWS_VALUES, article)
        };
        this.id = prop('id', article);
        this.state = {
            lang: 'ru'
        };
    }

    getArticlePayload = (
        {
            ru_name: ruName,
            ua_name: uaName,
            ru_preview: ruPreview,
            ua_preview: uaPreview,
            ru_content: ruContent,
            ua_content: uaContent,
            hidden,
            id,
            alias
        }) => {
        return {
            texts: {
                ru: {
                    name: ruName,
                    preview: ruPreview,
                    content: ruContent
                },
                ua: {
                    name: uaName,
                    preview: uaPreview,
                    content: uaContent
                }
            },
            hidden,
            id,
            alias
        };
    };

    handleSubmit = values => {
        event.preventDefault();

        const articlePayload = this.getArticlePayload(values);
        const { editArticle, saveArticle, onDone } = this.props;

        (this.id ? editArticle({ ...articlePayload, id: this.id }) : saveArticle(articlePayload))            
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
        }
    };

    render () {
        return <div>
            <Form
                initialValues={this.initialValues}
                langs={['ru', 'ua']}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование статьи' : 'Добавление статьи'
                    }
                })}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
            />
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(ArticleForm);
