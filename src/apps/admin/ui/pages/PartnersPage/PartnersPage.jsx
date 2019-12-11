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
import PartnerForm from '../../components/PartnerForm/PartnerForm';

import { connect } from 'react-redux';
import getPartners from '../../../services/getPartners';
import deletePartnersByIds from '../../../services/deletePartnersByIds';

const DEFAULT_LANG = 'ru';
const headerRows = [
    { id: 'name', label: 'Название' },
    { id: 'active', label: 'Active' }
];
const tableCells = [
    { prop: partner => pathOr(['texts', DEFAULT_LANG, 'name'], '', partner) },
    { prop: partner => partner.hidden ? <CloseIcon/> : <CheckIcon/> }
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

const mapStateToProps = ({ partners }) => {
    return {
        partners: partners.partners
    };
};

const mapDispatchToProps = (dispatch) => ({
    getPartners: payload => dispatch(getPartners(payload)),
    deletePartners: payload => dispatch(deletePartnersByIds(payload))
});

class PartnersPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getPartners: PropTypes.func.isRequired,
        deletePartners: PropTypes.func.isRequired,
        partners: PropTypes.array
    };

    static defaultProps = {
        partners: []
    };

    constructor (...args) {
        super(...args);

        this.state = {
            loading: true,
            formShowed: false,
            editablePartner: null
        };
    }

    componentDidMount () {
        this.props.getPartners()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    handleFormDone = () => {
        this.props.getPartners()
            .then(this.handleClosePartnerForm);
    };

    handleFormOpen = partner => () => {
        this.setState({
            formShowed: true,
            editablePartner: partner
        });
    };

    handleClosePartnerForm = () => {
        this.setState({
            formShowed: false,
            editablePartner: null
        });
    };

    render () {
        const { classes, partners } = this.props;
        const { loading, editablePartner, formShowed } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        return <div>
            <AdminTable
                headerRows={headerRows}
                tableCells={tableCells}
                values={partners}
                headerText='Партнёры'
                deleteValueWarningTitle='Вы точно хотите удалить партнёра?'
                deleteValuesWarningTitle='Вы точно хотите удалить следующих партнёров?'
                onDelete={this.props.deletePartners}
                onFormOpen={this.handleFormOpen}
            />
            <Modal open={formShowed} onClose={this.handleClosePartnerForm} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <PartnerForm partner={editablePartner} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(PartnersPage));
