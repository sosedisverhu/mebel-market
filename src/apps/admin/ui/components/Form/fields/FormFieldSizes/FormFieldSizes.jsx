import React, { Component } from 'react';
import PropTypes from 'prop-types';

import uniqid from 'uniqid';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import ReorderIcon from '@material-ui/icons/Reorder';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import remove from '@tinkoff/utils/array/remove';
import noop from '@tinkoff/utils/function/noop';
import arrayMove from '../../../../../utils/arrayMove';

import FormFieldColors from '../FormFieldColors/FormFieldColors';
import FormFieldSizeFeatures from '../FormFieldSizeFeatures/FormFieldSizeFeatures';
import FormFieldTableSizes from '../FormFieldTableSizes/FormFieldTableSizes';
import classNames from 'classnames';
import FormFieldButton from "../FormFieldButton/FormFieldButton";

const materialStyles = {
    size: {
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
    sizeGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        width: '100%',
        flexWrap: 'wrap',
        '@media (max-width:600px)': {
            flexDirection: 'column'
        }
    },
    fieldsGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        flexWrap: 'wrap'
    },
    sizeField: {
        width: 'calc(33% - 20px)',
        '@media (max-width:600px)': {
            width: '100%'
        }
    },
    sizeFieldLong: {
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
    buttonSortableTab: {
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
    sizeDelButton: {
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
    },
    duplicateBtnWrap: {
        marginBottom: '30px'
    }
};

function TabPanel (props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const ButtonSortable = SortableHandle(({ imageClassName }) => (
    <ReorderIcon className={imageClassName}> reorder </ReorderIcon>
));

const Size = ({
    rowIndex,
    size,
    sizes,
    handleSizeChange,
    classes,
    onChange,
    onChangeCustomField,
    values,
    langs,
    onClickDuplicateOptions
}) => (
    <div className={classes.size}>
        <div className={classes.fieldsGroup}>
            <TextField
                className={classNames(classes.sizeField, classes.sizeFieldLong)}
                label='Размер'
                value={size.name || ''}
                onChange={handleSizeChange('name', rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classNames(classes.sizeField, classes.sizeFieldLong)}
                label='Артикул'
                value={size.article || ''}
                onChange={handleSizeChange('article', rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.sizeField}
                label='Цена'
                value={size.price || ''}
                type='number'
                onChange={handleSizeChange('price', rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.sizeField}
                label='Скидочная цена'
                value={size.discountPrice || ''}
                type='number'
                onChange={handleSizeChange('discountPrice', rowIndex)}
                margin='normal'
                variant='outlined'
            />
            <TextField
                className={classes.sizeField}
                label='Размер скидки (%)'
                value={size.discount || ''}
                type='number'
                onChange={handleSizeChange('discount', rowIndex)}
                margin='normal'
                variant='outlined'
            />
        </div>
        <h6 className={classes.h6}>Дополнительные опции</h6>
        <FormFieldSizeFeatures
            value={size.features}
            onChange={onChange}
            sizes={sizes}
            sizeIndex={rowIndex}
            schema={{
                name: 'Название услуги',
                value: 'Цена'
            }}
        />
        {!!size.features.length && <div className={classes.duplicateBtnWrap}>
            <FormFieldButton schema={{ label: "Дублировать 'Дополнительные опции' для всех размеров", onClick: () => onClickDuplicateOptions(size.id) }}/>
        </div>}
        <h6 className={classes.h6}>Таблица размеров</h6>
        <FormFieldTableSizes
            value={size.tableSizes}
            onChange={onChange}
            sizes={sizes}
            sizeIndex={rowIndex}
            schema={{
                name: 'Свойство',
                value: 'Размер'
            }}
        />
        <FormFieldColors
            value={size.colors}
            sizes={sizes}
            sizeIndex={rowIndex}
            onChange={onChange}
            onChangeCustomField={onChangeCustomField}
            values={values}
            langs={langs}
        />
    </div>
);

Size.propTypes = {
    rowIndex: PropTypes.number.isRequired,
    size: PropTypes.object.isRequired,
    sizes: PropTypes.array.isRequired,
    handleSizeChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeCustomField: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    langs: PropTypes.array.isRequired
};

const SortableTab = SortableElement(({
    label,
    handleSizeDelete,
    tabProps,
    handleTabChange,
    index,
    classes
}) => (
    <div className={classes.sortableTab}>
        <ButtonSortable imageClassName={classes.buttonSortableTab}/>
        <Tab classes={{ labelContainer: classes.labelContainer, root: classes.tabRoot }} onClick={() => handleTabChange(index)} label={label} {...tabProps}/>
        <IconButton aria-label='Delete' className={classes.sizeDelButton} onClick={handleSizeDelete(index)}>
            <DeleteIcon/>
        </IconButton>
    </div>
));

const Sizes = SortableContainer(({ sizes, classes, tabsValue, handleTabsChange, ...rest }) =>
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
                {sizes.map((size, i) => {
                    return <SortableTab
                        handleTabChange={handleTabsChange}
                        key={i} index={i}
                        label={size.name || 'Без названия'}
                        tabProps={tabProps(i)}
                        classes={classes}
                        {...rest} />;
                })}
            </Tabs>
        </AppBar>
        {sizes.map((size, i) => <TabPanel value={tabsValue} key={i} index={i}>
            <Size key={i} sizes={sizes} rowIndex={i} size={size} {...rest} classes={classes}/>
        </TabPanel>)}
    </div>
);

class FormFieldSizes extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.array,
        values: PropTypes.object,
        langs: PropTypes.array,
        onChange: PropTypes.func,
        onChangeCustomField: PropTypes.func,
        validationMessage: PropTypes.string
    };

    static defaultProps = {
        value: [],
        onChange: noop,
        validationMessage: ''
    };

    state = {
        isSorting: false,
        tabsValue: 0
    };

    handleSizeAdd = () => {
        const { value } = this.props;

        this.props.onChange([
            ...value,
            { name: '', colors: [], features: [], id: uniqid() }
        ]);
    };

    handleSizeChange = (prop, i) => event => {
        const { value } = this.props;

        value[i][prop] = event.target.value;

        this.props.onChange(value);
    };

    handleSizeDelete = i => () => {
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

    handleClickDuplicateOptions = (currentSizeId) => {
        const { values, langs } = this.props;

        for (const lang in langs) {
            const sizes = values[`${langs[lang]}_sizes`];
            const currentSize = sizes.find(size => size.id === currentSizeId);

            if (!currentSize) return;

            sizes.forEach(size => {
                if (size.id !== currentSizeId) {
                    size.features.push(...currentSize.features);
                }
            });

            this.props.onChangeCustomField(sizes, `${lang}_sizes`);
        }
    };

    handleTabsChange = (newTabsValue) => this.setState({ tabsValue: newTabsValue });

    render () {
        const { classes, value, validationMessage, values, langs } = this.props;
        const { tabsValue, isSorting } = this.state;
        return <div>
            {!!value.length && <Sizes
                axis='x'
                sizes={value}
                handleSizeDelete={this.handleSizeDelete}
                handleSizeChange={this.handleSizeChange}
                onChange={this.props.onChange}
                onChangeCustomField={this.props.onChangeCustomField}
                onDragStart={this.onDragStart}
                onSortEnd={this.onDragEnd}
                isSorting={isSorting}
                classes={classes}
                useDragHandle
                validationMessage={validationMessage}
                handleTabsChange={this.handleTabsChange}
                tabsValue={tabsValue}
                values={values}
                langs={langs}
                onClickDuplicateOptions={this.handleClickDuplicateOptions}
            />}
            <div className={classes.addButton}>
                <Fab color='primary' size='small' onClick={this.handleSizeAdd}>
                    <AddIcon />
                </Fab>
            </div>
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldSizes);
