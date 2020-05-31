import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import uploadFile from '../../../services/uploadFile';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import '@sosedisverhu/ckeditor5-build-classic/build/translations/en.js'; // for en admin panel

import UploadImagePlugin from './plugins/UploadImage/UploadImage';

import './Editor.css';

const mapDispatchToProps = (dispatch) => ({
    uploadFile: payload => dispatch(uploadFile(payload))
});

class Editor extends Component {
    static propTypes = {
        uploadFile: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string
    };

    static defaultProps = {
        value: ''
    };

    render () {
        const { value } = this.props;

        return <CKEditor
            editor={ ClassicEditor }
            config={{
                allowedContent: true,
                extraPlugins: [
                    UploadImagePlugin({
                        handlers: {
                            onUploadFile: this.props.uploadFile
                        }
                    })
                ],
                image: {
                    toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
                    styles: ['full', 'alignLeft', 'alignRight']
                },
                link: {
                    decorators: {
                        isExternal: {
                            mode: 'manual',
                            label: 'Open in a new tab',
                            attributes: {
                                target: '_blank'
                            }
                        },
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: true
                            }
                        }
                    }
                },
                mediaEmbed: {
                    previewsInData: true
                },
                language: 'en'
            }}
            data={value}
            onChange={ (event, editor) => {
                const data = editor.getData();

                this.props.onChange({
                    target: {
                        value: data
                    }
                });
            }}
        />;
    }
}

export default connect(null, mapDispatchToProps)(Editor);
