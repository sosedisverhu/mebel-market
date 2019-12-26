import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from '../Form/Form';

import getSchema from './seoFormSchema';

import noop from '@tinkoff/utils/function/noop';
import pathOr from '@tinkoff/utils/object/pathOr';
import isEqual from '@tinkoff/utils/is/equal';
import compose from '@tinkoff/utils/function/compose';
import omit from '@tinkoff/utils/object/omit';

class SeoForm extends Component {
    static propTypes = {
        values: PropTypes.object.isRequired,
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        onSubmit: noop
    };

    constructor (...args) {
        super(...args);

        const { values } = this.props;

        this.state = {
            disabled: true
        };
        this.initialValues = this.getInitialValues(values);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.values !== nextProps.values) {
            this.initialValues = this.getInitialValues(nextProps.values);
        }
    }

    getInitialValues = values => {
        const ru = pathOr(['texts', 'ru'], '', values);
        const ua = pathOr(['texts', 'ua'], '', values);

        return {
            ru_seoTitle: ru.seoTitle || '',
            ua_seoTitle: ua.seoTitle || '',
            ru_seoDescription: ru.seoDescription || '',
            ua_seoDescription: ua.seoDescription || '',
            ru_seoKeywords: { words: ru.seoKeywords && ru.seoKeywords.split(', ') || [], input: '' },
            ua_seoKeywords: { words: ua.seoKeywords && ua.seoKeywords.split(', ') || [], input: '' }
        };
    };

    getPayload = (
        {
            ua_seoTitle: uaSeoTitle,
            ru_seoTitle: ruSeoTitle,
            ua_seoDescription: uaSeoDescription,
            ru_seoDescription: ruSeoDescription,
            ua_seoKeywords: uaSeoKeywords,
            ru_seoKeywords: ruSeoKeywords
        }) => {
        return {
            texts: {
                ua: {
                    seoTitle: uaSeoTitle,
                    seoDescription: uaSeoDescription,
                    seoKeywords: uaSeoKeywords.words.join(', ')
                },
                ru: {
                    seoTitle: ruSeoTitle,
                    seoDescription: ruSeoDescription,
                    seoKeywords: ruSeoKeywords.words.join(', ')
                }
            }
        };
    };

    handleChange = values => {
        this.setState({
            disabled: compose(
                isEqual(this.initialValues),
                omit(['lang'])
            )(values)
        });
    };

    handleSubmit = formValues => {
        const payload = this.getPayload(formValues);

        this.setState({
            disabled: true
        });

        return this.props.onSubmit({ ...payload });
    };

    render () {
        const { disabled } = this.state;

        return <Form
            initialValues={this.initialValues}
            langs={['ru', 'ua']}
            schema={getSchema({
                settings: { disabled }
            })}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
        />;
    }
}

export default SeoForm;