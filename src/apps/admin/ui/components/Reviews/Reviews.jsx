import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import format from 'date-fns/format';

import ReviewForm from '../../components/ReviewForm/ReviewForm';

const ROWS_PER_PAGE = 10;

class Reviews extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onDelete: PropTypes.func.isRequired,
        onAllowForms: PropTypes.func.isRequired,
        updateReviews: PropTypes.func.isRequired,
        reviews: PropTypes.array,
        headerRows: PropTypes.array.isRequired,
        name: PropTypes.string,
        isDeleteButton: PropTypes.bool,
        reviewsIsShow: PropTypes.bool
    };

    static defaultProps = {
        reviews: [],
        name: 'Отзывы',
        isDeleteIcon: false
    };

    constructor (...args) {
        super(...args);

        this.state = {
            formShowed: false,
            editableReview: null,
            page: 0
        };

        this.tableCells = [
            { prop: review => review.user.name },
            { prop: review => review.user.emailOrPhone },
            { prop: review => format(review.date, 'HH:mm - dd.MM.yyyy') },
            { prop: review => review.user.mark }
        ];
    }

    componentDidMount () {
        this.setState({ rowsPerPage: this.props.reviews.length });
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.reviews !== this.props.reviews) {
            this.setState({
                rowsPerPage: nextProps.reviews.length > ROWS_PER_PAGE ? ROWS_PER_PAGE : nextProps.reviews.length
            });
        }
    }

    handleFormOpen = review => () => {
        this.props.onAllowForms();
        this.setState({
            formShowed: true,
            editableReview: review
        });
    };

    handleCloseReviewForm = () => {
        this.setState({
            formShowed: false,
            editableReview: null
        });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = ({ target: { value } }) => {
        const { reviews } = this.props;
        const rowsPerPage = reviews.length > value ? value : reviews.length;

        this.setState({ rowsPerPage });
    };

    render () {
        const { classes, reviews, headerRows, name, isDeleteButton, onDelete, reviewsIsShow, updateReviews } = this.props;
        const { editableReview, formShowed, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, reviews.length - page * rowsPerPage);

        return <div>
            <Paper className={classes.paper}>
                <Toolbar
                    className={classes.toolbar}
                >
                    <Typography variant='h6' id='tableTitle' className={classes.tableTitle}>
                        {name}
                    </Typography>
                    <div className={classes.spacer}/>
                </Toolbar>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby='tableTitle'>
                        <TableHead>
                            <TableRow>
                                {headerRows.map(
                                    (row, i) => (
                                        <TableCell key={i} className={classes.rowLabel}>
                                            {row.label}
                                        </TableCell>
                                    )
                                )}
                                <TableCell align='right' className={classes.rowLabel}/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviews
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((value, i) => {
                                    return (
                                        <TableRow
                                            hover
                                            role='checkbox'
                                            tabIndex={-1}
                                            key={i}
                                            className={classes.row}
                                        >
                                            {this.tableCells.map((tableCell, i) =>
                                                <TableCell key={i} className={classes.rowLabel}>
                                                    {tableCell.prop(value)}
                                                </TableCell>)}
                                            <TableCell padding='checkbox' align='right'>
                                                <div className={classes.valueActions}>
                                                    <IconButton onClick={this.handleFormOpen(value)}
                                                        className={classes.rowLabel}>
                                                        <EditIcon/>
                                                    </IconButton>
                                                    {isDeleteButton &&
                                                    <IconButton onClick={() => onDelete(value)}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component='div'
                    count={reviews.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
            <Modal open={reviewsIsShow && formShowed} onClose={this.handleCloseReviewForm} className={classes.modal}>
                <Paper className={classes.modalContent}>
                    <ReviewForm
                        review={editableReview}
                        onDone={this.handleCloseReviewForm}
                        onDelete={onDelete}
                        handleCloseForm={this.handleCloseReviewForm}
                        isDeleteButton={isDeleteButton}
                        updateReviews={updateReviews}
                    />
                </Paper>
            </Modal>
        </div>;
    }
}

export default Reviews;
