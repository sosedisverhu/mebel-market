import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';
import getOrders from '../../../services/getOrders';

import format from 'date-fns/format';
import OrderForm from '../../components/OrderForm/OrderForm';

import propEq from '@tinkoff/utils/object/propEq';
import find from '@tinkoff/utils/array/find';

const STATUS_ARRAY = [
    {
        value: 'new',
        name: 'new'
    },
    {
        value: 'paid',
        name: 'paid'
    },
    {
        value: 'sent',
        name: 'sent'
    },
    {
        value: 'done',
        name: 'done'
    },
    {
        value: 'declined',
        name: 'declined'
    }
];

const ROWS_PER_PAGE = 10;
const headerRows = [
    { id: 'shortId', label: 'Номер заказа' },
    { id: 'name', label: 'Имя' },
    { id: 'phone', label: 'Телефон' },
    { id: 'date', label: 'Дата' },
    { id: 'status', label: 'Статус' }
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
        maxWidth: '1200px',
        width: '90vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
        overflowY: 'auto',
        maxHeight: '100vh',
        '@media (max-width: 780px)': {
            padding: '15px',
            maxHeight: '90vh'
        }
    },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    status: {
        width: '88px',
        height: '24px',
        color: 'white',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '25px',
        '@media (max-width: 780px)': {
            width: 'auto'
        }
    },
    status__new: {
        backgroundColor: '#761CEA'
    },
    status__paid: {
        backgroundColor: '#FFD600'
    },
    status__sent: {
        backgroundColor: '#8CBA51'
    },
    status__done: {
        backgroundColor: '#008736'
    },
    status__declined: {
        backgroundColor: '#BC0022'
    },
    valuesActions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    toolbar: {
        width: '100%',
        marginTop: theme.spacing.unit * 3
    },
    rowLabel: {
        '@media (max-width: 780px)': {
            padding: '4px 24px'
        },
        '@media (max-width: 600px)': {
            padding: '2px 12px'
        },
        '@media (max-width: 425px)': {
            padding: '2px 6px'
        }
    }
});

const mapStateToProps = ({ data }) => {
    return {
        orders: data.orders
    };
};

const mapDispatchToProps = (dispatch) => ({
    getOrders: payload => dispatch(getOrders(payload))
});

class OrdersPage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        getOrders: PropTypes.func.isRequired,
        orders: PropTypes.array
    };

    static defaultProps = {
        orders: []
    };

    constructor (...args) {
        super(...args);
        const { classes } = this.props;

        this.state = {
            loading: true,
            formShowed: false,
            editableOrder: null,
            page: 0
        };

        this.tableCells = [
            { prop: order => order.shortId && `№ ${order.shortId}` },
            { prop: order => order.customer.name },
            { prop: order => order.customer.phone },
            { prop: order => format(order.date, 'HH:mm - dd.MM.yyyy') },
            { prop: order => {
                const { value, name } = find(propEq('value', order.status), STATUS_ARRAY);

                return <div className={classNames(classes.status, classes[`status__${value}`])}>
                    {name}
                </div>;
            } }
        ];
    }

    componentDidMount () {
        this.props.getOrders()
            .then(() => {
                this.setState({
                    loading: false
                });
            });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.orders !== this.props.orders) {
            this.setState({
                rowsPerPage: nextProps.orders.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : nextProps.orders.length,
                selected: []
            });
        }
    }

    handleFormDone = () => {
        this.props.getOrders()
            .then(this.handleCloseOrderForm);
    };

    handleFormOpen = order => () => {
        this.setState({
            formShowed: true,
            editableOrder: order
        });
    };

    handleCloseOrderForm = () => {
        this.setState({
            formShowed: false,
            editableOrder: null
        });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = ({ target: { value } }) => {
        const { orders } = this.props;
        const rowsPerPage = orders.length > value ? value : orders.length;

        this.setState({ rowsPerPage });
    };

    render () {
        const { classes, orders } = this.props;
        const { loading, editableOrder, formShowed, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);

        if (loading) {
            return <div className={classes.loader}>
                <CircularProgress />
            </div>;
        }

        return <div className={classes.root}>
            <Paper className={classes.paper}>
                <Toolbar
                    className={classes.toolbar}
                >
                    <Typography variant='h6' id='tableTitle'>
                        Заказы
                    </Typography>
                    <div className={classes.spacer} />
                </Toolbar>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby='tableTitle'>
                        <TableHead>
                            <TableRow>
                                {headerRows.map(
                                    (row, i) => (
                                        <TableCell key={i} className={classes.rowLabel}>
                                            {row.label}
                                        </TableCell>
                                    )
                                )}
                                <TableCell align='right' className={classes.rowLabel}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((value, i) => {
                                    return (
                                        <TableRow
                                            hover
                                            role='checkbox'
                                            tabIndex={-1}
                                            key={i}
                                            className={classes.row}
                                        >
                                            {this.tableCells.map((tableCell, i) =>
                                                <TableCell key={i} className={classes.rowLabel}>{tableCell.prop(value)}</TableCell>)}
                                            <TableCell padding='checkbox' align='right'>
                                                <div className={classes.valueActions}>
                                                    <IconButton onClick={this.handleFormOpen(value)} className={classes.rowLabel}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component='div'
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
            <Modal open={formShowed} onClose={this.handleCloseOrderForm} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <OrderForm
                        statuses={STATUS_ARRAY}
                        order={editableOrder}
                        onDone={this.handleFormDone}
                    />
                </Paper>
            </Modal>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(OrdersPage));
