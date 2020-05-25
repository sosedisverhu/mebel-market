import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

import pick from '@tinkoff/utils/object/pick';

const SLIDE_VALUES = ['name','link', 'path', 'newTab'];

const materialStyles = theme => ({
    uploadInput: {
        display: 'none'
    },
    upload: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing.unit
    },
    uploadIcon: {
        marginLeft: theme.spacing.unit
    },
    imageWrapper: {
        marginTop: '20px',
        width: '100%'
    },
    image: {
        width: '100%'
    },
    warning: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px'
    },
    warningIcon: {
        color: '#ffae42',
        marginRight: '10px'
    },
    errorIcon: {
        color: '#f44336',
        marginRight: '10px'
    },
    warningText: {
        fontSize: '16px'
    },
    fileImageError: {
        outline: 'solid 4px #f44336'
    }
});

class MainSlideForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        editableSlideInfo: PropTypes.object.isRequired,
        onDone: PropTypes.func.isRequired
    };

    constructor (...args) {
        super(...args);

        const { editableSlideInfo } = this.props;
        const slide = {
            ...pick(SLIDE_VALUES, editableSlideInfo.slide)
        };

        this.oldSlidePath = slide.path;

        this.state = {
            slide: slide,
            index: editableSlideInfo.index,
            isWrongDimensions: false
        };
    }

    handleChange = prop => event => {
        this.setState({
            slide: {
                ...this.state.slide,
                [prop]: event.target.value
            }
        });
    };

    handleCheckboxChange = (event, checked) => {
        this.setState({
            slide: {
                ...this.state.slide,
                newTab: checked
            }
        });
    };

    handleFileUpload = event => {
        this.setState({
            slide: {
                ...this.state.slide,
                content: event.target.files[0],
                path: URL.createObjectURL(event.target.files[0]),
                oldSlidePath: this.oldSlidePath
            }
        });

        event.target.value = '';
    };

    handleSubmit = event => {
        event.preventDefault();

        const { slide, index } = this.state;

        this.props.onDone({
            slide,
            index
        });
    };

    render () {
        const { classes } = this.props;
        const { slide, isWrongDimensions } = this.state;

        return <form onSubmit={this.handleSubmit}>
            <Typography variant='h5'>Редактирование слайда</Typography>
            <div className={classes.imageWrapper}>
                <img
                    className={classNames(classes.image, { [classes.fileImageError]: isWrongDimensions })}
                    src={slide.path}
                    alt={slide.title}
                />
            </div>
            <FormControl margin='normal'>
                <input
                    className={classes.uploadInput}
                    id='editUploadInput'
                    type='file'
                    accept='image/*'
                    onChange={this.handleFileUpload}
                />
                <label htmlFor='editUploadInput'>
                    <Button variant='contained' component='span' color='default'>
                        Изменить фотографию
                        <CloudUploadIcon className={classes.uploadIcon} />
                    </Button>
                </label>
            </FormControl>
            <TextField
                label='Имя'
                value={slide.name}
                onChange={this.handleChange('name')}
                margin='normal'
                variant='outlined'
                fullWidth
            />
            <TextField
                label='Ссылка'
                value={slide.link}
                onChange={this.handleChange('link')}
                margin='normal'
                variant='outlined'
                fullWidth
            />
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={slide.newTab}
                            onChange={this.handleCheckboxChange}
                            color='primary'
                        />
                    }
                    label='Открывать в новой вкладке'
                />
            </div>
            <FormControl margin='normal'>
                <Button variant='contained' color='primary' type='submit'>
                    Сохранить
                </Button>
            </FormControl>
        </form>;
    }
}

export default withStyles(materialStyles)(MainSlideForm);
