import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uniqid from 'uniqid';

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
    tableSize: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 9999
    },
    tableSizes: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '210px'
    },
    tableSizeGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        '@media (max-width:780px)': {
            flexDirection: 'column'
        }
    },
    tableSizeField: {
        width: 'calc(50% - 20px)',
        '@media (max-width:780px)': {
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

const TableSize =
    SortableElement(({ rowIndex, tableSize, handleTableSizeDelete, sizeIndex, handleTableSizeChange, classes, schema }) => (
        <FormGroup className={classes.tableSize} row>
            <ButtonSortable imageClassName={classes.buttonSortable}/>
            <div className={classes.tableSizeGroup}>
                <TextField
                    className={classes.tableSizeField}
                    label={schema.name || ''}
                    value={tableSize.name || ''}
                    onChange={handleTableSizeChange('name', sizeIndex, rowIndex)}
                    margin='normal'
                    variant='outlined'
                />
                <TextField
                    className={classes.tableSizeField}
                    label={schema.value}
                    value={tableSize.value || ''}
                    onChange={handleTableSizeChange('value', sizeIndex, rowIndex)}
                    margin='normal'
                    variant='outlined'
                />
            </div>
            <IconButton aria-label='Delete' onClick={handleTableSizeDelete(sizeIndex, rowIndex)}>
                <DeleteIcon/>
            </IconButton>
        </FormGroup>
    ));

const TableSizes = SortableContainer(({ tableSizes, classes, ...rest }) =>
    <div>
        {tableSizes.map((tableSize, i) => {
            return <TableSize key={i}
                index={i}
                rowIndex={i}
                tableSize={tableSize}
                {...rest}
                classes={classes}
            />;
        })}
    </div>
);

class FormFieldTableSizes extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.array,
        onChange: PropTypes.func,
        validationMessage: PropTypes.string,
        schema: PropTypes.object,
        sizeIndex: PropTypes.number.isRequired,
        sizes: PropTypes.array.isRequired
    };

    static defaultProps = {
        value: [],
        onChange: noop,
        validationMessage: '',
        schema: {},
        sizes: []
    };

    state = {
        isSorting: false
    };

    handleTableSizeAdd = i => () => {
        const { sizes } = this.props;

        if (!sizes[i].tableSizes) sizes[i].tableSizes = [];

        sizes[i].tableSizes = [
            ...sizes[i].tableSizes,
            {
                id: uniqid(),
                name: '',
                value: ''
            }];

        this.props.onChange(sizes);
    };

    handleTableSizeChange = (prop, sizeIndex, tableSizeIndex) => event => {
        const { sizes, onChange } = this.props;

        sizes[sizeIndex].tableSizes[tableSizeIndex][prop] = event.target.value;
        onChange(sizes);
    };

    handleTableSizeDelete = (sizeIndex, tableSizeIndex) => () => {
        const { sizes } = this.props;

        sizes[sizeIndex].tableSizes = remove(tableSizeIndex, 1, sizes[sizeIndex].tableSizes);
        this.props.onChange(sizes);
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value, sizes, sizeIndex } = this.props;

        sizes[sizeIndex].tableSizes = arrayMove(value, oldIndex, newIndex);
        this.props.onChange(sizes);
    };

    render () {
        const { classes, value, validationMessage, schema, sizeIndex } = this.props;

        return <div>
            <TableSizes
                axis='xy'
                tableSizes={value}
                handleTableSizeDelete={this.handleTableSizeDelete}
                handleTableSizeChange={this.handleTableSizeChange}
                onSortEnd={this.onDragEnd}
                classes={classes}
                useDragHandle
                validationMessage={validationMessage}
                schema={schema}
                sizeIndex={sizeIndex}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleTableSizeAdd(sizeIndex)}>
                    <AddIcon/>
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldTableSizes);
