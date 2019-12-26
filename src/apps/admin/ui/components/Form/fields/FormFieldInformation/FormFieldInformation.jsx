import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const materialStyles = () => ({
    table: {
        margin: '10px 0 10px'
    },
    rowLabel: {
        '@media (max-width: 1024px)': {
            padding: '4px 24px'
        },
        '@media (max-width: 780px)': {
            padding: '4px 12px'
        }
    },
    test: {
        width: '100%',
        backgroundColor: 'blue'
    }
});

class FormFieldInformation extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        schema: PropTypes.object
    };

    static defaultProps = {
        schema: {}
    };

    render () {
        const { schema, classes } = this.props;

        return (
            <Paper className={classes.table}>
                <Table>
                    {schema.values.map((value, i) => {
                        return (
                            <TableRow key={i}>
                                <TableCell colSpan={4} className={classes.rowLabel}>
                                    {value.name}
                                </TableCell>
                                <TableCell className={classes.rowLabel} align="justify">
                                    {value.value}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </Table>
            </Paper>
        );
    }
}

export default withStyles(materialStyles)(FormFieldInformation);
