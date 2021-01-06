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
    feature: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 9999
    },
    features: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '210px'
    },
    featureGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        '@media (max-width:780px)': {
            flexDirection: 'column'
        }
    },
    featureField: {
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

const Feature =
    SortableElement(({ rowIndex, feature, handleFeatureDelete, sizeIndex, handleFeatureChange, classes, schema }) => (
        <FormGroup className={classes.feature} row>
            <ButtonSortable imageClassName={classes.buttonSortable}/>
            <div className={classes.featureGroup}>
                <TextField
                    className={classes.featureField}
                    label={schema.name || ''}
                    value={feature.name || ''}
                    onChange={handleFeatureChange('name', sizeIndex, rowIndex)}
                    margin='normal'
                    variant='outlined'
                />
                <TextField
                    className={classes.featureField}
                    label={schema.value}
                    value={feature.value || ''}
                    onChange={handleFeatureChange('value', sizeIndex, rowIndex)}
                    type='number'
                    margin='normal'
                    variant='outlined'
                />
            </div>
            <IconButton aria-label='Delete' onClick={handleFeatureDelete(sizeIndex, rowIndex)}>
                <DeleteIcon/>
            </IconButton>
        </FormGroup>
    ));

const Features = SortableContainer(({ features, classes, ...rest }) =>
    <div>
        {features.map((feature, i) => {
            return <Feature key={i}
                index={i}
                rowIndex={i}
                feature={feature}
                {...rest}
                classes={classes}
            />;
        })}
    </div>
);

class FormFieldSizeFeatures extends Component {
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

    handleFeatureAdd = i => () => {
        const { sizes } = this.props;

        if (!sizes[i].features) sizes[i].features = [];

        sizes[i].features = [
            ...sizes[i].features,
            {
                id: uniqid(),
                name: '',
                value: ''
            }];

        this.props.onChange(sizes);
    };

    handleFeatureChange = (prop, sizeIndex, featureIndex) => event => {
        const { sizes, onChange } = this.props;

        sizes[sizeIndex].features[featureIndex][prop] = event.target.value;
        onChange(sizes);
    };

    handleFeatureDelete = (sizeIndex, featureIndex) => () => {
        const { sizes } = this.props;

        sizes[sizeIndex].features = remove(featureIndex, 1, sizes[sizeIndex].features);
        this.props.onChange(sizes);
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value, sizes, sizeIndex } = this.props;

        sizes[sizeIndex].features = arrayMove(value, oldIndex, newIndex);
        this.props.onChange(sizes);
    };

    render () {
        const { classes, value, validationMessage, schema, sizeIndex } = this.props;

        return <div>
            <Features
                axis='xy'
                features={value}
                handleFeatureDelete={this.handleFeatureDelete}
                handleFeatureChange={this.handleFeatureChange}
                onSortEnd={this.onDragEnd}
                classes={classes}
                useDragHandle
                validationMessage={validationMessage}
                schema={schema}
                sizeIndex={sizeIndex}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleFeatureAdd(sizeIndex)}>
                    <AddIcon/>
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldSizeFeatures);
