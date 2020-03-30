import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import routes from '../../../constants/routes';

import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import logout from '../../../services/logout';
import getOrders from '../../../services/getOrders';
import getReviews from '../../../services/getReviews';

import includes from '@tinkoff/utils/array/includes';
import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';

const materialStyles = {
    title: {
        flexGrow: 1
    },
    popper: {
        zIndex: 3
    },
    button: {
        textAlign: 'center'
    },
    notification: {
        width: '18px',
        height: '18px',
        position: 'absolute',
        top: '0',
        right: '0',
        paddingBottom: '2px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '12px',
        background: 'red',
        borderRadius: '50%'
    },
    smallNotification: {
        fontSize: '9px'
    }
};

const mapStateToProps = ({ application, data }) => {
    return {
        admin: application.admin,
        orders: data.orders,
        reviews: data.reviews
    };
};

const mapDispatchToProps = dispatch => ({
    logout: payload => dispatch(logout(payload)),
    getOrders: payload => dispatch(getOrders(payload)),
    getReviews: payload => dispatch(getReviews(payload))
});

class Header extends Component {
    static propTypes = {
        location: PropTypes.object,
        classes: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        getOrders: PropTypes.func.isRequired,
        getReviews: PropTypes.func.isRequired,
        admin: PropTypes.object,
        orders: PropTypes.array,
        reviews: PropTypes.array
    };

    static defaultProps = {
        location: {},
        orders: [],
        reviews: []
    };

    state = {
        menuShowed: false,
        notificationRoutesIds: [],
        notifications: 0
    };

    componentDidMount () {
        const { admin, getOrders, getReviews } = this.props;
        const ordersRoute = routes.find(route => route.id === 'orders');
        const reviewsRoute = routes.find(route => route.id === 'reviews');
        const notificationRoutesIds = [];

        if (includes(ordersRoute.section, admin.sections)) {
            getOrders();
            notificationRoutesIds.push('orders');
        }
        if (includes(reviewsRoute.section, admin.sections)) {
            getReviews();
            notificationRoutesIds.push('reviews');
        }

        this.setState({ notificationRoutesIds });
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.orders !== nextProps.orders || this.props.reviews !== nextProps.reviews) {
            this.setState({ notifications: nextProps.orders.length + nextProps.reviews.length });
        }
    }

    getHeaderTitle = () => {
        const { location: { pathname } } = this.props;
        const match = find(route => matchPath(pathname, route), routes);

        return propOr('title', 'Такой страницы не существует', match);
    };

    handleToggle = () => {
        this.setState({
            menuShowed: !this.state.menuShowed
        });
    };

    handleClose = () => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ menuShowed: false });
    };

    handleLogout = () => {
        this.props.logout();
    };

    render () {
        const { classes, admin, orders, reviews } = this.props;
        const { menuShowed, notifications } = this.state;

        return <AppBar position='static'>
            <Toolbar>
                <IconButton
                    color='inherit'
                    aria-label='Menu'
                    onClick={this.handleToggle}
                    buttonRef={node => {
                        this.anchorEl = node;
                    }}
                >
                    <MenuIcon/>
                    {notifications &&
                    <span className={classNames(classes.notification, { [classes.smallNotification]: notifications > 9 })}>
                        {notifications < 100 ? notifications : '99+'}
                    </span>}
                </IconButton>
                <Popper open={menuShowed} anchorEl={this.anchorEl} className={classes.popper} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        {routes.map((route, i) => {
                                            if (route.notMenu) {
                                                return null;
                                            }
                                            return includes(route.section, admin.sections) &&
                                                <div key={i}>
                                                    <MenuItem component={Link} onClick={this.handleClose} to={route.path}>{route.title}</MenuItem>;
                                                </div>;
                                        })}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
                <Typography variant='h6' color='inherit' className={classes.title}>
                    {this.getHeaderTitle()}
                </Typography>
                <Button color='inherit'>{admin.login}</Button>
                <Button color='inherit' component={Link} to='/admin/credentials'>Сменить учетные данные</Button>
                <Button color='inherit' onClick={this.handleLogout}>Выйти</Button>
            </Toolbar>
        </AppBar>;
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(Header)));
