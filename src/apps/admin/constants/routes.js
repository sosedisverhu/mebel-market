export default [
    { id: 'orders', section: 'orders', path: '/admin', exact: true, title: 'Заказы' },
    { id: 'products', section: 'products', path: '/admin/products', exact: true, title: 'Товары' },
    { id: 'articles', section: 'articles', path: '/admin/articles', exact: true, title: 'Статьи' },
    { id: 'mainSlider', section: 'main', path: '/admin/slider', exact: true, title: 'Слайдер' },
    { id: 'credentials', section: 'credentials', path: '/admin/credentials', exact: true, title: 'Смена учетных данных', notMenu: true },
    { id: 'partners', section: 'partners', path: '/admin/partners', exact: true, title: 'Партнёры' },
    { id: 'reviews', section: 'reviews', path: '/admin/reviews', exact: true, title: 'Комментарии' },
    { id: 'seo', section: 'seo', path: '/admin/seo', exact: true, title: 'SEO' },
    { id: 'admin', section: 'admins', path: '/admin/admins', exact: true, title: 'Админы' },
    { id: 'db', path: 'db', exact: true, title: 'База данных', notMenu: true }
];
