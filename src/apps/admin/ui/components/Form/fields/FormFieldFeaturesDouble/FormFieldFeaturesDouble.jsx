import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        width: '100%'
    },
    featureField: {
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

const Feature = SortableElement(({ index, feature, validationMessage, handleFeatureDelete, handleFeatureChange, classes }) => (
    <FormGroup className={classes.feature} row>
        <ButtonSortable imageClassName={classes.buttonSortable}/>
        <div className={classes.featureGroup}>
            <TextField
                className={classes.featureField}
                label='Свойство'
                value={feature.prop}
                onChange={handleFeatureChange('prop', index)}
                margin='normal'
                variant='outlined'
                error={!!validationMessage}
            />
            <TextField
                className={classes.featureField}
                label='Значение'
                value={feature.value}
                onChange={handleFeatureChange('value', index)}
                margin='normal'
                variant='outlined'
                error={!!validationMessage}
            />
        </div>
        <IconButton aria-label='Delete' className={classes.featureDelButton} onClick={handleFeatureDelete(index)}>
            <DeleteIcon />
        </IconButton>
    </FormGroup>
));

const Features = SortableContainer(({ features, classes, ...rest }) =>
    <div>
        {features.map((feature, i) => <Feature key={i} index={i} feature={feature} {...rest} classes={classes}/>)}
    </div>
);

class FormFieldFeaturesDouble extends Component {
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

    handleFeatureAdd = () => {
        const { value } = this.props;

        this.props.onChange([
            ...value,
            { prop: '', value: '' }
        ]);
    };

    handleFeatureChange = (prop, i) => event => {
        const { value } = this.props;

        value[i][prop] = event.target.value;

        this.props.onChange(value);
    };

    handleFeatureDelete = i => () => {
        const { value } = this.props;

        this.props.onChange(remove(i, 1, value));
    };

    render () {
        const { classes, value, validationMessage } = this.props;

        return <div>
            <Features
                axis='xy'
                features={value}
                handleFeatureDelete={this.handleFeatureDelete}
                handleFeatureChange={this.handleFeatureChange}
                classes={classes}
                useDragHandle
                validationMessage={validationMessage}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleFeatureAdd}>
                    <AddIcon />
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldFeaturesDouble);
