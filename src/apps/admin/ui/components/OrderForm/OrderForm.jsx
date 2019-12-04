import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import editOrder from '../../../services/editOrder';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import noop from '@tinkoff/utils/function/noop';
import prop from '@tinkoff/utils/object/prop';
import propEq from '@tinkoff/utils/object/propEq';
import find from '@tinkoff/utils/array/find';
import format from 'date-fns/format';

import Form from '../Form/Form';
import getSchema from './orderFormSchema';

const mapStateToProps = ({ application }) => {
    return {
        categories: application.categories
    };
};

const mapDispatchToProps = (dispatch) => ({
    editOrder: payload => dispatch(editOrder(payload))
});

const materialStyles = theme => ({
    loader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    table: {
        marginBottom: '25px',
        marginTop: '15px'
    },
    title: {
        marginBottom: '12px'
    },
    statusField: {
        width: '100%',
        height: '56px',
        backgroundColor: '#ffffff',
        marginTop: '12px',
        marginBottom: '12px'
    },
    typographyTitle: {
        margin: '12px'
    },
    textField: {
        width: '100%'
    },
    divider: {
        marginTop: 2 * theme.spacing.unit,
        marginBottom: 2 * theme.spacing.unit
    },
    colorPreview: {
        marginLeft: '5px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        display: 'inline-block'
    },
    rowLabel: {
        '@media (max-width: 1024px)': {
            padding: '4px 24px'
        },
        '@media (max-width: 780px)': {
            padding: '4px 12px'
        }
    },
    rowLabelSmall: {
        '@media (max-width: 1024px)': {
            padding: '4px 24px'
        },
        '@media (max-width: 780px)': {
            padding: '4px 12px',
            '&:last-child': {
                paddingRight: '12px'
            }
        },
        '@media (max-width: 600px)': {
            padding: '4px 6px',
            '&:last-child': {
                paddingRight: '6px'
            }
        },
        '@media (max-width: 520px)': {
            padding: '4px 2px',
            '&:last-child': {
                paddingRight: '2px'
            }
        },
        '@media (max-width: 425px)': {
            fontSize: '10px'
        },
        '@media (max-width: 374px)': {
            fontSize: '8.5px'
        }
    }
});

class OrderForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        order: PropTypes.object.isRequired,
        editOrder: PropTypes.func,
        orderTypes: PropTypes.array,
        paymentTypes: PropTypes.array,
        statuses: PropTypes.array,
        onDone: PropTypes.func
    };

    static defaultProps = {
        onDone: noop,
        orderTypes: [],
        paymentTypes: [],
        statuses: []
    };

    constructor (props) {
        super(props);

        const { order } = this.props;

        this.initialValues = {
            status: order.status,
            comment: order.comment
        };
        this.state = {
            order: this.props.order,
            id: prop('id', this.props.order)
        };
    }

    formatOrderDate = order => format(order.date, 'HH:mm - dd.MM.yyyy');

    componentDidMount () {
        this.props.order && this.setState({
            loading: false
        });
    }

    handleSubmit = (values) => {
        const { id } = this.state;
        const payload = {
            status: values.status,
            comment: values.comment
        };

        this.props.editOrder({ ...payload, id })
            .then(this.props.onDone);
    };

    render () {
        const { classes, orderTypes, paymentTypes, statuses } = this.props;
        const { order } = this.state;
        const formatOrderDate = this.formatOrderDate(order);

        return <div>
            <Typography variant='h5' className={classes.title}>Заказ</Typography>
            <Paper className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Название</TableCell>
                            <TableCell className={classes.rowLabel} align="center">Значение</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Дата</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{formatOrderDate}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Тип доставки</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{
                                find(propEq('id', order.orderType))(orderTypes).value
                            }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Тип оплаты</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{
                                find(propEq('id', order.paymentType))(paymentTypes).value
                            }</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Область</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{order.address.city}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Город</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{order.address.city}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Отделение</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{order.address.department}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            <Typography variant='h6' className={classes.title}>Заказчик</Typography>
            <Paper className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Название</TableCell>
                            <TableCell className={classes.rowLabel} align="center">Значение</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Имя заказчика</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{order.customer.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Номер телефона</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{order.customer.phone}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Комментарий</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{order.customer.comment}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            <Typography variant='h6'>Товары</Typography>
            <Paper>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.rowLabelSmall} colSpan={1}>Название</TableCell>
                            <TableCell className={classes.rowLabelSmall} colSpan={3} align="center">Количество</TableCell>
                            <TableCell className={classes.rowLabelSmall} colSpan={3} align="center">Размер</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.products.map(({ product, quantity, price, properties }, i) => {
                            return <TableRow key={i}>
                                <TableCell className={classes.rowLabelSmall} colSpan={1}>{product.name}</TableCell>
                                <TableCell className={classes.rowLabelSmall} colSpan={3} align="center">{quantity}</TableCell>
                                <TableCell className={classes.rowLabelSmall} colSpan={3} align="center">
                                    {properties.size.size}
                                </TableCell>
                            </TableRow>;
                        })}
                    </TableBody>
                </Table>
            </Paper>
            <Form
                initialValues={this.initialValues}
                schema={getSchema({ data: { statuses } })}
                onSubmit={this.handleSubmit}
            />
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(OrderForm));
