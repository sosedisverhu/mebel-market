import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/core/SvgIcon/SvgIcon';

import compose from '@tinkoff/utils/function/compose';
import split from '@tinkoff/utils/string/split';
import last from '@tinkoff/utils/array/last';

import downloadDb from '../../../services/downloadDb';
import downloadFiles from '../../../services/downloadFiles';
import uploadDb from '../../../services/uploadDb';
import uploadFiles from '../../../services/uploadFiles';

const mapDispatchToProps = (dispatch) => ({
    downloadDb: payload => dispatch(downloadDb(payload)),
    downloadFiles: payload => dispatch(downloadFiles(payload)),
    uploadDb: payload => dispatch(uploadDb(payload)),
    uploadFiles: payload => dispatch(uploadFiles(payload))
});

const materialStyles = theme => ({
    root: {
        padding: '20px'
    },
    button: {
        marginRight: '10px'
    },
    uploadInput: {
        display: 'none'
    },
    uploadIcon: {
        marginLeft: '10px',
        width: '30px',
        height: '19px',
        color: 'black'
    },
    buttonBlocks: {
        display: 'flex'
    },
    uploadButton: {
        marginTop: '10px'
    },
    buttonBlock: {
        marginRight: '20px',
        display: 'flex',
        flexDirection: 'column'
    },
    uploadSection: {
        marginTop: '20px'
    },
    fileName: {
        marginTop: '10px'
    }
});

class DatabasePage extends Component {
    static propTypes = {
        downloadDb: PropTypes.func.isRequired,
        downloadFiles: PropTypes.func.isRequired,
        uploadDb: PropTypes.func.isRequired,
        uploadFiles: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired
    };

    state = {};

    handleDownloadDb = () => {
        this.props.downloadDb()
            .then(url => {
                const link = document.createElement('a');
                const fileName = compose(
                    last,
                    split('/')
                )(url);

                link.style = 'display: none';
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }, 100);
            });
    };

    handleDownloadFiles = () => {
        this.props.downloadFiles()
            .then(url => {
                const link = document.createElement('a');
                const fileName = compose(
                    last,
                    split('/')
                )(url);

                link.style = 'display: none';
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }, 100);
            });
    };

    handleUploadDb = () => {
        const { db } = this.state;
        const formData = new FormData();

        formData.append('db', db);

        return this.props.uploadDb(formData)
            .then(() => {
                this.setState({ db: null });
            });
    };

    handleUploadFiles = () => {
        const { files } = this.state;
        const formData = new FormData();

        formData.append('files', files);

        return this.props.uploadFiles(formData)
            .then(() => {
                this.setState({ files: null });
            });
    };

    handleFilesUpload = name => event => {
        const file = event.target.files[0];

        event.target.value = '';

        this.setState({
            [name]: file
        });
    };

    render () {
        const { classes } = this.props;
        const { db, files } = this.state;

        return <section className={classes.root}>
            <div>
                <Typography variant='h6'>Скачать</Typography>
                <Button
                    onClick={this.handleDownloadDb}
                    className={classes.button}
                    variant='contained'
                    color='primary'
                >
                    Скачать DB
                </Button>
                <Button
                    onClick={this.handleDownloadFiles}
                    className={classes.button}
                    variant='contained'
                    color='primary'
                >
                    Скачать файлы
                </Button>
            </div>
            <div className={classes.uploadSection}>
                <Typography variant='h6'>Загрузить</Typography>
                <div className={classes.buttonBlocks}>
                    <div className={classes.buttonBlock}>
                        <label>
                            <input
                                className={classes.uploadInput}
                                type='file'
                                accept=".tar"
                                onChange={this.handleFilesUpload('db')}
                            />
                            <Button variant='contained' component='span' color='default'>
                                Загрузить
                                <CloudUploadIcon className={classes.uploadIcon} />
                            </Button>
                        </label>
                        {db && <Typography className={classes.fileName}>{db.name}</Typography>}
                        <Button
                            onClick={this.handleUploadDb}
                            className={classes.uploadButton}
                            variant='contained'
                            color='primary'
                            disabled={!db}
                        >
                            Загрузить DB
                        </Button>
                    </div>
                    <div className={classes.buttonBlock}>
                        <label>
                            <input
                                className={classes.uploadInput}
                                type='file'
                                accept=".tar"
                                onChange={this.handleFilesUpload('files')}
                            />
                            <Button variant='contained' component='span' color='default'>
                                Загрузить
                                <CloudUploadIcon className={classes.uploadIcon} />
                            </Button>
                        </label>
                        {files && <Typography className={classes.fileName}>{files.name}</Typography>}
                        <Button
                            onClick={this.handleUploadFiles}
                            className={classes.uploadButton}
                            variant='contained'
                            color='primary'
                            disabled={!files}
                        >
                            Загрузить файлы
                        </Button>
                    </div>
                </div>
            </div>
        </section>;
    }
}

export default connect(undefined, mapDispatchToProps)(withStyles(materialStyles)(DatabasePage));
