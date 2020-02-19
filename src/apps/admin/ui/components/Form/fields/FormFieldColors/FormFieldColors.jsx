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
import isEmpty from '@tinkoff/utils/is/empty';
import arrayMove from '../../../../../utils/arrayMove';

import FormFieldFiles from '../FormFieldFiles/FormFieldFiles';

const materialStyles = {
    color: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 9999,
        marginBottom: '5px',
        padding: '5px',
        marginTop: '15px',
        borderRadius: '4px',
        background: '#FFFFFF'
    },
    colors: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '210px'
    },
    colorGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flexWrap: 'wrap',
        '@media (max-width:600px)': {
            flexDirection: 'column'
        }
    },
    colorField: {
        width: 'calc(33% - 20px)',
        '@media (max-width:600px)': {
            width: '100%'
        }
    },
    colorField_long: {
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
    },
    h6: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: '1.25rem',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: '500',
        lineHeight: '1.6',
        paddingLeft: '36px'
    }
};

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> reorder </ReorderIcon>
));

const Color = SortableElement(({ rowIndex, sizeIndex, color, handleColorDelete, handleColorChange, classes }) => (
    <FormGroup className={classes.color} row>
        <ButtonSortable imageClassName={classes.buttonSortable}/>
        <div className={classes.colorGroup}>
            <TextField
                className={classNames(classes.colorField, classes.colorField_long)}
                label='Цвет'
                value={color.name || ''}
                onChange={handleColorChange('name', sizeIndex, rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classNames(classes.colorField, classes.colorField_long)}
                label='Артикул'
                value={color.article || ''}
                onChange={handleColorChange('article', sizeIndex, rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.colorField}
                label='Цена'
                value={color.price || ''}
                type='number'
                onChange={handleColorChange('price', sizeIndex, rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.colorField}
                label='Скидочная цена'
                value={color.discountPrice || ''}
                type='number'
                onChange={handleColorChange('discountPrice', sizeIndex, rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.colorField}
                label='Размер скидки (%)'
                value={color.discount || ''}
                type='number'
                onChange={handleColorChange('discount', sizeIndex, rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <FormFieldFiles
                schema={{ max: 1 }}
                onChange={handleColorChange('file', sizeIndex, rowIndex)}
                value={ !isEmpty(color.file) ? { files: [color.file] } : {} }/>
        </div>
        <IconButton aria-label='Delete' className={classes.colorDelButton} onClick={handleColorDelete(sizeIndex, rowIndex)}>
            <DeleteIcon />
        </IconButton>
    </FormGroup>
));

const Colors = SortableContainer(({ colors, classes, ...rest }) =>
    <div>
        {colors.map((color, i) => <Color key={i} index={i} rowIndex={i} color={color} {...rest} classes={classes}/>)}
    </div>
);

class FormFieldColors extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.array,
        onChange: PropTypes.func,
        validationMessage: PropTypes.string,
        sizeIndex: PropTypes.number.isRequired,
        sizes: PropTypes.array.isRequired
    };

    static defaultProps = {
        value: [],
        onChange: noop,
        validationMessage: '',
        sizeIndex: 0,
        sizes: []
    };

    state = {
        isSorting: false
    };

    handleColorAdd = i => () => {
        const { sizes } = this.props;

        sizes[i].colors = [
            ...sizes[i].colors,
            {
                id: uniqid(),
                name: '',
                price: '',
                discountPrice: '',
                discount: '',
                article: '',
                file: {}
            }];

        this.props.onChange(sizes);
    };

    handleColorChange = (prop, sizeIndex, colorIndex) => event => {
        const { sizes } = this.props;

        if (prop === 'file') {
            sizes[sizeIndex].colors[colorIndex][prop] = event;
            this.props.onChange(sizes);
        } else {
            sizes[sizeIndex].colors[colorIndex][prop] = event.target.value;
            this.props.onChange(sizes);
        }
    };

    handleColorDelete = (sizeIndex, colorIndex) => () => {
        const { sizes } = this.props;

        sizes[sizeIndex].colors = remove(colorIndex, 1, sizes[sizeIndex].colors);
        this.props.onChange(sizes);
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value, sizes, sizeIndex } = this.props;

        sizes[sizeIndex].colors = arrayMove(value, oldIndex, newIndex);
        this.props.onChange(sizes);
    };

    render () {
        const { classes, value, validationMessage, sizeIndex } = this.props;

        return <div>
            <h6 className={classes.h6}>Цвета товара</h6>
            <Colors
                axis='xy'
                colors={value}
                handleColorDelete={this.handleColorDelete}
                handleColorChange={this.handleColorChange}
                onSortEnd={this.onDragEnd}
                classes={classes}
                sizeIndex={sizeIndex}
                useDragHandle
                validationMessage={validationMessage}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleColorAdd(sizeIndex)}>
                    <AddIcon />
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldColors);
