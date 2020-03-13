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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import remove from '@tinkoff/utils/array/remove';
import noop from '@tinkoff/utils/function/noop';
import isEmpty from '@tinkoff/utils/is/empty';
import arrayMove from '../../../../../utils/arrayMove';

import FormFieldFiles from '../FormFieldFiles/FormFieldFiles';
import FormFieldButton from '../FormFieldButton/FormFieldButton';

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
    },
    checkbox: {
        width: '100%',
        '& input': {
            zIndex: '-1'
        }
    },
    duplicateBtnWrap: {
        marginBottom: '20px'
    },
    sizesTabsWrap: {
        marginTop: '20px'
    },
    sortableTab: {
        display: 'flex',
        alignItems: 'center',
        zIndex: '9998',
        border: '1px solid #D8D8D8',
        padding: '0 8px',
        borderRadius: '4px 4px 0 0',
        background: '#F9F9F9'
    },
    buttonSortableTab: {
        cursor: 'pointer'
    },
    colorDelButton: {
        padding: '7px'
    },
    indicator: {
        zIndex: 9999
    },
    labelContainer: {
        padding: '6px 0 6px 6px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    tabRoot: {
        maxWidth: '230px',

        '@media (max-width:960px)': {
            maxWidth: '150px',
            fontSize: '0.8rem'
        }
    }
};

function TabPanel (props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`colors-tabpanel-${index}`}
            aria-labelledby={`colors-tab-${index}`}
            {...other}
        >
            {value === index && <div>{children}</div>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function tabProps (index) {
    return {
        id: `colors-tab-${index}`,
        'aria-controls': `colors-tabpanel-${index}`
    };
}

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> reorder </ReorderIcon>
));

const SortableTab = SortableElement(({
    sizeIndex,
    rowIndex,
    label,
    handleColorDelete,
    tabProps,
    handleTabChange,
    index,
    classes
}) => (
    <div className={classes.sortableTab}>
        <ButtonSortable imageClassName={classes.buttonSortableTab}/>
        <Tab classes={{ labelContainer: classes.labelContainer, root: classes.tabRoot }} onClick={() => handleTabChange(index)} label={label} {...tabProps}/>
        <IconButton aria-label='Delete' className={classes.colorDelButton} onClick={handleColorDelete(sizeIndex, rowIndex)}>
            <DeleteIcon/>
        </IconButton>
    </div>
));

const Color = SortableElement(({
    rowIndex,
    sizeIndex,
    color,
    handleColorDelete,
    handleColorChange,
    handleColorCheckboxChange,
    classes,
    handleClickDuplicate
}) => (
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
                value={!isEmpty(color.file) ? { files: [color.file] } : {}}/>
            <div className={classes.checkbox}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={color.action || ''}
                            onChange={handleColorCheckboxChange('action', sizeIndex, rowIndex)}
                            color='primary'
                        />
                    }
                    label="Акционный товар"
                />
            </div>
            <div className={classes.duplicateBtnWrap}>
                <FormFieldButton
                    schema={{ label: 'Дублировать для всех размеров', onClick: () => handleClickDuplicate(color.id) }}/>
            </div>
        </div>
        <IconButton aria-label='Delete' className={classes.colorDelButton}
            onClick={handleColorDelete(sizeIndex, rowIndex)}>
            <DeleteIcon/>
        </IconButton>
    </FormGroup>
));

const Colors = SortableContainer(({ colors, classes, tabsValue, handleTabsChange, ...rest }) =>
    <div className={classes.sizesTabsWrap}>
        <AppBar position="static" color="default">
            <Tabs
                value={tabsValue}
                onChange={(event, newTabsValue) => handleTabsChange(newTabsValue)}
                indicatorColor="primary"
                classes={{ indicator: classes.indicator }}
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto" >
                {colors.map((color, i) => {
                    return <SortableTab
                        handleTabChange={handleTabsChange}
                        key={i} index={i}
                        label={color.name || 'Без названия'}
                        tabProps={tabProps(i)}
                        classes={classes}
                        {...rest} />;
                })}
            </Tabs>
        </AppBar>
        {colors.map((color, i) => <TabPanel value={tabsValue} key={i} index={i}>
            <Color key={i} index={i} rowIndex={i} color={color} {...rest} classes={classes}/>
        </TabPanel>)}

        {/* {colors.map((color, i) => <Color key={i} index={i} rowIndex={i} color={color} {...rest} classes={classes}/>)} */}
    </div>
);

class FormFieldColors extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.array,
        onChange: PropTypes.func,
        onChangeCustomField: PropTypes.func,
        validationMessage: PropTypes.string,
        sizeIndex: PropTypes.number.isRequired,
        sizes: PropTypes.array.isRequired,
        values: PropTypes.object,
        langs: PropTypes.array
    };

    static defaultProps = {
        value: [],
        onChange: noop,
        validationMessage: '',
        sizeIndex: 0,
        sizes: []
    };

    state = {
        tabsValue: 0
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

    handleColorCheckboxChange = (prop, sizeIndex, colorIndex) => (event, checked) => {
        event.preventDefault();
        const { sizes } = this.props;
        sizes[sizeIndex].colors[colorIndex][prop] = checked;
        this.props.onChange(sizes);
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

    handleClickDuplicate = (duplicateColorId) => {
        const { values, langs } = this.props;
        const newId = uniqid();

        for (const lang in langs) {
            const sizes = values[`${langs[lang]}_sizes`];
            let duplicateColor = null;

            sizes.forEach(size => {
                size.colors.forEach(color => {
                    if (color.id === duplicateColorId) duplicateColor = color;
                });
            });

            if (!duplicateColor) return;

            sizes.forEach(size => {
                if (!size.colors.find(color => color.article === duplicateColor.article)) {
                    size.colors.push({
                        ...duplicateColor,
                        id: newId
                    });
                }
            });

            this.props.onChangeCustomField(sizes, `${lang}_sizes`);
        }
    };

    handleTabsChange = (newTabsValue) => this.setState({ tabsValue: newTabsValue });

    render () {
        const { classes, value, validationMessage, sizeIndex } = this.props;
        const { tabsValue } = this.state;

        return <div>
            <h6 className={classes.h6}>Цвета товара</h6>
            {!!value.length && <Colors
                axis='x'
                colors={value}
                handleColorDelete={this.handleColorDelete}
                handleColorChange={this.handleColorChange}
                handleColorCheckboxChange={this.handleColorCheckboxChange}
                onSortEnd={this.onDragEnd}
                classes={classes}
                sizeIndex={sizeIndex}
                useDragHandle
                validationMessage={validationMessage}
                handleClickDuplicate={this.handleClickDuplicate}
                handleTabsChange={this.handleTabsChange}
                tabsValue={tabsValue}
            />}
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleColorAdd(sizeIndex)}>
                    <AddIcon />
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldColors);
