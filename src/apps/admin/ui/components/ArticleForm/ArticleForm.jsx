import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getSchema from './ArticleFormSchema';
import saveArticle from '../../../services/saveArticle';
import editArticle from '../../../services/editArticle';
import format from 'date-fns/format';

const NEWS_VALUES = ['name', 'hidden'];

const mapDispatchToProps = (dispatch) => ({
    saveArticle: payload => dispatch(saveArticle(payload)),
    editArticle: payload => dispatch(editArticle(payload))
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

class ArticleForm extends Component {
    static propTypes = {
        saveArticle: PropTypes.func.isRequired,
        editArticle: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
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
            date: article.date ? format(article.date, 'yyyyy-MM-dd') : format(new Date(), 'yyyyy-MM-dd'),
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            ru_preview: ru.preview || '',
            ua_preview: ua.preview || '',
            ru_content: ru.content || '',
            ua_content: ua.content || '',
            ru_seoTitle: ru.seoTitle || '',
            ua_seoTitle: ua.seoTitle || '',
            ru_seoDescription: ru.seoDescription || '',
            ua_seoDescription: ua.seoDescription || '',
            ru_seoKeywords: ru.seoKeywords,
            ua_seoKeywords: ua.seoKeywords,
            hidden: article.hidden || false,
            alias: article.alias,
            ...pick(NEWS_VALUES, article)
        };
        this.id = prop('id', article);
        this.state = {
            errorText: ''
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
            ua_seoTitle: uaSeoTitle,
            ru_seoTitle: ruSeoTitle,
            ua_seoDescription: uaSeoDescription,
            ru_seoDescription: ruSeoDescription,
            ua_seoKeywords: uaSeoKeywords,
            ru_seoKeywords: ruSeoKeywords,
            date,
            hidden,
            id,
            alias
        }) => {
        return {
            texts: {
                ru: {
                    name: ruName,
                    preview: ruPreview,
                    content: ruContent,
                    seoTitle: ruSeoTitle,
                    seoDescription: ruSeoDescription,
                    seoKeywords: ruSeoKeywords
                },
                ua: {
                    name: uaName,
                    preview: uaPreview,
                    content: uaContent,
                    seoTitle: uaSeoTitle,
                    seoDescription: uaSeoDescription,
                    seoKeywords: uaSeoKeywords
                }
            },
            date: +new Date(date),
            hidden,
            id,
            alias
        };
    };

    handleSubmit = values => {
        const articlePayload = this.getArticlePayload(values);
        const { editArticle, saveArticle, onDone } = this.props;

        (this.id ? editArticle({ ...articlePayload, id: this.id }) : saveArticle(articlePayload))
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    this.setState({
                        errorText: 'Введите уникальные алиас для статьи'
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
        const { errorText } = this.state;

        return <div>
            <Form
                initialValues={this.initialValues}
                langs={['ru', 'ua']}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование статьи' : 'Добавление статьи'
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

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(ArticleForm));
