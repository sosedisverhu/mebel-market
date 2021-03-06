import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ReorderIcon from '@material-ui/icons/Reorder';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import trim from '@tinkoff/utils/string/trim';
import { withStyles } from '@material-ui/core/styles';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import arrayMove from '../../../../../utils/arrayMove';
import remove from '@tinkoff/utils/array/remove';
import noop from '@tinkoff/utils/function/noop';
import uniqid from 'uniqid';

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}>reorder</ReorderIcon>
));

const Filter = SortableElement((
    {
        filterIndex,
        filter,
        isSorting,
        onFilterOptionAdd,
        onFilterDelete,
        onFilterOptionDelete,
        onFilterNewOptionChange,
        onFilterEditOptionChange,
        onFilterOptionEditStart,
        onFilterOptionEditDone,
        onFilterOptionEditCancel,
        onFilterChange,
        newOptionTexts,
        editableOptionText,
        editableFilterIndex,
        editableOptionIndex,
        onSortOptionsStart,
        onSortOptionsEnd,
        isSortingOptions,
        classes,
        schema
    }) => {
    const isEditable = editableFilterIndex === filterIndex;

    return (
        <FormGroup className={classNames(classes.filter, { [classes.filterIsSortable]: isSorting })} row>
            <div className={classes.filterGroup}>
                <ButtonSortable imageClassName={classes.buttonSortable}/>
                <div className={classes.filterInputsWrapp}>
                    <TextField
                        className={classes.filterField}
                        label='Название'
                        value={filter.name || ''}
                        onChange={onFilterChange('name', filterIndex)}
                        margin='normal'
                        variant='outlined'
                    />
                    <FormControl variant="outlined" className={classes.filterField}>
                        <InputLabel>
                            Type
                        </InputLabel>
                        <Select
                            value={filter.type}
                            onChange={onFilterChange('type', filterIndex)}
                            input={<OutlinedInput value={filter.type} labelWidth={45} name="Type"/>}
                        >
                            <MenuItem value='checkbox'>Checkbox</MenuItem>
                            <MenuItem value='range'>Range</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        filter.type === 'checkbox' && <div>
                            <TextField
                                className={classes.filterField}
                                label={!isEditable ? 'Название новой опции' : 'Редактирование опции'}
                                value={(!isEditable ? newOptionTexts[filterIndex].name : editableOptionText) || ''}
                                onChange={!isEditable ? onFilterNewOptionChange(filterIndex) : onFilterEditOptionChange}
                                margin='normal'
                                variant='outlined'
                            />
                            {
                                !isEditable
                                    ? <Fab
                                        size="small"
                                        color='primary'
                                        className={classes.actionOptionButton}
                                        onClick={onFilterOptionAdd(filterIndex)} aria-label="Add"
                                    >
                                        <AddIcon/>
                                    </Fab>
                                    : <Fragment>
                                        <Fab
                                            size="small"
                                            color='primary'
                                            className={classes.actionOptionButton}
                                            onClick={onFilterOptionEditDone} aria-label="Edit"
                                        >
                                            <CheckIcon/>
                                        </Fab>
                                        <Fab
                                            size="small"
                                            color='primary'
                                            className={classes.actionOptionButton}
                                            onClick={onFilterOptionEditCancel} aria-label="Cancel"
                                        >
                                            <CloseIcon/>
                                        </Fab>
                                    </Fragment>
                            }
                            <Options
                                axis='xy'
                                options={filter.options}
                                filterIndex={filterIndex}
                                isEditable={isEditable}
                                pressDelay={200}
                                classes={classes}
                                onSortStart={onSortOptionsStart}
                                onSortEnd={onSortOptionsEnd(filterIndex)}
                                editableOptionIndex={editableOptionIndex}
                                onFilterOptionEditStart={onFilterOptionEditStart}
                                onFilterOptionDelete={onFilterOptionDelete}
                                isSortingOptions={isSortingOptions}
                                disabled={editableFilterIndex === filterIndex}
                            />
                        </div>
                    }
                    {
                        filter.type === 'range' && <TextField
                            className={classes.filterField}
                            label='Размерность'
                            value={filter.dimension || ''}
                            onChange={onFilterChange('dimension', filterIndex)}
                            margin='normal'
                            variant='outlined'
                        />
                    }
                    { schema.viewInAnotherFilters && <div className={classes.checkbox}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filter.viewInAnotherFilters || ''}
                                    onChange={onFilterChange('viewInAnotherFilters', filterIndex)}
                                    color='primary'
                                />
                            }
                            label="Показывать фильтр в подкатегории"
                        />
                    </div>}
                </div>
                <IconButton aria-label='Delete' className={classes.deleteFilterButton} onClick={onFilterDelete(filterIndex)}>
                    <DeleteIcon/>
                </IconButton>
            </div>
        </FormGroup>
    );
});

const Option = SortableElement((
    {
        classes,
        editableOptionIndex,
        onFilterOptionDelete,
        onFilterOptionEditStart,
        filterIndex,
        index,
        option,
        isEditable,
        isSortingOptions
    }) =>
    <Chip
        label={option.name}
        variant={(!isEditable || editableOptionIndex !== index) && 'outlined'}
        color="primary"
        onDelete={onFilterOptionDelete(filterIndex, index)}
        className={classNames(classes.chip, { [classes.optionIsSortable]: isSortingOptions })}
        onClick={onFilterOptionEditStart(filterIndex, index)}
        clickable
    />
);

const Options = SortableContainer(({ options, classes, ...rest }) =>
    <div className={classes.optionsWrapp}>
        {options && options.map((option, i) => <Option key={i} index={i} option={option} classes={classes} {...rest} />)}
    </div>
);

const Filters = SortableContainer(({ filters, classes, ...rest }) =>
    <div className={classes.filtersWrapp}>
        {
            filters.map((filter, i) => <Filter key={i} index={i} filterIndex={i} filter={filter} {...rest} classes={classes}/>)
        }
    </div>
);

const materialStyles = theme => ({
    createFiltersWrapp: {
        display: 'flex',
        flexDirection: 'column'
    },
    createFiltersHeader: {
        display: 'flex',
        marginTop: '8px',
        marginBottom: '8px'
    },
    filterTitle: {
        marginRight: '20px',
        display: 'flex',
        alignItems: 'center'
    },
    filter: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: '2000',
        justifyContent: 'center'
    },
    filterGroup: {
        display: 'flex',
        marginTop: '20px',
        paddingLeft: '40px',
        paddingRight: '40px',
        alignItems: 'center',
        borderRadius: '4px',
        width: '100%',
        backgroundColor: '#F3F3F3',
        '@media (max-width: 600px)': {
            paddingLeft: '10px',
            paddingRight: '10px'
        },
        '@media (max-width: 425px)': {
            display: 'block'
        }
    },
    filterIsSortable: {
        zIndex: '2000',
        userSelect: 'none'
    },
    filterInputsWrapp: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        paddingLeft: '40px',
        justifyContent: 'space-between',
        '@media (max-width: 600px)': {
            paddingLeft: '0px'
        }
    },
    filterField: {
        width: 'calc(50% - 20px)',
        height: '56px',
        backgroundColor: '#ffffff',
        marginTop: '12px',
        marginBottom: '12px',
        '@media (max-width: 780px)': {
            width: '100%'
        }
    },
    deleteFilterButton: {
        height: '50px',
        width: '50px'
    },
    buttonSortable: {
        cursor: 'grab'
    },
    actionOptionButton: {
        margin: '18px'
    },
    chip: {
        margin: '4px',
        marginBottom: '19px',
        zIndex: '3000',
        background: '#FFFFFF',
        '& span': {
            minWidth: '40px'
        }
    },
    selectEmpty: {
        marginTop: 2 * theme.spacing.unit
    },
    buttonWrapp: {
        width: '90%',
        display: 'flex',
        margin: '15px',
        justifyContent: 'flex-end'
    },
    optionIsSortable: {
        background: 'none'
    }
});

class FormFieldFilters extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.array,
        onChange: PropTypes.func,
        schema: PropTypes.object
    };

    static defaultProps = {
        value: [],
        onChange: noop,
        schema: {}
    };

    state = {
        isSorting: false,
        newOptionTexts: this.props.value.map(() => ({ id: uniqid(), name: '' })),
        editableOptionText: '',
        editableFilterIndex: null,
        editableOptionIndex: null,
        isSortingOptions: false
    };

    handleFilterAdd = () => {
        const { value } = this.props;
        const { newOptionTexts } = this.state;

        this.props.onChange([
            ...value,
            { name: '', type: '', id: uniqid() }
        ]);
        this.setState({
            newOptionTexts: [
                ...newOptionTexts,
                { name: '' }
            ]
        });
    };

    handleFilterChange = (prop, i) => (event, checked) => {
        const { value } = this.props;
        const newValue = [...value];

        if (typeof (checked) === 'boolean') {
            newValue[i][prop] = checked;
        } else {
            newValue[i][prop] = event.target.value;
        }

        if (newValue[i].options === undefined) {
            newValue[i].options = [];
        }

        this.props.onChange(newValue);
    };

    handleFilterDelete = i => () => {
        const { value } = this.props;
        const { newOptionTexts } = this.state;

        this.props.onChange(remove(i, 1, value));
        this.setState({
            newOptionTexts: remove(i, 1, newOptionTexts)
        });
    };

    handleFilterOptionAdd = i => () => {
        const { value } = this.props;
        const { newOptionTexts } = this.state;
        const newValue = [...value];
        const newOptionTextsCopy = [...newOptionTexts];
        const optionText = trim(newOptionTexts[i].name);

        if (!optionText) {
            return;
        }

        newValue[i].options = [...newValue[i].options, { id: uniqid(), name: newOptionTexts[i].name }];
        newOptionTextsCopy[i].name = '';

        this.setState({
            newOptionTexts: newOptionTextsCopy
        });

        this.props.onChange(newValue);
    };

    handleFilterOptionDelete = (filterIndex, i) => () => {
        const { value } = this.props;
        const newValue = [...value];

        newValue[filterIndex].options = remove(i, 1, newValue[filterIndex].options);

        this.props.onChange(newValue);
    };

    handleFilterNewOptionChange = filterIndex => event => {
        const { newOptionTexts } = this.state;
        const newOptionTextsCopy = [...newOptionTexts];

        newOptionTextsCopy[filterIndex].name = event.target.value;

        this.setState({
            newOptionTexts: newOptionTextsCopy
        });
    };

    handleFilterEditOptionChange = event => {
        this.setState({
            editableOptionText: event.target.value
        });
    };

    handleFilterOptionEditStart = (filterIndex, i) => () => {
        const { value } = this.props;
        const { newOptionTexts } = this.state;
        const newOptionTextsCopy = [...newOptionTexts];

        newOptionTextsCopy[filterIndex].name = '';

        this.setState({
            editableFilterIndex: filterIndex,
            editableOptionIndex: i,
            editableOptionText: value[filterIndex].options[i].name,
            newOptionTexts: newOptionTextsCopy
        });
    };

    handleFilterOptionEditDone = () => {
        const { value } = this.props;
        const { editableOptionText, editableFilterIndex, editableOptionIndex } = this.state;
        const newValue = [...value];

        const optionText = trim(editableOptionText);

        if (!optionText) {
            return;
        }

        newValue[editableFilterIndex].options[editableOptionIndex].name = optionText;

        this.setState({
            editableOptionText: '',
            editableFilterIndex: null,
            editableOptionIndex: null
        });

        this.props.onChange(newValue);
    };

    handleFilterOptionEditCancel = () => {
        this.setState({
            editableOptionText: '',
            editableFilterIndex: null,
            editableOptionIndex: null
        });
    };

    onDragStart = () => {
        this.setState({
            isSorting: true
        });
    };

    onDragOptionsStart = () => {
        this.setState({
            isSortingOptions: true
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value } = this.props;

        this.props.onChange(arrayMove(value, oldIndex, newIndex));
        this.setState({
            isSorting: false
        });
    };

    onDragOptionsEnd = (filterIndex) => ({ oldIndex, newIndex }) => {
        const { value: filters } = this.props;

        filters[filterIndex].options = arrayMove(filters[filterIndex].options, oldIndex, newIndex);
        this.props.onChange(filters);

        this.setState({
            isSortingOptions: false
        });
    };

    render () {
        const { classes, value, schema } = this.props;
        const { isSorting, isSortingOptions, newOptionTexts, editableOptionText, editableFilterIndex, editableOptionIndex } = this.state;

        return <div className={classes.createFiltersWrapp}>
            <Filters
                axis='xy'
                filters={value}
                onFilterDelete={this.handleFilterDelete}
                onFilterChange={this.handleFilterChange}
                onFilterOptionAdd={this.handleFilterOptionAdd}
                onFilterOptionDelete={this.handleFilterOptionDelete}
                onFilterNewOptionChange={this.handleFilterNewOptionChange}
                onFilterEditOptionChange={this.handleFilterEditOptionChange}
                onFilterOptionEditStart={this.handleFilterOptionEditStart}
                onFilterOptionEditDone={this.handleFilterOptionEditDone}
                onFilterOptionEditCancel={this.handleFilterOptionEditCancel}
                onSortStarТt={this.onDragStart}
                onSortEnd={this.onDragEnd}
                onSortOptionsStart={this.onDragOptionsStart}
                onSortOptionsEnd={this.onDragOptionsEnd}
                newOptionTexts={newOptionTexts}
                editableOptionText={editableOptionText}
                editableFilterIndex={editableFilterIndex}
                editableOptionIndex={editableOptionIndex}
                isSorting={isSorting}
                isSortingOptions={isSortingOptions}
                useDragHandle
                classes={classes}
                schema={schema}
            />
            <div className={classes.buttonWrapp}>
                <Fab size="small" color='primary' onClick={this.handleFilterAdd} aria-label="Add">
                    <AddIcon/>
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldFilters);
