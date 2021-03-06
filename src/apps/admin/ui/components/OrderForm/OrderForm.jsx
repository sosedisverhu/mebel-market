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
import format from 'date-fns/format';

import formatMoney from '../../../../client/utils/formatMoney';
import getSharesPrice from '../../../../client/utils/getSharesPrice';
import getShareTypeQuantity from '../../../../client/utils/getShareTypeQuantity';

import Form from '../Form/Form';
import getSchema from './orderFormSchema';
import styles from '../../../../client/ui/components/AboutProduct/AboutProduct.css';

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
    },
    colorImg: {
        marginRight: '6px'
    },
    p: {
        marginTop: '7px',
        lineHeight: '17px'
    },
    featureValue: {
        color: '#DC4E41'
    }
});

class OrderForm extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        order: PropTypes.object.isRequired,
        editOrder: PropTypes.func,
        statuses: PropTypes.array,
        onDone: PropTypes.func
    };

    static defaultProps = {
        onDone: noop,
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
        const { classes, statuses } = this.props;
        const { date, delivery, payment, customer, products, shares } = this.state.order;
        const productsPrice = products.reduce((sum, { quantity, price, basePrice, properties }) => {
            const productPrice = price || basePrice;
            const featuresPrice = properties.features.reduce((sum, { value }) => sum + value, 0);

            return sum + (quantity * (productPrice + featuresPrice));
        }, 0);
        const sharesPrice = getSharesPrice(shares);
        const totalPrice = productsPrice - sharesPrice;

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
                            <TableCell className={classes.rowLabel} align="center">{format(date, 'HH:mm - dd.MM.yyyy')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Тип доставки</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{delivery.texts.ru.option}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Тип оплаты</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{payment.texts.ru.option}</TableCell>
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
                            <TableCell className={classes.rowLabel} align="center">{customer.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Номер телефона</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{customer.phone}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Почта</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{customer.email}</TableCell>
                        </TableRow>
                        {customer.address && <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Адрес</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{customer.address}</TableCell>
                        </TableRow>}
                        {customer.comment && <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Комментарий</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{customer.comment}</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </Paper>
            <Typography variant='h6'>Товары</Typography>
            <Paper>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.rowLabelSmall} colSpan={1}>Название</TableCell>
                            <TableCell className={classes.rowLabelSmall} colSpan={2}>Артикул</TableCell>
                            <TableCell className={classes.rowLabelSmall} colSpan={2} align="center">Количество</TableCell>
                            <TableCell className={classes.rowLabelSmall} colSpan={2} align="center">Свойства</TableCell>
                            <TableCell className={classes.rowLabelSmall} colSpan={3} align="right">Цена за единицу</TableCell>
                            <TableCell className={classes.rowLabelSmall} colSpan={3} align="right">Всего</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            products.map(({ product, quantity, price, basePrice, properties, productName: name, productNameRu: nameRu, article }, i) => {
                                const featuresPrice = properties.features.reduce((sum, { value }) => sum + value, 0);
                                const unitPrice = (price || basePrice) + featuresPrice;
                                const presentsQuantity = getShareTypeQuantity(shares, product.id, 'present');
                                const discountsQuantity = getShareTypeQuantity(shares, product.id, 'discount');

                                return <TableRow key={i}>
                                    <TableCell className={classes.rowLabelSmall} colSpan={1}>{name || nameRu}</TableCell>
                                    <TableCell className={classes.rowLabelSmall} colSpan={2} align="center">{article || '-'}</TableCell>
                                    <TableCell className={classes.rowLabelSmall} colSpan={2} align="center">
                                        <p>{`Всего: ${quantity}`}</p>
                                        {!!discountsQuantity && <p>{`(Скидки: ${discountsQuantity} из ${quantity})`}</p>}
                                        {!!presentsQuantity && <p>{`(Подарки: ${presentsQuantity} из ${quantity})`}</p>}
                                    </TableCell>
                                    <TableCell className={classes.rowLabelSmall} colSpan={2} align="center">
                                        <p className={classes.p}>Размер: {properties.size.name || properties.size.nameRu}</p>
                                        <p className={classes.p}>
                                            Цвет: <img
                                                src={(properties.color || properties.colorRu).file}
                                                className={classes.colorImg}
                                                width="24"
                                                height="12"
                                                alt=""
                                            />
                                            {(properties.color || properties.colorRu).name}
                                        </p>
                                        {properties.features.map(feature => {
                                            return <p className={classes.p}>+ {feature.name} (<span className={styles.featureValue}>
                                                {` + ${formatMoney(feature.value)} `}
                                            </span>)</p>;
                                        })}
                                    </TableCell>
                                    <TableCell className={classes.rowLabelSmall} colSpan={3} align="right">
                                        {formatMoney(unitPrice)}
                                    </TableCell>
                                    <TableCell className={classes.rowLabelSmall} colSpan={3} align="right">
                                        {formatMoney(unitPrice * quantity)}
                                    </TableCell>
                                </TableRow>;
                            })
                        }
                    </TableBody>
                </Table>
            </Paper>
            <Typography variant='h6' className={classes.title}>Сумма заказа</Typography>
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
                            <TableCell className={classes.rowLabel} colSpan={4}>Цена за товары (без скидки)</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{formatMoney(productsPrice)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Размер скидки</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{formatMoney(sharesPrice)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.rowLabel} colSpan={4}>Всего</TableCell>
                            <TableCell className={classes.rowLabel} align="center">{formatMoney(totalPrice)}</TableCell>
                        </TableRow>
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

export default connect(null, mapDispatchToProps)(withStyles(materialStyles)(OrderForm));
