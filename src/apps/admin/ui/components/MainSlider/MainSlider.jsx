import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';

import map from '@tinkoff/utils/array/map';
import remove from '@tinkoff/utils/array/remove';
import equal from '@tinkoff/utils/is/equal';
import noop from '@tinkoff/utils/function/noop';
import arrayMove from '../../../utils/arrayMove';

import getMainSlides from '../../../services/getMainSlides';
import updateSlides from '../../../services/updateSlides';

import FormFieldLangs from '../Form/fields/FormFieldLangs/FormFieldLangs';
import MainSlideForm from '../MainSlideForm/MainSlideForm';
import CloseFormDialog from '../CloseFormDialog/CloseFormDialog';
import EditIcon from '@material-ui/icons/Edit';

const LANGS = ['ru', 'ua'];

const materialStyles = theme => ({
    root: {
        padding: '20px'
    },
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
    filesList: {
        overflow: 'auto'
    },
    fileItem: {
        position: 'relative',
        userSelect: 'none',
        padding: '16px',
        float: 'left',
        width: '200px',
        cursor: 'grab',
        '&:hover $fileItemDeleteContainer': {
            visibility: 'visible'
        },
        '&:hover $fileItemEditContainer': {
            visibility: 'visible'
        }
    },
    fileItemSorting: {
        '&:hover $fileItemDeleteContainer': {
            visibility: 'hidden'
        },
        '&:hover $fileItemEditContainer': {
            visibility: 'hidden'
        }
    },
    fileImage: {
        width: '100%'
    },
    fileImageError: {
        outline: 'solid 4px #f44336'
    },
    fileItemEditContainer: {
        position: 'absolute',
        left: '0',
        top: '0',
        visibility: 'hidden',
        background: 'white',
        borderRadius: '100%'
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
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButtonNoSlides: {
        marginTop: '16px'
    },

    modal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        position: 'absolute',
        width: '1200px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh',
        '@media (max-width:900px)': {
            width: '90%'
        }
    }
});

const Image = SortableHandle(({ imageClassName, src }) => (
    <img className={imageClassName} src={src} alt=''/>
));

const SlidePreview = SortableElement(({ slide, index, classes, onFileDelete, isSorting, onFileEdit }) =>
    <div className={classNames(classes.fileItem, {
        [classes.fileItemSorting]: isSorting
    })}>
        <div className={classes.fileItemEditContainer}>
            <IconButton
                aria-label='Delete'
                onClick={onFileEdit(index)}
            >
                <EditIcon />
            </IconButton>
        </div>
        <div className={classes.fileItemDeleteContainer}>
            <IconButton
                aria-label='Delete'
                onClick={onFileDelete(index)}
            >
                <DeleteIcon/>
            </IconButton>
        </div>
        <Image src={slide.path} imageClassName={classes.fileImage}/>
    </div>);

const SlidesPreviews = SortableContainer(({ slides, classes, ...rest }) =>
    <div className={classes.filesList}>
        {slides.map((slide, i) => <SlidePreview
            key={i}
            index={i}
            slide={slide}
            classes={classes}
            {...rest}
        />)}
    </div>);

const mapStateToProps = ({ data }) => {
    return {
        slider: data.slider
    };
};

const mapDispatchToProps = dispatch => ({
    getMainSlides: payload => dispatch(getMainSlides(payload)),
    updateSlides: payload => dispatch(updateSlides(payload))
});

class MainSlider extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getMainSlides: PropTypes.func.isRequired,
        updateSlides: PropTypes.func.isRequired,
        slider: PropTypes.object.isRequired,
        langs: PropTypes.array
    };

    static defaultProps = {
        slider: {},
        langs: LANGS
    };

    constructor (...args) {
        super(...args);

        const activeLang = this.props.langs[0];

        this.state = {
            slides: [],
            removedSlides: [],
            isSorting: false,
            loading: true,
            disabled: true,
            activeLang,
            warningFormShowed: false,
            formShowed: false
        };

        this.slidesPaths = this.state.slides.map(slide => slide.path);
    }

    componentDidMount () {
        const { activeLang } = this.state;

        this.props.getMainSlides()
            .then(() => {
                this.setState({
                    loading: false,
                    slides: this.props.slider[`slides_${activeLang}`] || []
                });
            });
    }

    componentWillReceiveProps (nextProps) {
        const { activeLang } = this.state;

        if (nextProps.slider[`slides_${activeLang}`] !== this.props.slider[`slides_${activeLang}`]) {
            this.setState({
                disabled: true
            });

            this.slidesPaths = nextProps.slider[`slides_${activeLang}`].map(slide => slide.path);
        }
    }

    handleChangeFormClose = value => {
        this.setState({
            warningFormShowed: value
        });
    };

    onDragStart = () => {
        this.setState({
            isSorting: true
        });
    };

    onDragEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            slides: arrayMove(this.state.slides, oldIndex, newIndex),
            isSorting: false
        }, this.handleSlidesChanged);
    };

    handleSlidesChanged = () => {
        const newSlidesPaths = this.state.slides.map(slide => slide.path);

        this.setState({
            disabled: equal(this.slidesPaths, newSlidesPaths)
        });
    };

    handleFilesUpload = e => {
        const newFiles = map(file => ({
            content: file,
            path: URL.createObjectURL(file),
            showed: true
        }), e.target.files);

        const slides = [...this.state.slides, ...newFiles];

        this.setState({
            slides
        }, this.handleSlidesChanged);

        event.target.value = '';
    };

    handleFileDelete = i => () => {
        const { slides, removedSlides } = this.state;

        if (slides[i].path) {
            removedSlides.push(slides[i]);
        }

        this.setState({
            slides: remove(i, 1, slides),
            removedSlides
        }, this.handleSlidesChanged);
    };

    handleSubmit = e => {
        e.preventDefault();

        const { activeLang } = this.state;
        const { slides, removedSlides } = this.state;
        const formData = new FormData();
        const cleanedSlides = slides.map(slide => {
            const isOld = !slide.content;

            return {
                link: slide.link,
                newTab: !!slide.newTab,
                path: isOld && slide.path,
                name: isOld && slide.name || '',
                oldSlidePath: slide.oldSlidePath
            };
        });

        slides.forEach((file, i) => {
            if (file.content) {
                formData.append(`slide-file-${i}`, file.content);
            }
        });

        formData.append('removedSlides', JSON.stringify(removedSlides));
        formData.append('slides', JSON.stringify(cleanedSlides));
        // formData.append(`slides_${activeLang}`, JSON.stringify(this.props.slider[`slides_${activeLang}`]));
        formData.append(`lang`, activeLang);

        return this.props.updateSlides(formData);
    };

    handleLangChange = (activeLang) => {
        this.setState({
            activeLang,
            slides: this.props.slider[`slides_${activeLang}`] || []
        });
    };

    handleFileEdit = i => () => {
        const { slides } = this.state;

        this.setState({
            formShowed: true,
            editableSlideInfo: {
                index: i,
                slide: slides[i]
            }
        });
    };

    handleClosetForm = () => {
        this.setState({
            formShowed: false,
            warningFormShowed: false,
            editableSlideInfo: null
        });
    };

    handleFormDone = ({ slide, index }) => {
        const { slides } = this.state;
        const newSlides = [...slides];

        newSlides[index] = slide;

        this.setState({
            slides: newSlides
        }, () => {
            this.handleSubmit({ preventDefault: noop })
                .then(() => {
                    this.setState({
                        formShowed: false,
                        editableSlideInfo: null,
                        disabled: true
                    });
                });
        });
    };

    render () {
        const { classes, langs } = this.props;
        const { slides, isSorting, disabled, activeLang, formShowed, warningFormShowed, editableSlideInfo } = this.state;

        return <div className={classes.root}>
            <FormFieldLangs name="lang" schema={{ langs: langs }} value={activeLang} onChange={this.handleLangChange}/>
            <form onSubmit={this.handleSubmit}>
                <Typography variant='h6'>Photos</Typography>
                <div className={classes.upload}>
                    <input
                        className={classes.uploadInput}
                        id={`uploadInput_${activeLang}`}
                        type='file'
                        accept='image/*'
                        onChange={this.handleFilesUpload}
                        multiple
                    />
                    <label htmlFor={`uploadInput_${activeLang}`}>
                        <Button variant='contained' component='span' color='default'>
                            Загрузить
                            <CloudUploadIcon className={classes.uploadIcon}/>
                        </Button>
                    </label>
                </div>
                <SlidesPreviews
                    axis='xy'
                    classes={classes}
                    slides={slides}
                    onFileEdit={this.handleFileEdit}
                    onFileDelete={this.handleFileDelete}
                    onSortStart={this.onDragStart}
                    onSortEnd={this.onDragEnd}
                    isSorting={isSorting}
                    useDragHandle
                />
                <Button
                    className={classNames({
                        [classes.submitButtonNoSlides]: !slides.length
                    })}
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={disabled}
                >
                    Сохранить
                </Button>
            </form>
            <Modal open={formShowed} onClose={() => this.handleChangeFormClose(true)} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <MainSlideForm editableSlideInfo={editableSlideInfo} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
            <CloseFormDialog
                open={warningFormShowed && formShowed}
                text='Вы точно хотите закрыть форму?'
                onClose={this.handleChangeFormClose}
                onDone={this.handleClosetForm}
            />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(MainSlider));
