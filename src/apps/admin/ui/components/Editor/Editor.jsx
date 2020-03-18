import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import uploadFile from '../../../services/uploadFile';

import CKEditor from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';

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

    shouldComponentUpdate() {
        return false;
    }

    render () {
        const { value } = this.props;

        return <div id='editor'>
            <div id="toolbar-container" />
            <div>
                <CKEditor
                    editor={ DecoupledEditor }
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
                        alignment: {
                            options: ['left', 'center', 'right', 'justify']
                        },
                        // toolbar: [ 'bold', 'italic' ]
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
                    onInit={ editor => {
                        console.log(editor.ui.view.toolbar.element, document.querySelector( '.ck-content' ));
                        // You can store the "editor" and use when it is needed.
                        document.querySelector( '#toolbar-container' ).appendChild( editor.ui.view.toolbar.element );

                        window.editor = editor;
                    } }
                />
            </div>
        </div>;
    }
}

export default connect(null, mapDispatchToProps)(Editor);
