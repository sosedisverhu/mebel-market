import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import pathOr from '@tinkoff/utils/object/pathOr';

import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import AdminTableSortable from '../../components/AdminTableSortable/AdminTableSortable.jsx';
import PartnerForm from '../../components/PartnerForm/PartnerForm';
import CloseFormDialog from '../../components/CloseFormDialog/CloseFormDialog';

import getPartners from '../../../services/getPartners';
import deletePartnersByIds from '../../../services/deletePartnersByIds';
import editPartnersPositions from '../../../services/editPartnersPositions';

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
        maxHeight: '100vh',
        '@media (max-width:1300px)': {
            width: '90%'
        }
    },
    warningContent: {
        paddingBottom: '0'
    }
});

const mapStateToProps = ({ data }) => {
    return {
        partners: data.partners
    };
};

const mapDispatchToProps = dispatch => ({
    getPartners: payload => dispatch(getPartners(payload)),
    deletePartners: payload => dispatch(deletePartnersByIds(payload)),
    editPositions: payload => dispatch(editPartnersPositions(payload))
});

class PartnersPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getPartners: PropTypes.func.isRequired,
        deletePartners: PropTypes.func.isRequired,
        editPositions: PropTypes.func.isRequired,
        partners: PropTypes.array
    };

    static defaultProps = {
        partners: []
    };

    state = {
        loading: true,
        formShowed: false,
        warningFormShowed: false,
        editablePartner: null
    };

    componentDidMount () {
        this.props.getPartners()
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
            warningFormShowed: false,
            editablePartner: null
        });
    };

    render () {
        const { classes, partners, editPositions } = this.props;
        const { loading, editablePartner, formShowed, warningFormShowed } = this.state;

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress/>
            </div>;
        }

        return <div>
            <AdminTableSortable
                headerRows={headerRows}
                tableCells={tableCells}
                values={partners}
                onChange={editPositions}
                headerText='Партнёры'
                deleteValueWarningTitle='Вы точно хотите удалить партнёра?'
                deleteValuesWarningTitle='Вы точно хотите удалить следующих партнёров?'
                onDelete={this.props.deletePartners}
                onFormOpen={this.handleFormOpen}
                filters={false}
                cloneElem={false}
            />
            <Modal open={formShowed} onClose={() => this.handleChangeFormClose(true)} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <PartnerForm partner={editablePartner} onDone={this.handleFormDone}/>
                </Paper>
            </Modal>
            <CloseFormDialog
                open={warningFormShowed && formShowed}
                text='Вы точно хотите закрыть форму?'
                onClose={this.handleChangeFormClose}
                onDone={this.handleClosePartnerForm}
            />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(PartnersPage));
