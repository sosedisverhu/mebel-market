import React, { Component } from 'react';

import { connect } from 'react-redux';

import Slider from '../../components/Slider/Slider';

class MainPage extends Component {
    render () {
        return (
            <Slider />
        );
    }
}

export default connect()(MainPage);
