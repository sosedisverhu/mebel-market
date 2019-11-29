import React, { Component } from 'react';

import { connect } from 'react-redux';

import Advantages from '../../components/Advantages/Advantages';

class MainPage extends Component {
    render () {
        return (
            <Advantages />
        );
    }
}

export default connect()(MainPage);
