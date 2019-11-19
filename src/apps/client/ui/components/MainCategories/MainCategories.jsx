import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './MainCategories.css';

class MainCategories extends Component {
    render () {
        return <div className={styles.categoriesWrap}>
            <div className={styles.categories}>
                <a className={styles.category} href='#'>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src="/src/apps/client/ui/components/MainCategories/img/category1.jpg" alt="" />
                    </div>
                    <h3 className={styles.title}>Кровати</h3>
                </a>
                <a className={styles.category} href='#'>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src="/src/apps/client/ui/components/MainCategories/img/category2.jpg" alt="" />
                    </div>
                    <h3 className={styles.title}>Матрасы</h3>
                </a>
                <a className={styles.category} href='#'>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} src="/src/apps/client/ui/components/MainCategories/img/category3.jpg" alt="" />
                    </div>
                    <h3 className={styles.title}>Мягкая мебель </h3>
                </a>
                <a className={styles.category} href='#'>
                    <div className={styles.imgWrap}>
                        <img className={styles.img} className={styles.img} src="/src/apps/client/ui/components/MainCategories/img/category4.jpg" alt="" />
                    </div>
                    <h3 className={styles.title}>Аксессуары для сна</h3>
                </a>
            </div>
        </div>;
    }
}

export default connect()(MainCategories);
