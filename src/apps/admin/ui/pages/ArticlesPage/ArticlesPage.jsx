import React, { Component } from 'react';
import PropTypes from 'prop-types';

import omit from '@tinkoff/utils/object/omit';
import pathOr from '@tinkoff/utils/object/pathOr';

import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import AdminTable from '../../components/AdminTable/AdminTable.jsx';
import ArticleForm from '../../components/ArticleForm/ArticleForm';

import { connect } from 'react-redux';
import getArticles from '../../../services/getArticles';
import deleteArticlesByIds from '../../../services/deleteArticlesByIds';

const DEFAULT_LANG = 'ru';
const headerRows = [
    { id: 'name', label: 'Название' },
    { id: 'alias', label: 'Alias' },
    { id: 'active', label: 'Active' }
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
        maxHeight: '100vh',
        '@media (max-width:1300px)': {
            width: '90%'
        }
    },
    warningContent: {
        paddingBottom: '0'
    },
    columnName: {
        maxWidth: '400px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '@media (max-width:1020px)': {
            maxWidth: '200px'
        },
        '@media (max-width:750px)': {
            maxWidth: '100px'
        },
        '@media (max-width:340px)': {
            maxWidth: '80px'
        }
    },
    columnAlias: {
        maxWidth: '200px',
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '@media (max-width:850px)': {
            maxWidth: '100px'
        },
        '@media (max-width:400px)': {
            maxWidth: '50px'
        }
    }
});

const mapStateToProps = ({ data }) => {
    return {
        articles: data.articles
    };
};

const mapDispatchToProps = (dispatch) => ({
    getArticles: payload => dispatch(getArticles(payload)),
    deleteArticles: payload => dispatch(deleteArticlesByIds(payload))
});

class ArticlePage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getArticles: PropTypes.func.isRequired,
        deleteArticles: PropTypes.func.isRequired,
        articles: PropTypes.array
    };

    static defaultProps = {
        articles: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            formShowed: false,
            editableArticle: null
        };
        this.tableCells = [
            { prop: article => <div className={this.props.classes.columnName}>{pathOr(['texts', DEFAULT_LANG, 'name'], '', article)}</div> },
            { prop: article => <a className={this.props.classes.columnAlias} target="_blank" href={`/articles/${pathOr(['alias'], '', article)}`}>
                {`/articles/${pathOr(['alias'], '', article)}`}
            </a> },
            { prop: article => article.hidden ? <CloseIcon/> : <CheckIcon/> }
        ];
    }

    componentDidMount () {
        this.props.getArticles()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    handleFormDone = () => {
        this.props.getArticles()
            .then(this.handleCloseArticleForm);
    };

    handleFormOpen = article => () => {
        this.setState({
            formShowed: true,
            editableArticle: article
        });
    };

    handleArticleClone = article => () => {
        this.setState({
            formShowed: true,
            editableArticle: omit(['id'], article)
        });
    };

    handleCloseArticleForm = () => {
        this.setState({
            formShowed: false,
            editableArticle: null
        });
    };

    render () {
        const { classes, articles } = this.props;
        const { loading, editableArticle, formShowed } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        return <div>
            <AdminTable
                headerRows={headerRows}
                tableCells={this.tableCells}
                values={articles}
                headerText='Статьи'
                deleteValueWarningTitle='Вы точно хотите удалить статью?'
                deleteValuesWarningTitle='Вы точно хотите удалить следующие статьи?'
                onDelete={this.props.deleteArticles}
                onProductClone={this.handleArticleClone}
                onFormOpen={this.handleFormOpen}
            />
            <Modal open={formShowed} onClose={this.handleCloseArticleForm} className={classes.modal} disableEnforceFocus>
                <Paper className={classes.modalContent}>
                    <ArticleForm article={editableArticle} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(ArticlePage));
