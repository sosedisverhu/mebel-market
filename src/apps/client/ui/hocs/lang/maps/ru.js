/* eslint-disable max-len */
import React from 'react';
export default {
    main: {
        slider: 'Помочь с выбором'
    },
    articles: {
        moreBtn: 'Подробнее',
        sections: [
            {
                id: 1,
                title: 'Салон или интернет-магазин? Или где лучше покупать мебель?',
                introduction: <p>
                В наше прогрессивное время ничего не стоит на месте, все развивается активно и стремительно. Благодаря интернету можно решать многие вопросы, не выходя из офиса или дома. Весьма популярными стали онлайн покупки, в том числе и в мебельной отрасли. Сегодня купить мебель можно, как в интернет-магазине, так и непосредственно в мебельном салоне. Одни покупатели предпочитают первый вариант, а другие – выбирают второй. Чем это обусловлено? Где же лучше совершать покупки? В интернете или реальном магазине?</p>,
                date: new Date().toLocaleDateString('ru', {day: 'numeric', month: 'long', year: 'numeric'}).replace('г.', 'года'),
                content: <div>
                    <h2>Преимущества приобретения мебели в онлайн магазине</h2>
                    <p>Разнообразную мебель интернет предлагает приобрести за весьма заманчивыми ценами. Многочисленные интернет-магазины специализируются именно на данной продукции.</p><br/><br/>
                    <p>Основные плюсы покупки мебельных предметов онлайн:</p><br/>
                    <ul>
                        <li>Значительная экономия времени, нет необходимости никуда ехать;</li>
                        <li>Огромнейший ассортимент, который невозможно разместить на торговых площадях;</li>
                        <li>Как правило более низкие цены, нежели в реальных магазинах;</li>
                        <li>Возможность ознакомиться детально с характеристиками, рекомендациями и полезной информацией;</li>
                        <li>Наличие отзывов, критики и советов от других покупателей.</li>
                    </ul>
                    <h2>Плюсы покупки мебельных изделий в салоне</h2>
                    <img src="/src/apps/client/ui/components/Article/img/article-content.jpg" alt=""/><br/><br/>
                    <p>Посещение салона или наземного магазин мебели имеет свои неоспоримые преимущества. Это прежде всего то, что покупаемый товар вы сможете рассмотреть очень внимательно и детально, выявить его дефекты или их отсутствие. Вы можете даже посидеть на диване или кресле, прочувствовать свои ощущение. Фотография выбираемой мебели в интернете этого всего не позволит. Можно просто прогадать с оттенком и расцветкой, выбрать обивку, которая в итоге не понравиться.<br/><br/>
                    Еще одним приятным моментом покупки в салоне является то, что можно поговорить вживую с продавцом-консультантом, задав ему интересующие вопросы. Он может посоветовать что-то более подходящее или менее дорогое. Это поможет сделать оптимально правильный выбор.</p><br/><br/>
                    <p>“Пример написания цитаты” -Автор</p><br/><br/>
                    <div>
                        <h2>Видео Youtube</h2>
                        <img src="/src/apps/client/ui/components/Article/img/video-youtube.jpg" alt=""/>
                    </div>
                </div>
            },
            {
                id: 2,
                title: 'Выбираем правильно и обдумано угловой диван',
                introduction: <p>
                Диваны – востребованная и весьма актуальная мягкая мебель. Ее устанавливают, как в жилых, так и офисных помещениях, ведь это удобно, комфортно и рационально. Это прекрасное место для отдыха, общения в кругу семьи и приема гостей. Многие модели используются для сна. Поэтому к выбору и покупке данной мебели следует подходить со всей ответственностью.<br/>
                Для максимально рационального и полезного использования пространства в помещении лучше приобрести угловые диваны.</p>,
                date: new Date().toLocaleDateString('ru', {day: 'numeric', month: 'long', year: 'numeric'}).replace('г.', 'года')
            }
        ]
    }
};
