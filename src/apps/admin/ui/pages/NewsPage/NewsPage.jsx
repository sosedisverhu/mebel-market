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
import NewsItemForm from '../../components/NewsItemForm/NewsItemForm';

import { connect } from 'react-redux';
import getNews from '../../../services/getNews';
import deleteNewsByIds from '../../../services/deleteNewsByIds';

const DEFAULT_LANG = 'ru';
const headerRows = [
    { id: 'name', label: 'Название' },
    { id: 'active', label: 'Active' }
];
const tableCells = [
    { prop: newsItem => pathOr(['texts', DEFAULT_LANG, 'name'], '', newsItem) },
    { prop: newsItem => newsItem.hidden ? <CloseIcon/> : <CheckIcon/> }
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

const mapStateToProps = ({ news }) => {
    return {
        news: news.news
    };
};

const mapDispatchToProps = (dispatch) => ({
    getNews: payload => dispatch(getNews(payload)),
    deleteNews: payload => dispatch(deleteNewsByIds(payload))
});

class NewsItemPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getNews: PropTypes.func.isRequired,
        deleteNews: PropTypes.func.isRequired,
        news: PropTypes.array
    };

    static defaultProps = {
        news: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            formShowed: false,
            editableNewsItem: null
        };
    }

    componentDidMount () {
        this.props.getNews()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    handleFormDone = () => {
        this.props.getNews()
            .then(this.handleCloseNewsItemForm);
    };

    handleFormOpen = newsItem => () => {
        this.setState({
            formShowed: true,
            editableNewsItem: newsItem
        });
    };

    handleNewsItemClone = newsItem => () => {
        this.setState({
            formShowed: true,
            editableNewsItem: omit(['id'], newsItem)
        });
    };

    handleCloseNewsItemForm = () => {
        this.setState({
            formShowed: false,
            editableNewsItem: null
        });
    };

    render () {
        const { classes, news } = this.props;
        const { loading, editableNewsItem, formShowed } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        return <div>
            <AdminTable
                headerRows={headerRows}
                tableCells={tableCells}
                values={news}
                headerText='Новости'
                deleteValueWarningTitle='Вы точно хотите удалить новость?'
                deleteValuesWarningTitle='Вы точно хотите удалить следующие новости?'
                onDelete={this.props.deleteNews}
                onProductClone={this.handleNewsItemClone}
                onFormOpen={this.handleFormOpen}
            />
            <Modal open={formShowed} onClose={this.handleCloseNewsItemForm} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <NewsItemForm newsItem={editableNewsItem} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(NewsItemPage));
