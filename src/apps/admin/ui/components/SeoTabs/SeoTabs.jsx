import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import SeoForm from '../SeoForm/SeoForm.jsx';

import { connect } from 'react-redux';
import getAllSeo from '../../../services/getAllSeo';
import updateSeo from '../../../services/updateSeo';

import find from '@tinkoff/utils/array/find';

const materialStyles = () => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: '15px',
        flexBasis: '33.33%',
        flexShrink: 0
    }
});

const mapStateToProps = ({ data }) => {
    return {
        allStaticSeo: data.allSeo
    };
};

const mapDispatchToProps = (dispatch) => ({
    getAllStaticSeo: payload => dispatch(getAllSeo(payload)),
    updateStaticSeo: payload => dispatch(updateSeo(payload))
});

class SeoTabs extends Component {
  static propTypes = {
      classes: PropTypes.object.isRequired,
      pages: PropTypes.array.isRequired,
      getAllStaticSeo: PropTypes.func.isRequired,
      updateStaticSeo: PropTypes.func.isRequired,
      allStaticSeo: PropTypes.array
  };

  static defaultProps = {
      allStaticSeo: []
  };

  constructor (props) {
      super(props);

      this.state = {
          panel: {}
      };
  }

    handleChange = panelClicked => () => {
        this.setState({ panel: {
            ...this.state.panel,
            [panelClicked]: this.state.panel[panelClicked] !== true
        }
        });
    };

    handleStaticSeoFormDone = (pageName) => values => {
        return this.props.updateStaticSeo({ ...values, name: pageName })
            .then(this.props.getAllStaticSeo);
    };

    renderSeoForm = i => {
        const { pages, allStaticSeo } = this.props;
        const page = pages[i].page;
        const seoStaticPage = find(seoPage => seoPage.name === page, allStaticSeo);
        const seo = seoStaticPage || {};
        const values = {
            ...seo,
            name: page
        };

        return <SeoForm
            values={values}
            onSubmit={this.handleStaticSeoFormDone(page)}
        />;
    };

    render () {
        const { classes, pages } = this.props;

        return <div className={classes.root}>
            {
                pages.map((page, i) => {
                    return <ExpansionPanel key={i} expanded={this.state.panel[`panel${i}`]} onClick={this.handleChange(`panel${i}`)}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls={`panel${i}bh-content`}
                            id={`panel${i}bh-header`}
                        >
                            <Typography className={classes.heading}>{pages[i].title}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {this.renderSeoForm(i)}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>;
                })
            }
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(SeoTabs));
