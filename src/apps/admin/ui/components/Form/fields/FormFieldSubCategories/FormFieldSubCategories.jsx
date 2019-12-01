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
    subCategory: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 9999
    },
    subCategories: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '210px'
    },
    subCategoryGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    subCategoryField: {
        width: 'calc(50% - 20px)'

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

const SubCategory = SortableElement(({ rowIndex, subCategory, validationMessage, handleSubCategoryDelete, handleSubCategoryChange, classes }) => (
    <FormGroup className={classes.subCategory} row>
        <ButtonSortable imageClassName={classes.buttonSortable}/>
        <div className={classes.subCategoryGroup}>
            <TextField
                className={classes.subCategoryField}
                label='Название'
                value={subCategory.name || ''}
                onChange={handleSubCategoryChange('name', rowIndex)}
                margin='normal'
                variant='outlined'
                error={!!validationMessage}
            />
            <TextField
                className={classes.subCategoryField}
                label='Alias'
                value={subCategory.alias}
                onChange={handleSubCategoryChange('alias', rowIndex)}
                margin='normal'
                variant='outlined'
                error={!!validationMessage}
            />
        </div>
        <IconButton aria-label='Delete' onClick={handleSubCategoryDelete(rowIndex)}>
            <DeleteIcon/>
        </IconButton>
    </FormGroup>
));

const SubCategories = SortableContainer(({ subCategories, classes, ...rest }) =>
    <div>
        {subCategories.map((subCategory, i) => {
            return <SubCategory key={i}
                index={i}
                rowIndex={i}
                subCategory={subCategory}
                {...rest}
                classes={classes}
            />;
        })}
    </div>
);

class FormFieldSubCategories extends Component {
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

    handleSubCategoryAdd = () => {
        const { value } = this.props;

        this.props.onChange([
            ...value,
            {
                name: '',
                alias: '',
                id: uniqid(),
                positionIndex: value.length
            }
        ]);
    };

    handleSubCategoryChange = (prop, i) => event => {
        const { value } = this.props;

        value[i][prop] = event.target.value;

        this.props.onChange(value);
    };

    handleSubCategoryDelete = i => () => {
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
            <SubCategories
                axis='xy'
                subCategories={value}
                handleSubCategoryDelete={this.handleSubCategoryDelete}
                handleSubCategoryChange={this.handleSubCategoryChange}
                onSortEnd={this.onDragEnd}
                classes={classes}
                useDragHandle
                validationMessage={validationMessage}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleSubCategoryAdd}>
                    <AddIcon/>
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldSubCategories);
