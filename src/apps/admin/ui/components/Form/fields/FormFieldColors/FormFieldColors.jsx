import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import uniqid from 'uniqid';

import { withStyles } from '@material-ui/core/styles';
import { SketchPicker } from 'react-color';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';

import outsideClick from '../../../../../../client/ui/hocs/outsideClick';

import remove from '@tinkoff/utils/array/remove';
import isNull from '@tinkoff/utils/is/nil';
import arrayMove from '../../../../../utils/arrayMove';

const DEFAULT_COLOR = '#000';

const materialStyles = {
    colorsList: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    colorItem: {
        position: 'relative',
        userSelect: 'none',
        float: 'left',
        zIndex: '9999',
        cursor: 'grab',
        marginRight: '20px',
        display: 'flex',
        flexDirection: 'column',
        '&:hover $colorItemIcons': {
            visibility: 'visible'
        },
        '@media (max-width: 500px)': {
            width: '100%'
        }
    },
    colorItemSorting: {
        '&:hover $colorItemIcons': {
            visibility: 'hidden'
        }
    },
    colorItemIcons: {
        display: 'flex',
        position: 'absolute',
        right: '-10px',
        top: '-10px',
        visibility: 'hidden'
    },
    colorItemIconContainer: {
        background: 'white',
        borderRadius: '100%'
    },
    colorItemIconButton: {
        width: '30px',
        height: '30px',
        padding: '0'
    },
    colorItemIconIcon: {
        width: '20px',
        height: '20px'
    },
    colorWrapper: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer'
    },
    color: {
        minWidth: '80px',
        height: '40px',
        border: '1px solid rgba(0,0,0,.1)',
        borderRadius: '1px'
    },
    addButton: {
        marginTop: '20px'
    }
};

const Color = SortableHandle(({ classes, color }) => (
    <div className={classes.colorWrapper}>
        <div className={classes.color} style={{ backgroundColor: color.hex }} />
    </div>
));

const ColorItem = SortableElement(({
    color,
    colorIndex,
    classes,
    onColorDelete,
    onPickerOpen,
    onNameChange,
    isSorting,
    schema
}) =>
    <div
        className={classNames(classes.colorItem, {
            [classes.colorItemSorting]: isSorting
        })}
    >
        <div className={classes.colorItemIcons}>
            <div className={classes.colorItemIconContainer}>
                <IconButton
                    className={classes.colorItemIconButton}
                    aria-label='Edit'
                    onClick={onPickerOpen(colorIndex)}
                >
                    <EditIcon className={classes.colorItemIconIcon} />
                </IconButton>
            </div>
            <div className={classes.colorItemIconContainer}>
                <IconButton
                    className={classes.colorItemIconButton}
                    aria-label='Delete'
                    onClick={onColorDelete(colorIndex)}
                >
                    <DeleteIcon className={classes.colorItemIconIcon} />
                </IconButton>
            </div>
        </div>
        <Color color={color} classes={classes} />
        { schema.name && <TextField
            label='Название'
            className={classes.fileName}
            value={color.name || ''}
            onChange={onNameChange(colorIndex)}
            margin='normal'
            variant='outlined'
            type='text'
        /> }
    </div>);

const Colors = SortableContainer(({ colors, classes, ...rest }) => {
    return (
        <div className={classes.colorsList}>
            {colors.map((color, i) => <ColorItem
                key={i}
                index={i}
                colorIndex={i}
                color={color}
                classes={classes}
                {...rest}
            />)}
        </div>
    );
});

@outsideClick
class FormFieldColors extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.array,
        schema: PropTypes.object,
        turnOnClickOutside: PropTypes.func.isRequired,
        outsideClickEnabled: PropTypes.bool
    };

    static defaultProps = {
        schema: {},
        value: []
    };

    colorPicker = React.createRef();

    state = {
        isSorting: false,
        editableColorIndex: null
    };

    handlePickerOpen = i => () => {
        const { outsideClickEnabled } = this.props;

        this.setState({
            editableColorIndex: i
        }, () => {
            if (!outsideClickEnabled) {
                this.props.turnOnClickOutside(this.colorPicker.current, this.handlePickerClose);
            }
        });
    };

    handlePickerClose = () => {
        this.setState({
            editableColorIndex: null
        });
    };

    handleColorAdd = () => {
        const { value } = this.props;

        this.props.onChange([
            ...value,
            { hex: DEFAULT_COLOR, name: '', id: uniqid() }
        ]);
    };

    handleColorChange = i => color => {
        const { value } = this.props;
        const newValue = [...value];

        newValue[i].hex = color.hex;

        this.props.onChange(newValue);
    };

    handleNameChange = i => event => {
        event.preventDefault();

        const { value } = this.props;
        const newValue = [...value];

        newValue[i].name = event.target.value;

        this.props.onChange(newValue);
    };

    handleColorDelete = i => () => {
        const { value } = this.props;

        this.props.onChange(remove(i, 1, value));
    };

    onDragStart = () => {
        this.setState({
            isSorting: true
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value } = this.props;

        this.props.onChange(arrayMove(value, oldIndex, newIndex));
        this.setState({
            isSorting: false
        });
    };

    render () {
        const { classes, value, schema } = this.props;
        const { isSorting, editableColorIndex } = this.state;

        return <div>
            <Colors
                axis='xy'
                classes={classes}
                colors={value}
                onPickerOpen={this.handlePickerOpen}
                onColorDelete={this.handleColorDelete}
                onNameChange={this.handleNameChange}
                onSortStart={this.onDragStart}
                onSortEnd={this.onDragEnd}
                isSorting={isSorting}
                useDragHandle
                schema={schema}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleColorAdd}>
                    <AddIcon />
                </Fab>
            </div>
            {!isNull(editableColorIndex) && <div >
                <SketchPicker ref={this.colorPicker} color={value[editableColorIndex]} onChange={ this.handleColorChange(editableColorIndex) }/>
            </div>}
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldColors);
