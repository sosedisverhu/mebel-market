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
        langMap: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            activeQuizIndex: 0,
            ...this.getInitialState(),
            filters: [],
        }
    }

    getInitialState = () => {
        const result = [];
        this.props.quizes.forEach(quiz => {
            result.push({ [quiz.name]: null })
        })
        return result;
    }

    getFilters = () => {
        const filters = [];
        this.props.quizes.forEach(quiz => {
            if (this.state[quiz.name]) filters.push({ [quiz.name]: this.state[quiz.name] })
        });
        return filters;
    }

    nextQuiz = () => {
        this.setState(state => ({
            activeQuizIndex: state.activeQuizIndex + 1,
            filters: this.getFilters()
        }));
    }

    skipQuiz = () => {
        this.setState(state => ({ activeQuizIndex: state.activeQuizIndex + 1 }));
    }

    handleOptionChange = fieldName => e => {
        this.setState({ [fieldName]: e.target.value });
    }



    render() {
        const { langMap, quizes, products } = this.props;
        const { activeQuizIndex, filters } = this.state;
        const text = propOr('quizesPage', {}, langMap);
        const activeQuiz = quizes.find((quiz, index) => index === activeQuizIndex);

        console.log('this.state', this.state);
        console.log('filters', filters);

        return (<div>
            <Breadcrumbs />
            <section className={styles.quizesSection}>
                <div className={styles.content}>
                    <h1 className={styles.title}>{text.title}</h1>
                    <p className={styles.description}>{text.description}</p>
                    <div className={styles.quizesWrap}>
                        <div className={styles.topPanel}>
                            {quizes.map((quiz, index) => {
                                return <div className={classNames(
                                    styles.quizTitle,
                                    { [styles.completed]: index < activeQuizIndex },
                                    { [styles.active]: index === activeQuizIndex },
                                    )}>
                                    <span className={styles.quizTitleNumber}>{index + 1}</span>
                                    <h3 className={styles.quizTitleText}>{quiz.title}</h3>
                                </div>
                            })}
                        </div>
                        {quizes.map((quiz, index) => {
                            console.log('activeQuizIndex', activeQuizIndex);
                            console.log('quizes[quizes.length - 1]', quizes[quizes.length - 1]);
                            return <div key={quiz.name} className={classNames(styles.options, { [styles.active]: index === activeQuizIndex })}>
                                {quiz.options.map(option => {
                                    return <div className={styles.radio} key={option.id}>
                                        <label className={styles.label}>
                                            <img src={option.img} alt={option.text} />
                                            <input
                                                className={styles.inputRadio}
                                                type="radio"
                                                name={quiz.name}
                                                value={option.value}
                                                checked={this.state[quiz.name] === option.value}
                                                onChange={this.handleOptionChange(quiz.name)} />
                                            <div className={styles.textRadio}><span className={styles.checkmark}></span>{option.text}</div>
                                        </label>
                                    </div>
                                })}
                            </div>
                        })}
                        {(activeQuizIndex === quizes.length - 1)
                            ? <button className={styles.btnResult} type="submit">{text.result}</button>
                            : (<div className={styles.buttons}>
                                <button className={styles.btnNext} type="button" onClick={this.nextQuiz}>{text.next}</button>
                                <button className={styles.btnSkip} type="button" onClick={this.skipQuiz}>{text.skip}</button>
                            </div>)}

                    </div>
                </div>
            </section>
            <section className={styles.productsSection}>
                <ProductsGrid products={products} />
            </section>
            <div className={styles.decor}></div>
        </div>);
    }
}

export default connect(mapStateToProps)(QuizesPage);
