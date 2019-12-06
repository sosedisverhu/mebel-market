import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

const outsideClick = WrappedComponent => {
    let clickFn;
    class OutsideClick extends PureComponent {
        state = {
            outsideClickEnabled: false
        };

        componentWillUnmount () {
            document.addEventListener('mousedown', clickFn);
            document.addEventListener('touchstart', clickFn);
        }

        turnOnClickOutside = (component, handleOutsideClick) => {
            this.setState({
                outsideClickEnabled: true
            });

            clickFn = ((localNode, eventHandler) => event => {
                let source = event.target;
                let found = false;

                while (source.parentNode) {
                    found = source === localNode;

                    if (found) {
                        return;
                    }
                    source = source.parentNode;
                }
                this.handleClick();

                eventHandler.call(component, event);
            })(ReactDOM.findDOMNode(component), handleOutsideClick);

            document.addEventListener('mousedown', clickFn);
            document.addEventListener('touchstart', clickFn);
        };

        handleClick = () => {
            document.removeEventListener('mousedown', clickFn);
            document.removeEventListener('touchstart', clickFn);

            this.setState({
                outsideClickEnabled: false
            });
        };

        render () {
            return <WrappedComponent
                {...this.props}

                outsideClickEnabled={this.state.outsideClickEnabled}

                turnOnClickOutside={this.turnOnClickOutside}
            />;
        }
    }

    return OutsideClick;
};

export default outsideClick;
