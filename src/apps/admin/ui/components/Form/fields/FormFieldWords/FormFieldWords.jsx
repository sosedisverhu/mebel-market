import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';

import noop from '@tinkoff/utils/function/noop';
import trim from '@tinkoff/utils/string/trim';
import remove from '@tinkoff/utils/array/remove';

const materialStyles = {
    buttonRoot: {
        display: 'inline-flex',
        marginLeft: '15px'
    },
    keywordsRoot: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    keywordsInput: {
        width: '100%'
    },
    words: {
        margin: '5px 5px 5px 0'
    }
};

class FormFieldWords extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        value: PropTypes.object
    };

    static defaultProps = {
        schema: {},
        onChange: noop,
        onBlur: noop,
        value: {
            words: [],
            input: ''
        }
    };

    handleKeywordAdd = () => {
        const { value } = this.props;
        const keyword = trim(value.input).replace(/\s\s+/g, ' ');

        if (!keyword) {
            return;
        }

        const splittedKeyword = keyword.split(' ');
        const newKeywords = [...value.words, ...splittedKeyword].filter((keyword) => !!keyword);

        this.props.onChange({
            words: newKeywords,
            input: ''
        });
    };

    handleKeywordDelete = (i) => () => {
        const { value } = this.props;
        const newKeywords = remove(i, 1, value.words);

        this.props.onChange({
            words: newKeywords,
            input: value.input
        });
    };

    handleKeywordsChange = event => {
        event.preventDefault();

        const { value } = this.props;

        this.props.onChange({
            words: value.words,
            input: event.target.value
        });
    };

    render () {
        const { schema, classes, value } = this.props;

        return <div className={classes.root}>
            <div className={classes.keywordsRoot}>
                <TextField
                    label={schema.label}
                    value={value.input}
                    onChange={this.handleKeywordsChange}
                    onBlur={this.props.onBlur}
                    margin='normal'
                    variant='outlined'
                    type='text'
                    className={classes.keywordsInput}
                />
                <div className={classes.buttonRoot}>
                    <Tooltip
                        title='Добавить ключевое слово'
                        placement='bottom'
                    >
                        <Fab
                            size='small'
                            color='primary'
                            onClick={this.handleKeywordAdd}
                            aria-label='Add'
                        >
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </div>
            </div>
            <div>
                {
                    value.words.map((option, i) => <Chip
                        key={i}
                        label={option}
                        variant='outlined'
                        color='primary'
                        onDelete={this.handleKeywordDelete(i)}
                        className={classes.words}
                    />)
                }
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldWords);
