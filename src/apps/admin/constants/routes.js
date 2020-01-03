export default [
    { id: 'mainSlider', section: 'main', path: '/admin', exact: true, title: 'Главная' },
    { id: 'categories', section: 'products', path: '/admin/categories', exact: true, title: 'Категории' },
    { id: 'products', section: 'products', path: '/admin/products', exact: true, title: 'Товары' },
    { id: 'articles', section: 'articles', path: '/admin/articles', exact: true, title: 'Статьи' },
    { id: 'credentials', section: 'credentials', path: '/admin/credentials', exact: true, title: 'Смена учетных данных', notMenu: true },
    { id: 'partners', section: 'partners', path: '/admin/partners', exact: true, title: 'Партнёры' },
    { id: 'seo', section: 'seo', path: '/admin/seo', exact: true, title: 'SEO' },
    { id: 'admin', section: 'admins', path: '/admin/admins', exact: true, title: 'Админы' }
];
