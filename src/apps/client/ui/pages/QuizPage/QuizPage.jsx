import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, matchPath } from 'react-router-dom';
import classNames from 'classnames';

import propOr from '@tinkoff/utils/object/propOr';
import find from '@tinkoff/utils/array/find';

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs.jsx';
import ProductsGrid from '../../components/ProductsGrid/ProductsGrid';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

import styles from './QuizPage.css';

const mapStateToProps = ({ data, application }) => {
    return {
        langMap: application.langMap,
        langRoute: application.langRoute,
        lang: application.lang,
        quizzes: data.quizzes,
        products: data.products
    };
};

class QuizPage extends Component {
    static propTypes = {
        langMap: PropTypes.object.isRequired,
        products: PropTypes.array.isRequired,
        quizzes: PropTypes.array.isRequired,
        langRoute: PropTypes.string.isRequired,
        lang: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired
    };

    static defaultProps = {
        langRoute: '',
        quizzes: [],
        lang: 'ru'
    };

    constructor (props) {
        super(props);

        this.state = {
            activeStepIndex: 0,
            filters: [],
            filteredProducts: [],
            viewProducts: false,
            ...this.getQuizByAlias()
        };
    }

    getQuizByAlias = () => {
        const { location: { pathname }, langRoute, quizzes } = this.props;
        const QUIZ_PATH = `${langRoute}/quiz/:alias`;
        const match = matchPath(pathname, { path: QUIZ_PATH, exact: true });
        const quiz = find(quiz => quiz.alias === match.params.alias, quizzes);

        this.notFoundPage = !quiz;

        return { quiz };
    };

    updateFilters = (stepName) => {
        if (this.state[stepName]) {
            this.setState(state => ({
                filters: [...state.filters, { [stepName]: state[stepName] }]
            }));
        }
    }

    scrollToTop = () => {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }

    handleClickNext = (stepName) => {
        this.setState(state => ({ activeStepIndex: state.activeStepIndex + 1 }));
        this.updateFilters(stepName);
        this.scrollToTop();
    }

    handleClickSkip = () => {
        this.setState(state => ({ activeStepIndex: state.activeStepIndex + 1 }));
        this.scrollToTop();
    }

    handleClickResult = (stepName) => {
        const { products } = this.props;
        const filteredProducts = products;

        this.setState({ filteredProducts, viewProducts: true });
        this.updateFilters(stepName);
        this.scrollToTop();
    }

    handleOptionChange = fieldName => e => {
        this.setState({ [fieldName]: e.target.value });
    }

    render () {
        const { langMap, lang } = this.props;
        const { quiz, activeStepIndex, viewProducts, filteredProducts } = this.state;
        const text = propOr('quizPage', {}, langMap);

        if (this.notFoundPage) {
            return <NotFoundPage />;
        }

        return (<div className={styles.quizPage}>
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
                : <section className={styles.quizSectionWrap}>
                    <div className={styles.quizSection}>
                        <div className={styles.content}>
                            <h1 className={styles.title}>{text.title}</h1>
                            <p className={styles.description}>{text.description}</p>
                            <div className={styles.quizWrap}>
                                <div className={styles.topPanel}>
                                    {quiz.steps[lang].map((step, index) => {
                                        return <div key={index} className={classNames(
                                            styles.stepTitle,
                                            { [styles.completed]: index < activeStepIndex },
                                            { [styles.active]: index === activeStepIndex }
                                        )}>
                                            <span className={styles.stepTitleNumber}>{index + 1}</span>
                                            <h3 className={styles.stepTitleText}>{step.name}</h3>
                                        </div>;
                                    })}
                                </div>
                                {quiz.steps[lang].map((step, index) => {
                                    return <div key={step.id} className={classNames(styles.options, { [styles.active]: index === activeStepIndex })}>
                                        {step.options.map(option => {
                                            return <div className={styles.radio} key={option.id}>
                                                <label className={styles.label}>
                                                    <input
                                                        className={styles.inputRadio}
                                                        type="radio"
                                                        name={step.name}
                                                        value={option.name}
                                                        checked={this.state[step.name] === option.name}
                                                        onChange={this.handleOptionChange(step.name)} />
                                                    <div className={styles.imgRadioWrap}>
                                                        <img className={styles.imgRadio} src={option.file.files[0]} alt={option.name} />
                                                    </div>
                                                    <div className={styles.textRadio}><span className={styles.checkmark}></span>{option.name}</div>
                                                </label>
                                            </div>;
                                        })}
                                    </div>;
                                })}
                                {(activeStepIndex === quiz.steps[lang].length - 1)
                                    ? (<button
                                        className={styles.btnResult}
                                        onClick={() => this.handleClickResult(quiz.steps[lang][activeStepIndex].name)}
                                        type="submit">{text.result}</button>)
                                    : (<div className={styles.buttons}>
                                        <button
                                            className={styles.btnNext}
                                            onClick={() => this.handleClickNext(quiz.steps[lang][activeStepIndex].name)}
                                            type="button" >{text.next}</button>
                                        <button
                                            className={styles.btnSkip}
                                            onClick={this.handleClickSkip}
                                            type="button">{text.skip}</button>
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </section>}
            <div className={styles.decor}></div>
        </div>);
    }
}

export default withRouter(connect(mapStateToProps)(QuizPage));
