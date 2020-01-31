import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uniqid from 'uniqid';
import classNames from 'classnames';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import ReorderIcon from '@material-ui/icons/Reorder';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import remove from '@tinkoff/utils/array/remove';
import noop from '@tinkoff/utils/function/noop';
import arrayMove from '../../../../../utils/arrayMove';

const materialStyles = {
    size: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 9999,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: '5px',
        paddingBottom: '5px'
    },
    sizes: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '210px'
    },
    sizeGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flexWrap: 'wrap',
        '@media (max-width:600px)': {
            flexDirection: 'column'
        }
    },
    sizeField: {
        width: 'calc(33% - 20px)',
        '@media (max-width:600px)': {
            width: '100%'
        },

    },
    sizeField_long: {
        width: 'calc(50% - 20px)',
        '@media (max-width:600px)': {
            width: '100%'
        }
    },
    buttonSortable: {
        position: 'relative',
        top: '4px',
        marginRight: '12px',
        cursor: 'pointer'
    },
    addButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '80px'
    }
};

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> reorder </ReorderIcon>
));

const Size = SortableElement(({ rowIndex, size, handleSizeDelete, handleSizeChange, classes }) => (
    <FormGroup className={classes.size} row>
        <ButtonSortable imageClassName={classes.buttonSortable}/>
        <div className={classes.sizeGroup}>
            <TextField
                className={classNames(classes.sizeField, classes.sizeField_long)}
                label='Размер'
                value={size.name}
                onChange={handleSizeChange('name', rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classNames(classes.sizeField, classes.sizeField_long)}
                label='Артикул'
                value={size.article}
                onChange={handleSizeChange('article', rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.sizeField}
                label='Цена'
                value={size.price}
                type='number'
                onChange={handleSizeChange('price', rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.sizeField}
                label='Скидочная цена'
                value={size.discountPrice}
                type='number'
                onChange={handleSizeChange('discountPrice', rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.sizeField}
                label='Размер скидки (%)'
                value={size.discount}
                type='number'
                onChange={handleSizeChange('discount', rowIndex)}
                margin='normal'
                variant='outlined'
            />
        </div>
        <IconButton aria-label='Delete' className={classes.sizeDelButton} onClick={handleSizeDelete(rowIndex)}>
            <DeleteIcon />
        </IconButton>
    </FormGroup>
));

const Sizes = SortableContainer(({ sizes, classes, ...rest }) =>
    <div>
        {sizes.map((size, i) => <Size key={i} index={i} rowIndex={i} size={size} {...rest} classes={classes}/>)}
    </div>
);

class FormFieldSizes extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.array,
        onChange: PropTypes.func,
        validationMessage: PropTypes.string
    };

    static defaultProps = {
        value: [],
        onChange: noop,
        validationMessage: ''
    };

    state = {
        isSorting: false
    };

    handleSizeAdd = () => {
        const { value } = this.props;

        this.props.onChange([
            ...value,
            { name: '', article: '', price: '', discountPrice: '', discount: '', id: uniqid() }
        ]);
    };

    handleSizeChange = (prop, i) => event => {
        const { value } = this.props;

        value[i][prop] = event.target.value;

        this.props.onChange(value);
    };

    handleSizeDelete = i => () => {
        const { value } = this.props;

        this.props.onChange(remove(i, 1, value));
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value } = this.props;

        this.props.onChange(arrayMove(value, oldIndex, newIndex));
    };

    render () {
        const { classes, value, validationMessage } = this.props;

        return <div>
            <Sizes
                axis='xy'
                sizes={value}
                handleSizeDelete={this.handleSizeDelete}
                handleSizeChange={this.handleSizeChange}
                onSortEnd={this.onDragEnd}
                classes={classes}
                useDragHandle
                validationMessage={validationMessage}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleSizeAdd}>
                    <AddIcon />
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldSizes);
