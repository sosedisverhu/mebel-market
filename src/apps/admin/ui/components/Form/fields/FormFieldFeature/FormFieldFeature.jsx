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

import FormFieldFeatureSelect from '../FormFieldFeatureSelect/FormFieldFeatureSelect';

import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import { FEATURE_TYPES } from '../../../../../constants/constants';

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
        flexDirection: 'column'
    },
    featureField: {
        width: '100%'
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
    typeBlock: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    icon: {
        maxWidth: '40px',
        height: 'auto'
    }
};

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> reorder </ReorderIcon>
));

const Feature =
    SortableElement(({ rowIndex, feature, handleFeatureDelete, handleFeatureChange, classes, schema }) => (
        <FormGroup className={classes.feature} row>
            <ButtonSortable imageClassName={classes.buttonSortable}/>
            <div className={classes.featureGroup}>
                <div className={classes.typeBlock}>
                    <FormFieldFeatureSelect
                        options={FEATURE_TYPES}
                        onChange={handleFeatureChange('featureType', rowIndex)}
                        value={FEATURE_TYPES[feature.featureType]}
                        schema={{ placeholder: 'Тип' }}
                    />
                    {feature.featureType && <img className={classes.icon} src={FEATURE_TYPES[+feature.featureType].photo} alt="photo"/>}
                </div>
                <TextField
                    className={classes.featureField}
                    label={schema.name || ''}
                    value={feature.name || ''}
                    onChange={handleFeatureChange('name', rowIndex)}
                    margin='normal'
                    variant='outlined'
                />
                <TextField
                    className={classes.featureField}
                    label={schema.value}
                    value={feature.value || ''}
                    onChange={handleFeatureChange('value', rowIndex)}
                    margin='normal'
                    variant='outlined'
                    multiline={true}
                />
            </div>
            <IconButton aria-label='Delete' onClick={handleFeatureDelete(rowIndex)}>
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

class FormFieldFeature extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.array,
        onChange: PropTypes.func,
        validationMessage: PropTypes.string,
        schema: PropTypes.object
    };

    static defaultProps = {
        value: [],
        onChange: noop,
        validationMessage: '',
        schema: {},
        sizeIndex: 0
    };

    state = {
        isSorting: false
    };

    handleFeatureAdd = () => {
        const { value } = this.props;

        this.props.onChange([
            ...value,
            {
                name: '',
                value: '',
                featureType: '',
                id: uniqid()
            }
        ]);
    };

    handleFeatureChange = (prop, i) => event => {
        const { value } = this.props;
        console.log(event);
        if (prop === 'featureType') {
            value[i][prop] = event.value;
        } else {
            value[i][prop] = event.target.value;
        }

        this.props.onChange(value);
    };

    handleFeatureDelete = i => () => {
        const { value } = this.props;

        this.props.onChange(remove(i, 1, value));
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value } = this.props;

        this.props.onChange(arrayMove(value, oldIndex, newIndex));
    };

    render () {
        const { classes, value, validationMessage, schema } = this.props;

        return <div>
            <div>
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
                />
            </div>
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleFeatureAdd}>
                    <AddIcon/>
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldFeature);
