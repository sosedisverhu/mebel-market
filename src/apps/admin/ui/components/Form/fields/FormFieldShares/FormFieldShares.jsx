import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import uniqid from 'uniqid';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import ReorderIcon from '@material-ui/icons/Reorder';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import remove from '@tinkoff/utils/array/remove';
import noop from '@tinkoff/utils/function/noop';
import pathOr from '@tinkoff/utils/object/pathOr';

import arrayMove from '../../../../../utils/arrayMove';

import FormFieldMultiSelect from '../FormFieldMultiSelect/FormFieldMultiSelect';

const mapStateToProps = ({ data }) => {
    return {
        products: data.products
    };
};

const materialStyles = {
    root: {
        zIndex: 9999
    },
    share: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 9999,
        marginBottom: '5px',
        marginTop: '20px',
        borderRadius: '4px',
        background: '#F3F3F3',
        padding: '10px 20px',
        '@media (max-width:600px)': {
            padding: '5px 10px'
        }
    },
    shareGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        width: '100%',
        marginLeft: '20px',
        flexWrap: 'wrap',
        '@media (max-width:600px)': {
            flexDirection: 'column'
        }
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

const Share =
    SortableElement(({ rowIndex, share, handleShareDelete, sizeIndex, handleShareChange, classes, schema, options }) => (
        <FormGroup className={classes.share} row>
            <ButtonSortable imageClassName={classes.buttonSortable}/>
            <div className={classes.shareGroup}>
                <FormControl variant="outlined" className={classes.shareField}>
                    <InputLabel>
                        {schema.labelType || ''}
                    </InputLabel>
                    <Select
                        value={share.type}
                        onChange={handleShareChange('type', sizeIndex, rowIndex)}
                        input={<OutlinedInput value={share.type} labelWidth={45} name="Type"/>}
                    >
                        {(schema.typeOptions || []).map((option, i) => <MenuItem key={i} value={option.value}>{option.label}</MenuItem>)}
                    </Select>
                    {
                        share.type === 'discount' && <div>
                            <FormFieldMultiSelect
                                options={options}
                                onChange={handleShareChange('products', sizeIndex, rowIndex)}
                                value={share.products}
                                schema={{ placeholder: schema.selectPlaceholder }}
                            />
                            <TextField
                                className={classes.shareField}
                                label={schema.labelValue || ''}
                                value={share.value || ''}
                                onChange={handleShareChange('value', sizeIndex, rowIndex)}
                                margin='normal'
                                variant='outlined'
                                type='number'
                            />
                        </div>
                    }
                    {
                        share.type === 'present' && <div>
                            <FormFieldMultiSelect
                                options={options}
                                onChange={handleShareChange('products', sizeIndex, rowIndex)}
                                value={share.products}
                                schema={{ placeholder: schema.selectPlaceholder }}
                            />
                        </div>
                    }
                </FormControl>
            </div>
            <IconButton aria-label='Delete' onClick={handleShareDelete(sizeIndex, rowIndex)}>
                <DeleteIcon/>
            </IconButton>
        </FormGroup>
    ));

const Shares = SortableContainer(({ shares, classes, ...rest }) =>
    <div>
        {shares.map((share, i) => {
            return <Share key={i}
                index={i}
                rowIndex={i}
                share={share}
                {...rest}
                classes={classes}
            />;
        })}
    </div>
);

class FormFieldShares extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.array,
        onChange: PropTypes.func,
        validationMessage: PropTypes.string,
        schema: PropTypes.object,
        sizeIndex: PropTypes.number.isRequired,
        sizes: PropTypes.array.isRequired,
        products: PropTypes.array.isRequired
    };

    static defaultProps = {
        value: [],
        onChange: noop,
        validationMessage: '',
        schema: {},
        sizes: [],
        products: []
    };

    state = {
        isSorting: false
    };

    handleShareAdd = i => () => {
        const { sizes } = this.props;

        if (!sizes[i].shares) sizes[i].shares = [];

        sizes[i].shares = [
            ...sizes[i].shares,
            {
                id: uniqid(),
                type: '',
                products: [],
                value: ''
            }];

        this.props.onChange(sizes);
    };

    handleShareChange = (prop, sizeIndex, shareIndex) => event => {
        const { sizes, onChange } = this.props;

        if (prop === 'products') {
            sizes[sizeIndex].shares[shareIndex][prop] = event;
        } else {
            sizes[sizeIndex].shares[shareIndex][prop] = event.target.value;
        }

        if (prop === 'type') {
            sizes[sizeIndex].shares[shareIndex].value = '';
        }

        onChange(sizes);
    };

    handleShareDelete = (sizeIndex, shareIndex) => () => {
        const { sizes } = this.props;

        sizes[sizeIndex].shares = remove(shareIndex, 1, sizes[sizeIndex].shares);
        this.props.onChange(sizes);
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value, sizes, sizeIndex } = this.props;

        sizes[sizeIndex].shares = arrayMove(value, oldIndex, newIndex);
        this.props.onChange(sizes);
    };

    render () {
        const { classes, value, validationMessage, schema, sizeIndex, products } = this.props;

        const validateOptions = products.map(product => {
            return {
                value: product.id,
                label: pathOr(['texts', 'ru', 'name'], '', product)
            };
        });

        return <div className={classes.root}>
            <Shares
                axis='xy'
                shares={value}
                handleShareDelete={this.handleShareDelete}
                handleShareChange={this.handleShareChange}
                onSortEnd={this.onDragEnd}
                classes={classes}
                useDragHandle
                validationMessage={validationMessage}
                schema={schema}
                sizeIndex={sizeIndex}
                options={validateOptions}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleShareAdd(sizeIndex)}>
                    <AddIcon/>
                </Fab>
            </div>
        </div>;
    }
}

export default connect(mapStateToProps)(withStyles(materialStyles)(FormFieldShares));
