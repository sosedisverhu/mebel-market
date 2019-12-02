import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getSchema from './NewsItemFormSchema';
import saveNewsItem from '../../../services/saveNewsItem';
import editNewsItem from '../../../services/editNewsItem';
import updateNewsItemFiles from '../../../services/updateNewsItemFiles';
import updateNewsItemAvatar from '../../../services/updateNewsItemAvatar';

import Form from '../Form/Form';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

const NEWS_VALUES = ['name', 'hidden'];

const mapDispatchToProps = (dispatch) => ({
    saveNewsItem: payload => dispatch(saveNewsItem(payload)),
    editNewsItem: payload => dispatch(editNewsItem(payload)),
    updateNewsItemFiles: (...payload) => dispatch(updateNewsItemFiles(...payload)),
    updateNewsItemAvatar: (...payload) => dispatch(updateNewsItemAvatar(...payload))
});

class NewsItemForm extends Component {
    static propTypes = {
        saveNewsItem: PropTypes.func.isRequired,
        editNewsItem: PropTypes.func.isRequired,
        updateNewsItemFiles: PropTypes.func.isRequired,
        updateNewsItemAvatar: PropTypes.func.isRequired,
        onDone: PropTypes.func,
        newsItem: PropTypes.object
    };

    static defaultProps = {
        onDone: noop,
        newsItem: {}
    };

    constructor (...args) {
        super(...args);

        const { newsItem } = this.props;
        const ru = pathOr(['texts', 'ru'], '', newsItem);
        const ua = pathOr(['texts', 'ua'], '', newsItem);

        this.initialValues = {
            avatar: { files: newsItem.avatar ? [newsItem.avatar] : [] },
            files: { files: newsItem.files ? newsItem.files : [] },
            youTubeVideo: newsItem.youTubeVideo || '',
            date: newsItem.date,
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            ru_description: ru.description || '',
            ua_description: ua.description || '',
            lang: 'ru',
            hidden: newsItem.hidden || false,
            alias: newsItem.alias,
            ...pick(NEWS_VALUES, newsItem)
        };
        this.id = prop('id', newsItem);
        this.state = {
            lang: 'ru'
        };
    }

    getNewsItemPayload = (
        {
            ru_name: ruName,
            ua_name: uaName,
            ru_description: ruDescription,
            ua_description: uaDescription,
            youTubeVideo,
            hidden,
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
            youTubeVideo,
            hidden,
            id,
            alias
        };
    };

    handleSubmit = values => {
        event.preventDefault();

        const newsItemPayload = this.getNewsItemPayload(values);
        const { editNewsItem, saveNewsItem, updateNewsItemAvatar, updateNewsItemFiles, onDone } = this.props;

        (this.id ? editNewsItem({ ...newsItemPayload, id: this.id }) : saveNewsItem(newsItemPayload))
            .then(newsItem => {
                const { files } = values.avatar;
                if (files[0].content) {
                    const formData = new FormData();

                    formData.append(`newsItem-${newsItem.id}-avatar`, files[0].content);

                    return updateNewsItemAvatar(formData, newsItem.id);
                }
            })
            .then(newsItem => {
                const { files } = values.files;
                const formData = new FormData();
                const removedFiles = [];
                const oldFiles = [];

                files.forEach((file, i) => {
                    if (file.content) {
                        formData.append(`newsItem-${newsItem.id}-file-${i}`, file.content);
                    } else {
                        oldFiles.push({
                            path: file.path,
                            index: i
                        });
                    }
                });
                formData.append('removedFiles', JSON.stringify(removedFiles));
                formData.append('oldFiles', JSON.stringify(oldFiles));

                return updateNewsItemFiles(formData, newsItem.id);
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
        }
    };

    render () {
        return <div>
            <Form
                initialValues={this.initialValues}
                langs={['ru', 'ua']}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование новости' : 'Добавление новости'
                    }
                })}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
            />
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(NewsItemForm);
