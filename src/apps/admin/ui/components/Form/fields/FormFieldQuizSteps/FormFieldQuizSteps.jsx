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
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import remove from '@tinkoff/utils/array/remove';
import noop from '@tinkoff/utils/function/noop';
import arrayMove from '../../../../../utils/arrayMove';

const materialStyles = {
    step: {
        flexWrap: 'nowrap',
        alignItems: 'center',
        zIndex: 9999
    },
    steps: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '210px'
    },
    stepGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column'
    },
    stepField: {
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
        paddingRight: '80px',
        marginTop: '20px'
    },
    stepGroup: {
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
    stepFields: {
        display: 'flex',
        marginTop: '20px',
        paddingLeft: '40px',
        paddingRight: '40px',
        alignItems: 'center',
        borderRadius: '4px',
        width: '100%',
        backgroundColor: '#F3F3F3',
        flexDirection: 'column',
        '@media (max-width: 600px)': {
            paddingLeft: '10px',
            paddingRight: '10px'
        },
        '@media (max-width: 425px)': {
            display: 'block'
        }
    },
    optionsWrap: {
        width: '100%',
        display: 'flex',
        padding: '20px',
        borderRadius: '4px',
        flexDirection: 'column',
        background: '#dcd9d9',
        margin: '20px 0 30px 0'
    },
    options: {
        alignSelf: 'center'
    },
    optionAdd: {
        'paddingTop': '20px',
        'textAlign': 'end'
    },
    optionField: {
        width: '100%',
        display: 'flex',
        padding: '20px',
        borderRadius: '4px',
        flexDirection: 'column'
    }
};

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> reorder </ReorderIcon>
));

// Options Start
const Option =
    SortableElement(({ stepIndex, optionIndex, option, validationMessage, handleOptionDelete, handleOptionChange, classes, schema  }) => (
        <FormGroup className={classes.step} row>
            <div className={classes.stepGroup}>
                <ButtonSortable imageClassName={classes.buttonSortable} />
                <div className={classes.optionField}>
                    <TextField
                        className={classes.stepField}
                        label={schema.labelInput || ''}
                        value={option.labelInput || ''}
                        onChange={handleOptionChange(stepIndex, optionIndex, 'name')}
                        margin='normal'
                        variant='outlined'
                        error={!!validationMessage}
                    />
                    <div>Filed Add Img</div>
                </div>
                <IconButton aria-label='Delete' onClick={handleOptionDelete(stepIndex, optionIndex)}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </FormGroup>
    ));

const Options = SortableContainer(({ options, classes, ...rest }) =>
    <div>
        {options.map((option, i) => {
            return <Option key={i}
                index={i}
                optionIndex={i}                
                option={option}
                {...rest}
                classes={classes}
            />;
        })}
    </div>
);
// Options End

const Step =
    SortableElement(({ stepIndex, step, validationMessage, handleStepDelete, handleStepChange, handleOptionAdd, onDragEnd, handleOptionChange, handleOptionDelete, classes, schema }) => (
        <FormGroup className={classes.step} row>
            <div className={classes.stepGroup}>
                <ButtonSortable imageClassName={classes.buttonSortable} />
                <div className={classes.stepFields}>
                    <TextField
                        className={classes.stepField}
                        label={schema.name || ''}
                        value={step.name || ''}
                        onChange={handleStepChange('name', stepIndex)}
                        margin='normal'
                        variant='outlined'
                        error={!!validationMessage}
                    />
                    <div className={classes.optionsWrap}>
                        <Typography variant={schema.variant2}>{schema.name2}</Typography>
                        <Options
                            axis='xy'
                            options={step.options}
                            handleOptionDelete={handleOptionDelete}
                            handleOptionChange={handleOptionChange}
                            onSortEnd={onDragEnd}
                            classes={classes}
                            useDragHandle
                            validationMessage={validationMessage}
                            schema={schema}
                            stepIndex={stepIndex}
                        />
                        <div className={classes.optionAdd}>
                            <Fab color='primary' size='small' onClick={handleOptionAdd(stepIndex)}>
                                <AddIcon />
                            </Fab>
                        </div>
                    </div>
                </div>
                <IconButton aria-label='Delete' onClick={handleStepDelete(stepIndex)}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </FormGroup>
    ));

const Steps = SortableContainer(({ steps, classes, ...rest }) =>
    <div>
        {steps.map((step, i) => {
            return <Step key={i}
                index={i}
                stepIndex={i}
                step={step}
                {...rest}
                classes={classes}
            />;
        })}
    </div>
);

class FormFieldQuizSteps extends Component {
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
        schema: {}
    };

    state = {
        isSorting: false
    };

    handleStepAdd = () => {
        const { value } = this.props;

        this.props.onChange([
            ...value,
            {
                name: '',
                id: uniqid(),
                options: []
            }
        ]);
    };

    handleStepChange = (prop, i) => event => {
        const { value } = this.props;

        value[i][prop] = event.target.value;

        this.props.onChange(value);
    };

    handleStepDelete = i => () => {
        const { value } = this.props;

        this.props.onChange(remove(i, 1, value));
    };

    handleOptionAdd = i => () => {
        const { value } = this.props;

        value[i].options = [
            ...value[i].options,
            {
                id: uniqid(),
                name: '',
                img: ''
            }];

        this.props.onChange(value);
    };

    handleOptionChange = (stepIndex, optionIndex, prop) => event => {
        const { value } = this.props;

        value[stepIndex].options[optionIndex][prop] = event.target.value;

        this.props.onChange(value);
    };

    handleOptionDelete = (stepIndex, optionIndex) => () => {
        const { value } = this.props;

        value[stepIndex].options = remove(optionIndex, 1, value[stepIndex].options);

        this.props.onChange(value);
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        const { value } = this.props;

        this.props.onChange(arrayMove(value, oldIndex, newIndex));
    };

    render() {
        const { classes, value, validationMessage, schema } = this.props;

        console.log('this.props', this.props);

        return <div>
            <Steps
                axis='xy'
                steps={value}
                handleStepDelete={this.handleStepDelete}
                handleStepChange={this.handleStepChange}
                handleOptionDelete={this.handleOptionDelete}
                handleOptionChange={this.handleOptionChange}
                handleOptionAdd={this.handleOptionAdd}
                onSortEnd={this.onDragEnd}
                classes={classes}
                useDragHandle
                validationMessage={validationMessage}
                schema={schema}
            />
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleStepAdd}>
                    <AddIcon />
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldQuizSteps);
