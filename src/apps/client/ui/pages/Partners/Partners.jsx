import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import propOr from '@tinkoff/utils/object/propOr';

import styles from './Partners.css';

const mapStateToProps = ({ application }) => {
    return {
        langMap: application.langMap
    };
};

class Partners extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired
    };

    render () {
        const { langMap } = this.props;
        const text = propOr('deliveryAndPayment', {}, langMap);

        return (
            <h1>Partners</h1>
        );
    }
}

export default connect(mapStateToProps)(Partners);
