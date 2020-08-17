import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import AdminTable from '../../components/AdminTable/AdminTable.jsx';
import AdminForm from '../../components/AdminForm/AdminForm';
import CloseFormDialog from '../../components/CloseFormDialog/CloseFormDialog';

import getAdmins from '../../../services/getAdmins';
import deleteAdminsByIds from '../../../services/deleteAdminsByIds';

const headerRows = [
    { id: 'login', label: 'Логин' },
    { id: 'email', label: 'Почта' }
];
const tableCells = [
    { prop: admin => admin.login },
    { prop: admin => admin.email }
];

const materialStyles = theme => ({
    root: {
        padding: '0 15px'
    },
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

const mapStateToProps = ({ application }) => {
    return {
        admins: application.admins
    };
};

const mapDispatchToProps = dispatch => ({
    getAdmins: payload => dispatch(getAdmins(payload)),
    deleteAdmins: payload => dispatch(deleteAdminsByIds(payload))
});

class AdminPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getAdmins: PropTypes.func.isRequired,
        deleteAdmins: PropTypes.func.isRequired,
        admins: PropTypes.array
    };

    static defaultProps = {
        admins: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            warningFormShowed: false,
            formShowed: false,
            editableAdmin: null
        };
    }

    componentDidMount () {
        this.props.getAdmins()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    handleChangeFormClose = value => {
        this.setState({
            warningFormShowed: value
        });
    };

    handleFormDone = () => {
        this.props.getAdmins()
            .then(this.handleCloseAdminForm);
    };

    handleFormOpen = admin => () => {
        this.setState({
            formShowed: true,
            editableAdmin: admin
        });
    };

    handleCloseAdminForm = () => {
        this.setState({
            formShowed: false,
            warningFormShowed: false,
            editableAdmin: null
        });
    };

    render () {
        const { classes, admins } = this.props;
        const { loading, editableAdmin, formShowed, warningFormShowed } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        return <div className={classes.root}>
            <AdminTable
                headerRows={headerRows}
                tableCells={tableCells}
                values={admins}
                headerText='Админы'
                deleteValueWarningTitle='Вы точно хотите удалить админа?'
                deleteValuesWarningTitle='Вы точно хотите удалить следующих админов?'
                onDelete={this.props.deleteAdmins}
                onFormOpen={this.handleFormOpen}
            />
            <Modal open={formShowed} onClose={() => this.handleChangeFormClose(true)} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <AdminForm admin={editableAdmin} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
            <CloseFormDialog
                open={warningFormShowed && formShowed}
                text='Вы точно хотите закрыть форму?'
                onClose={this.handleChangeFormClose}
                onDone={this.handleCloseAdminForm}
            />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(AdminPage));
