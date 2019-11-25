import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import map from '@tinkoff/utils/array/map';
import remove from '@tinkoff/utils/array/remove';
import arrayMove from '../../../../../utils/arrayMove';
import find from '@tinkoff/utils/array/find';

const checkWrongDimensions = slides => {
    const wrongFile = find(file => file.wrongDimensions, slides);

    return !!wrongFile;
};

const materialStyles = theme => ({
    uploadInput: {
        display: 'none'
    },
    upload: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing.unit,
        '@media (max-width: 425px)': {
            display: 'block'
        }
    },
    uploadIcon: {
        marginLeft: theme.spacing.unit
    },
    filesList: {
        overflow: 'auto'
    },
    fileItem: {
        position: 'relative',
        userSelect: 'none',
        padding: '16px',
        width: '200px',
        float: 'left',
        zIndex: '9999',
        cursor: 'grab',
        '&:hover $fileItemDeleteContainer': {
            visibility: 'visible'
        },
        '@media (max-width: 500px)': {
            width: '100%'
        }
    },
    fileItemSorting: {
        '&:hover $fileItemDeleteContainer': {
            visibility: 'hidden'
        }
    },
    fileName: {
        marginBottom: '20px',
        '@media (max-width: 500px)': {
            width: '100%'
        }
    },
    fileImage: {
        width: '100%'
    },
    fileImageError: {
        outline: 'solid 4px #f44336'
    },
    fileItemDeleteContainer: {
        position: 'absolute',
        right: '0',
        top: '0',
        visibility: 'hidden',
        background: 'white',
        borderRadius: '100%'
    },
    warning: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px',
        '@media (max-width: 425px)': {
            marginLeft: '0',
            marginTop: '10px'
        }
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
    }
});

const Image = SortableHandle(({ imageClassName, src, onLoad }) => (
    <img className={imageClassName} src={src} onLoad={onLoad} />
));

const FilePreview = SortableElement(({ file, fileIndex, classes, onFileDelete, isSorting, onFileLoad, schema, onNameChange }) =>
    <div className={classNames(classes.fileItem, {
        [classes.fileItemSorting]: isSorting
    })}>
        { schema.name && <TextField
            label='Название'
            className={classes.fileName}
            value={file.name || ''}
            onChange={onNameChange(fileIndex)}
            margin='normal'
            variant='outlined'
            type='text'
        /> }
        <div className={classes.fileItemDeleteContainer}>
            <IconButton
                aria-label='Delete'
                onClick={onFileDelete(fileIndex)}
            >
                <DeleteIcon />
            </IconButton>
        </div>
        <Image src={file.path} imageClassName={classNames(classes.fileImage, {
            [classes.fileImageError]: file.wrongDimensions
        })} onLoad={onFileLoad(fileIndex)} />
    </div>);

const FilesPreviews = SortableContainer(({ files, classes, ...rest }) => {
    return (
        <div className={classes.filesList}>
            {files.map((file, i) => <FilePreview
                key={i}
                index={i}
                fileIndex={i}
                file={file}
                classes={classes}
                {...rest}
            />)}
        </div>
    );
});

class FormFieldFiles extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        value: PropTypes.object,
        schema: PropTypes.object,
        onChange: PropTypes.func,
        name: PropTypes.string
    };

    static defaultProps = {
        value: {},
        schema: {},
        name: ''
    };

    constructor (...args) {
        super(...args);

        const { value, schema } = this.props;

        this.removedFiles = [];

        this.state = {
            files: map(file => ({
                path: file.path || '/wrong-path',
                name: file.name || ''
            }), value.files),
            isSorting: false
        };
        this.requredFileWidth = schema.fileWidth;
        this.requredFileHeight = schema.fileHeight;
    }

    handleFilesUpload = (event) => {
        const newFiles = map(file => ({
            content: file,
            path: URL.createObjectURL(file)
        }), event.target.files);
        let files = [...this.state.files, ...newFiles];
        const { schema } = this.props;

        if (schema.max) {
            const removedFiles = files.slice(0, files.length - schema.max);

            files = files.slice(files.length - schema.max);

            removedFiles.forEach(file => {
                if (file.path && !file.content) {
                    this.removedFiles.push(file);
                }
            });
        }

        this.setState({
            files
        }, this.handleFilesChange);

        event.target.value = '';
    };

    handleFileLoad = i => (event) => {
        if (this.requredFileWidth && event.target.naturalWidth !== this.requredFileWidth ||
            this.requredFileHeight && event.target.naturalHeight !== this.requredFileHeight) {
            const { files } = this.state;

            files[i].wrongDimensions = true;

            this.setState({
                files
            });
        }
    };

    onDragStart = () => {
        this.setState({
            isSorting: true
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            files: arrayMove(this.state.files, oldIndex, newIndex),
            isSorting: false
        }, this.handleFilesChange);
    };

    handleFileDelete = i => () => {
        const { files } = this.state;

        if (files[i].path && !files[i].content) {
            this.removedFiles.push(files[i]);
        }

        this.setState({
            files: remove(i, 1, files)
        }, this.handleFilesChange);
    };

    handleNameChange = i => event => {
        const { files } = this.state;
        const newFiles = [...files];

        newFiles[i].name = event.target.value;

        this.setState({
            files: newFiles
        }, this.handleFilesChange);
    };

    handleFilesChange = () => {
        const { files } = this.state;

        this.props.onChange({
            files,
            removedFiles: this.removedFiles
        });
    };

    renderDimensionsRequires = () => {
        const { classes } = this.props;
        const { files } = this.state;
        const isWrongDimensions = checkWrongDimensions(files);

        switch (true) {
        case !!this.requredFileHeight && !!this.requredFileWidth:
            return <div className={classes.warning}>
                <WarningIcon className={classNames(classes.warningIcon, {
                    [classes.errorIcon]: isWrongDimensions
                })} color={isWrongDimensions ? 'error' : 'inherit'} fontSize='small'/>
                <Typography className={classes.warningText} color={isWrongDimensions ? 'error' : 'inherit'} variant='h6'>
                    Ширина фото дожна быть {this.requredFileWidth}px, а высота {this.requredFileHeight}px
                </Typography>
            </div>;
        case !!this.requredFileHeight:
            return <div className={classes.warning}>
                <WarningIcon className={classNames(classes.warningIcon, {
                    [classes.errorIcon]: isWrongDimensions
                })} color={isWrongDimensions ? 'error' : 'inherit'} fontSize='small'/>
                <Typography className={classes.warningText} color={isWrongDimensions ? 'error' : 'inherit'} variant='h6'>
                    Высота фото дожна быть {this.requredFileHeight}px
                </Typography>
            </div>;
        case !!this.requredFileWidth:
            return <div className={classes.warning}>
                <WarningIcon className={classNames(classes.warningIcon, {
                    [classes.errorIcon]: isWrongDimensions
                })} color={isWrongDimensions ? 'error' : 'inherit'} fontSize='small'/>
                <Typography className={classes.warningText} color={isWrongDimensions ? 'error' : 'inherit'} variant='h6'>
                    Ширина фото дожна быть {this.requredFileWidth}px
                </Typography>
            </div>;
        default:
            return null;
        }
    };

    render () {
        const { classes, name, schema } = this.props;
        const { files, isSorting } = this.state;
        const inputId = `${name}-${+Date.now()}`;

        return <div>
            <div className={classes.upload}>
                <input
                    className={classes.uploadInput}
                    id={inputId}
                    type='file'
                    accept='image/*'
                    onChange={this.handleFilesUpload}
                    multiple
                />
                <label htmlFor={inputId}>
                    <Button variant='contained' component='span' color='default'>
                        Загрузить
                        <CloudUploadIcon className={classes.uploadIcon} />
                    </Button>
                </label>
                {this.renderDimensionsRequires()}
            </div>
            <FilesPreviews
                axis='xy'
                classes={classes}
                files={files}
                onFileLoad={this.handleFileLoad}
                onFileDelete={this.handleFileDelete}
                onNameChange={this.handleNameChange}
                onSortStart={this.onDragStart}
                onSortEnd={this.onDragEnd}
                isSorting={isSorting}
                useDragHandle
                schema={schema}
            />
        </div>;
    }
}

export default withStyles(materialStyles)(FormFieldFiles);
