import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import findProductsByText from '../../product/queries/findProductsByText';
import findArticlesByText from '../../article/queries/findArticlesByText';

export default function availableProductsArticlesSearch (req, res) {
    const { text = '' } = req.query;

    Promise.all([
        findProductsByText(text),
        findArticlesByText(text)
    ])
        
        .then(([productsAll, articlesAll]) => {
            const availableProducts = productsAll
                .filter(product => !product.hidden)
                .sort((prev, next) => next.date - prev.date);

            const availableArticles = articlesAll
                .filter(article => !article.hidden)
                .sort((prev, next) => next.date - prev.date);

            res.status(OKEY_STATUS_CODE).send({
                products: availableProducts,
                articles: availableArticles
            });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
