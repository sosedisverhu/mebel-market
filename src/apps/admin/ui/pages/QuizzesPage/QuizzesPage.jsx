import React, { Component } from 'react';
import PropTypes from 'prop-types';

import pathOr from '@tinkoff/utils/object/pathOr';

import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import AdminTable from '../../components/AdminTable/AdminTable.jsx';
import QuizForm from '../../components/QuizForm/QuizForm';

import { connect } from 'react-redux';
import getQuizzes from '../../../services/getQuizzes';
import deleteQuizzesByIds from '../../../services/deleteQuizzesByIds';

const DEFAULT_LANG = 'ru';
const headerRows = [
    { id: 'name', label: 'Название' },
    { id: 'active', label: 'Active' }
];
const tableCells = [
    { prop: quiz => pathOr(['texts', DEFAULT_LANG, 'name'], '', quiz) },
    { prop: quiz => quiz.hidden ? <CloseIcon/> : <CheckIcon/> }
];

const materialStyles = theme => ({
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        maxHeight: '100vh'
    },
    warningContent: {
        paddingBottom: '0'
    }
});

const mapStateToProps = ({ data }) => {
    return {
        quizzes: data.quizzes
    };
};

const mapDispatchToProps = (dispatch) => ({
    getQuizzes: payload => dispatch(getQuizzes(payload)),
    deleteQuizzes: payload => dispatch(deleteQuizzesByIds(payload))
});

class QuizzesPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getQuizzes: PropTypes.func.isRequired,
        deleteQuizzes: PropTypes.func.isRequired,
        quizzes: PropTypes.array
    };

    static defaultProps = {
        quizzes: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            formShowed: false,
            editableQuiz: null
        };
    }

    componentDidMount () {
        this.props.getQuizzes()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    handleFormDone = () => {
        this.props.getQuizzes()
            .then(this.handleCloseQuizForm);
    };

    handleFormOpen = quiz => () => {
        this.setState({
            formShowed: true,
            editableQuiz: quiz
        });
    };

    handleCloseQuizForm = () => {
        this.setState({
            formShowed: false,
            editableQuiz: null
        });
    };

    render () {
        const { classes, quizzes } = this.props;
        const { loading, editableQuiz, formShowed } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        return <div>
            <AdminTable
                headerRows={headerRows}
                tableCells={tableCells}
                values={quizzes}
                headerText='Опросы'
                deleteValueWarningTitle='Вы точно хотите удалить опрос?'
                deleteValuesWarningTitle='Вы точно хотите удалить следующие опросы?'
                onDelete={this.props.deleteQuizzes}
                onFormOpen={this.handleFormOpen}
            />
            <Modal open={formShowed} onClose={this.handleCloseQuizForm} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <QuizForm quiz={editableQuiz} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(QuizzesPage));
