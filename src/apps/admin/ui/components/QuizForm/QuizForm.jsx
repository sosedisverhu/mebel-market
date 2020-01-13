import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import getSchema from './QuizFormSchema';
import saveQuiz from '../../../services/saveQuiz';
import editQuiz from '../../../services/editQuiz';
import updateQuizFiles from '../../../services/updateQuizFiles';

import Form from '../Form/Form';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import pick from '@tinkoff/utils/object/pick';
import pathOr from '@tinkoff/utils/object/pathOr';

const QUIZZES_VALUES = ['name', 'hidden', 'texts'];

const mapDispatchToProps = (dispatch) => ({
    saveQuiz: payload => dispatch(saveQuiz(payload)),
    editQuiz: payload => dispatch(editQuiz(payload)),
    updateQuizFiles: (...payload) => dispatch(updateQuizFiles(...payload))
});

const materialStyles = theme => ({
    error: {
        backgroundColor: theme.palette.error.dark
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
    margin: {
        margin: theme.spacing.unit
    }
});

class QuizForm extends Component {
    static propTypes = {
        saveQuiz: PropTypes.func.isRequired,
        editQuiz: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
        onDone: PropTypes.func,
        quiz: PropTypes.object,
        updateQuizFiles: PropTypes.func.isRequired
    };

    static defaultProps = {
        onDone: noop,
        quiz: {}
    };

    constructor (...args) {
        super(...args);

        const { quiz } = this.props;
        const ru = pathOr(['texts', 'ru'], '', quiz);
        const ua = pathOr(['texts', 'ua'], '', quiz);

        this.initialValues = {
            ru_name: ru.name || '',
            ua_name: ua.name || '',
            hidden: quiz.hidden || false,
            ru_steps: pathOr(['steps', 'ru'], '', quiz) || [],
            ua_steps: pathOr(['steps', 'ua'], '', quiz) || [],
            alias: quiz.alias,
            ...pick(QUIZZES_VALUES, quiz)
        };
        this.id = prop('id', quiz);
        this.state = {};
    }

    getQuizPayload = (
        {
            ru_name: ruName,
            ua_name: uaName,
            hidden,
            id,
            ua_steps: uaSteps,
            ru_steps: ruSteps,
            alias
        }) => {
        return {
            texts: {
                ru: {
                    name: ruName
                },
                ua: {
                    name: uaName
                }
            },
            hidden,
            id,
            alias,
            steps: {
                ua: uaSteps,
                ru: ruSteps
            }
        };
    };

    handleSubmit = values => {
        const quizPayload = this.getQuizPayload(values);
        const { editQuiz, saveQuiz, onDone, updateQuizFiles } = this.props;
        (this.id ? editQuiz({ ...quizPayload, id: this.id }) : saveQuiz(quizPayload))
            .then(quiz => {
                const formData = new FormData();
                const removedFiles = [];
                const oldFiles = [];
                const id = pathOr(['id'], this.id, quiz);

                values.ru_steps.forEach((step, i) => {
                    step.options.forEach((option) => {
                        if (option.file.files.length) {
                            const file = option.file.files[0];
                            if (typeof (file) === 'object') {
                                if (file.content) {
                                    formData.append(`quiz-option-${option.id}-file-${i}`, file.content);
                                } else {
                                    oldFiles.push({
                                        path: file.path,
                                        index: i
                                    });
                                }
                            }
                        }
                    });
                });

                formData.append('removedFiles', JSON.stringify(removedFiles));
                formData.append('oldFiles', JSON.stringify(oldFiles));
                formData.append('quiz', JSON.stringify(quiz));
                return updateQuizFiles(formData, id);
            })
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    this.setState({
                        errorText: 'Введите уникальные алиас для товара'
                    });
                } else {
                    this.setState({
                        errorText: 'Что-то пошло не так. Перезагрузите страницы и попробуйте снова'
                    });
                }
            });
    };

    handleHideFailMessage = () => {
        this.setState({
            errorText: ''
        });
    };

    render () {
        const { classes } = this.props;
        const { errorText } = this.state;

        return <div>
            <Form
                initialValues={this.initialValues}
                langs={['ru', 'ua']}
                schema={getSchema({
                    data: {
                        title: this.id ? 'Редактирование опроса' : 'Добавление опроса'
                    }
                })}
                onSubmit={this.handleSubmit}
            />
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                onClose={this.handleHideFailMessage}
                open={!!errorText}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={classNames(classes.error, classes.margin)}
                    message={
                        <span id='client-snackbar' className={classes.message}>
                            <ErrorIcon className={classNames(classes.icon, classes.iconVariant)} />
                            {errorText}
                        </span>
                    }
                />
            </Snackbar>
        </div>;
    }
}

export default withStyles(materialStyles)(connect(null, mapDispatchToProps)(QuizForm));
