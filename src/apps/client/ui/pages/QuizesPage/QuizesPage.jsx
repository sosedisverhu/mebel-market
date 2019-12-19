import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';

import styles from './QuizesPage.css';

const mapStateToProps = ({ data, application }) => {
    return {
        langMap: application.langMap,
        quizes: data.quizes,
        products: data.products
    };
};

class QuizesPage extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        products: PropTypes.array.isRequired,
        quizes: PropTypes.array.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            activeQuizIndex: 0,
            ...this.getInitialFilterParams(),
            filters: [],
            filteredProducts: [],
            viewProducts: false
        };
    }

    getInitialFilterParams = () => {
        const result = [];
        this.props.quizes.forEach(quiz => {
            result.push({ [quiz.name]: null });
        });
        return result;
    }

    getFilters = () => {
        const filters = [];
        this.props.quizes.forEach(quiz => {
            if (this.state[quiz.name]) filters.push({ [quiz.name]: this.state[quiz.name] });
        });
        return filters;
    }

    handleClickNext = () => {
        this.setState(state => ({
            activeQuizIndex: state.activeQuizIndex + 1,
            filters: this.getFilters()
        }));
    }

    handleClickSkip = () => {
        this.setState(state => ({ activeQuizIndex: state.activeQuizIndex + 1 }));
    }

    handleClickResult = () => {
        const { products } = this.props;
        const filteredProducts = products;
        this.setState({ filteredProducts, viewProducts: true });
    }

    handleOptionChange = fieldName => e => {
        this.setState({ [fieldName]: e.target.value });
    }

    render () {
        const { langMap, quizes } = this.props;
        const { activeQuizIndex, viewProducts, filteredProducts } = this.state;
        const text = propOr('quizesPage', {}, langMap);

        return (<div className={styles.quizesPage}>
            <Breadcrumbs />
            {(viewProducts)
                ? <div className={styles.productsSectionWrap}>
                    <h1 className={styles.quantity}>{`${text.products} ${filteredProducts.length}`}</h1>
                    <section className={styles.productsSection}>
                        {(filteredProducts.length)
                            ? <ProductsGrid products={filteredProducts} />
                            : <p className={styles.noProducts}>{text.noProducts}</p>}
                    </section>
                </div>
                : <section className={styles.quizesSectionWrap}>
                    <div className={styles.quizesSection}>
                        <div className={styles.content}>
                            <h1 className={styles.title}>{text.title}</h1>
                            <p className={styles.description}>{text.description}</p>
                            <div className={styles.quizesWrap}>
                                <div className={styles.topPanel}>
                                    {quizes.map((quiz, index) => {
                                        return <div className={classNames(
                                            styles.quizTitle,
                                            { [styles.completed]: index < activeQuizIndex },
                                            { [styles.active]: index === activeQuizIndex }
                                        )}>
                                            <span className={styles.quizTitleNumber}>{index + 1}</span>
                                            <h3 className={styles.quizTitleText}>{quiz.title}</h3>
                                        </div>;
                                    })}
                                </div>
                                {quizes.map((quiz, index) => {
                                    return <div key={quiz.name} className={classNames(styles.options, { [styles.active]: index === activeQuizIndex })}>
                                        {quiz.options.map(option => {
                                            return <div className={styles.radio} key={option.id}>
                                                <label className={styles.label}>
                                                    <input
                                                        className={styles.inputRadio}
                                                        type="radio"
                                                        name={quiz.name}
                                                        value={option.value}
                                                        checked={this.state[quiz.name] === option.value}
                                                        onChange={this.handleOptionChange(quiz.name)} />
                                                    <div className={styles.imgRadioWrap}>
                                                        <img className={styles.imgRadio} src={option.img} alt={option.text} />
                                                    </div>
                                                    <div className={styles.textRadio}><span className={styles.checkmark}></span>{option.text}</div>
                                                </label>
                                            </div>;
                                        })}
                                    </div>;
                                })}
                                {(activeQuizIndex === quizes.length - 1)
                                    ? <button className={styles.btnResult} onClick={this.handleClickResult} type="submit">{text.result}</button>
                                    : (<div className={styles.buttons}>
                                        <button className={styles.btnNext} type="button" onClick={this.handleClickNext}>{text.next}</button>
                                        <button className={styles.btnSkip} type="button" onClick={this.handleClickSkip}>{text.skip}</button>
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </section>}
            <div className={styles.decor}></div>
        </div>);
    }
}

export default connect(mapStateToProps)(QuizesPage);
