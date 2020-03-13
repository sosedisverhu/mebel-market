import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { matchPath } from 'react-router';

import routes from '../../../constants/routes';

import { withRouter, Link } from 'react-router-dom';

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

import { connect } from 'react-redux';
import logout from '../../../services/logout';

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
    }
};

const mapStateToProps = ({ application }) => {
    return {
        admin: application.admin
    };
};

const mapDispatchToProps = (dispatch) => ({
    logout: payload => dispatch(logout(payload))
});

class Header extends Component {
    static propTypes = {
        location: PropTypes.object,
        classes: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
        admin: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    state = {
        menuShowed: false
    };

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
        const { classes, admin } = this.props;
        const { menuShowed } = this.state;

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
                    <MenuIcon />
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
                                            return includes(route.section, admin.sections) && <MenuItem key={i} component={Link} onClick={this.handleClose} to={route.path}>{route.title}</MenuItem>;
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
