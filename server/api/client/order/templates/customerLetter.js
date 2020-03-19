/* eslint-disable */
import formatMoney from '../../../../../src/apps/client/utils/formatMoney';
import format from 'date-fns/format';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import find from '@tinkoff/utils/array/find';

function getGeaturesHTML(features) {
    let featuresHTML = '';
    features.forEach(feature => {
        featuresHTML = featuresHTML + `<tr><td style="font-size:15px;width:140px;vertical-align:top;padding-top:5px">${feature.name}</td></tr>`;
    });
    return featuresHTML;
}

function getCategoriesAlias(categoryId, subCategoryId, categories, subCategories) {
    const category = find(category => category.id === categoryId, categories).alias;
    const subCategory = find(subCategory => subCategory.id === subCategoryId, subCategories).alias;

    return `${category}/${subCategory}`;
}

export default function customerLetter (order, categories, subCategories, domain) {
    const { customer, delivery, payment, products } = order;
    const productsPrice = products.reduce((sum, { quantity, price, basePrice, properties }) => {
        const productPrice = price || basePrice;
        const featuresPrice = properties.features.reduce((sum, { value }) => sum + value, 0);

        return sum + (quantity * (productPrice + featuresPrice));
    }, 0);
    let productsHTML = '';

    products.forEach((product) => {
        const featuresPrice = product.properties.features.reduce((sum, { value }) => sum + value, 0);
        const unitPrice = (product.price || product.basePrice) + featuresPrice;
        const productLink = '/' + getCategoriesAlias(product.product.categoryId, product.product.subCategoryId, categories, subCategories) + '/' + product.product.alias;
        productsHTML =  productsHTML + `<tr>
        <td colspan="3" style="border-top:1px solid #f0f0f0;vertical-align:top">
            <table cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;margin-top:10px;margin-bottom:10px;width:100%">
                <tbody><tr>
                    <td align="center" style="padding-right:20px;padding-top:5px;padding-bottom:5px;width:200px;vertical-align:top;">
                        <a href=${domain + productLink} style="text-decoration:none;line-height:0" target="_blank">
                            <img src=${domain + product.product.avatar} border="0" width="80" height="95" alt=${product.productName} style="display:block;background-color:#ffffff; width: 100%; height: auto;" class="CToWUd">
                        </a>
                    </td>
                    <td style="padding-top:5px;padding-bottom:5px;vertical-align:top">
                        <table cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;width:100%">
                            <tbody><tr>
                                <td colspan="3" style="padding:0 0 3px 0;line-height:20px">
                                    <a href=${domain + productLink} style="color:#3e77aa;font-size:15px;text-decoration:none;word-break:break-word" target="_blank">${product.productName}</a><span style="white-space:nowrap;font-size:12px;color:#999999;padding-left:10px">${product.article}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size:15px;width:140px;vertical-align:top;padding-top:5px">${formatMoney(unitPrice)}</td>
                                <td style="font-size:15px;width:100px;vertical-align:top;padding-top:5px">${product.quantity} штк.</td>
                                <td style="font-size:18px;width:200px;vertical-align:top;text-align:right;color:#333333;padding-top:5px">${formatMoney(unitPrice * product.quantity)}</td>
                            </tr>
                            </tbody></table>
                        <table cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;width:100%;    margin-top:10px;">
                            <tbody>
                                <tr>
                                    <td style="font-size:15px;width:140px;vertical-align:top;padding-top:5px">Размер</td>
                                    <td style="font-size:15px;width:100px;vertical-align:top;padding-top:5px;text-align: right;">${product.properties.size.name}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:15px;width:140px;vertical-align:top;padding-top:5px">Цвет</td>
                                    <td style="font-size:15px;width:100px;vertical-align:top;padding-top:5px;text-align: right;">${product.properties.color.name}</td>
                                </tr>
                                ${product.properties.features.length
? `<tr>
                                    <td style="font-size:15px;width:140px;vertical-align:top;padding-top:15px"><strong>Дополнительно</strong></td>
                                </tr>`
: ''}
                                ${getGeaturesHTML(product.properties.features)}
                            </tbody></table>

                    </td>
                </tr>
                </tbody></table>

        </td>
    </tr>`;
});

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:v="urn:schemas-microsoft-com:vml">
<head>
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<!--    <meta content="width=device-width" name="viewport"/>-->
    <!--[if !mso]><!-->
    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
    <!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Shrikhand" rel="stylesheet" type="text/css"/>
    <link href="https://fonts.googleapis.com/css?family=Shrikhand" rel="stylesheet" type="text/css"/>
    <!--<![endif]-->
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }

        table,
        td,
        tr {
            vertical-align: top;
            border-collapse: collapse;
        }

        * {
            line-height: inherit;
        }

        a[x-apple-data-detectors=true] {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>
    <style id="media-query" type="text/css">
        @media (max-width: 700px) {

            .block-grid,
            .col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
            }

            .block-grid {
                width: 100% !important;
            }

            .col {
                width: 100% !important;
            }

            .col > div {
                margin: 0 auto;
            }

            img.fullwidth,
            img.fullwidthOnMobile {
                max-width: 100% !important;
            }

            .no-stack .col {
                min-width: 0 !important;
                display: table-cell !important;
            }

            .no-stack.two-up .col {
                width: 50% !important;
            }

            .no-stack .col.num4 {
                width: 33% !important;
            }

            .no-stack .col.num8 {
                width: 66% !important;
            }

            .no-stack .col.num4 {
                width: 33% !important;
            }

            .no-stack .col.num3 {
                width: 25% !important;
            }

            .no-stack .col.num6 {
                width: 50% !important;
            }

            .no-stack .col.num9 {
                width: 75% !important;
            }

            .video-block {
                max-width: none !important;
            }

            .mobile_hide {
                min-height: 0px;
                max-height: 0px;
                max-width: 0px;
                display: none;
                overflow: hidden;
                font-size: 0px;
            }

            .desktop_hide {
                display: block !important;
                max-height: none !important;
            }
        }
    </style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #ffffff;">
<!--[if IE]>
<div class="ie-browser"><![endif]-->
<table bgcolor="#ffffff" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
       style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; width: 100%;"
       valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
        <td style="word-break: break-word; vertical-align: top;" valign="top">
            <!--[if (mso)|(IE)]>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" style="background-color:#ffffff"><![endif]-->
            <div style="background-color: #414141; border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:10px solid #919191; border-right:0px solid transparent;">
                <div class="block-grid"
                     style="Margin: 0 auto; min-width: 320px; max-width: 680px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#414141;">
                        <!--[if (mso)|(IE)]>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center">
                                    <table cellpadding="0" cellspacing="0" border="0" style="width:680px">
                                        <tr class="layout-full-width" style="background-color:#414141"><![endif]-->
                        <!--[if (mso)|(IE)]>
                        <td align="center" width="680"
                            style="background-color:#414141;width:680px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: none; border-right: 0px solid transparent;"
                            valign="top">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:25px;">
                        <![endif]-->
                        <div class="col num12"
                             style="min-width: 320px; max-width: 680px; display: table-cell; vertical-align: top; width: 680px;">
                            <div style="width:100% !important;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style=" padding-top:30px; padding-bottom:25px; padding-right: 0px; padding-left: 0px;">
                                    <!--<![endif]-->
                                    <div align="center" class="img-container center autowidth"
                                         style="padding-right: 0px;padding-left: 0px;">
                                        <!--[if mso]>
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr style="line-height:0px">
                                                <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                        <![endif]--><a href="http://example.com/" style="outline:none" tabindex="-1"
                                                       target="_blank"> <img align="center" title="Logo" border="0"
                                                                             class="center autowidth"
                                                                             src=${domain + '/src/apps/client/ui/components/Header/img/logo.png'}
                                                                             style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; width: 100%; max-width: 300px; display: block;"
                                                                             width="123"/></a>
                                        <!--[if mso]></td></tr></table><![endif]-->
                                    </div>
                                    <!--[if (!mso)&(!IE)]><!-->
                                </div>
                                <!--<![endif]-->
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr><tr bgcolor='#ED755A'><td colspan='1' style='font-size:7px;line-height:10px'>&nbsp;</td></tr></table><![endif]-->
                        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                    </div>
                </div>
            </div>
            <div>
                <div class="block-grid"
                     style="Margin: 0 auto; min-width: 320px; max-width: 680px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #ffffff;>
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                <!--[if (mso)|(IE)]>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                            <table cellpadding="0" cellspacing="0" border="0" style="width:680px">
                                <tr class="layout-full-width" style="background-color:#ffffff"><![endif]-->
                <!--[if (mso)|(IE)]>
                <td align="center" width="680"
                    style="background-color:#ffffff;width:680px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;"
                    valign="top">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                <![endif]-->
                <div class="col num12"
                     style="min-width: 320px; max-width: 680px; display: table-cell; vertical-align: top; width: 680px;">
                    <div style="width:100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                            <!--<![endif]-->
                            <!--[if mso]>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding-right: 20px; padding-left: 20px; padding-top: 15px; padding-bottom: 20px; font-family: Arial, sans-serif">
                            <![endif]-->
                            <div style="color:#000000; font-family:Poppins, Arial, Helvetica, sans-serif; line-height:1.5;padding-top:30px; max-width: 680px; min-width: 640px;">
                                <div style="font-size: 14px; line-height: 1.5; color: #000000; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 21px; ">
                                    <h1 style="font-size:28px; line-height:32px; padding-bottom:15px; font-weight:normal; margin:0; color: #414141;">
                                        ${customer.name}, спасибо за ваш заказ!</h1>
                                    <p style="font-size:15px; line-height:24px; margin:0; color: #919191;">Ваша заявка принята.</p>
                                </div>
                            </div>
                            <!--[if mso]></td></tr></table><![endif]-->
                            <!--[if (!mso)&(!IE)]><!-->
                        </div>
                        <!--<![endif]-->
                    </div>
                </div>
                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
            </div>
            </div>
            </div>
            <!-- test -->
            <div>
                <table cellpadding="0" cellspacing="0" style="border-bottom:1px solid #cccccc;border-collapse:collapse;width:100%">
                    <tbody><tr>
                        <td style="padding:0 30px 15px 27px;vertical-align:top">
                            <table cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;line-height:24px;max-width:680px;min-width:640px;margin: 0 auto;font-family: Poppins, Arial, Helvetica, sans-serif;">
                                <tbody><tr>
                                    <td colspan="2" style="vertical-align:baseline">
                                        <h2 style="font-size:26px;margin:0;font-weight:normal;padding:20px 0 10px 0;color: #414141;">Заказ № ${order.shortId}</h2>
                                    </td>
                                    <td style="vertical-align:baseline;text-align:right;font-size:15px;color: #919191;">
                                    ${format(zonedTimeToUtc(new Date(), 'Europe/Kiev'), 'dd.MM.yyyy HH:mm')}</td>
                                </tr>
                                <tr>
                                    <td style="font-size:13px;padding-bottom:5px;width:280px;vertical-align:top;color:#999999">Название и цена товара</td>
                                    <td style="font-size:13px;padding-bottom:5px;width:100px;vertical-align:top;color:#999999">Кол-во</td>
                                    <td style="font-size:13px;padding-bottom:5px;width:200px;text-align:right;vertical-align:top;color:#999999">Сумма</td>
                                </tr>
                                ${productsHTML}
                                <tr>
                                    <td colspan="3" style="border-top:1px solid #f0f0f0;padding-top:17px;padding-bottom:17px">
                                        <table cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;width:100%">
                                            <tbody><tr>
                                                <td style="width:140px;vertical-align:top;padding:0;font-size:15px;">Доставка</td>
                                                <td style="vertical-align:top;padding:0;font-size:15px;">
                                                    ${delivery.texts.ru.option}
                                                    ${delivery.id === 'pickup'
                                                        ? delivery.texts.ru.description
                                                        : customer.address}
                                                </td>                                                
                                                <td style="width:180px;text-align:right;vertical-align:top;padding:0">
                                                    <span style="font-size:15px;font-style:italic"> ${delivery.price
                                                        ? formatMoney(delivery.price)
                                                        : 'бесплатно'}</span>
                                                </td>
                                            </tr>
                                            </tbody></table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="border-top:1px solid #f0f0f0;padding-top:17px;padding-bottom:17px">
                                        <table cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;width:100%">
                                            <tbody><tr>
                                                <td style="font-size:15px;vertical-align:top;width:140px">Оплата</td>
                                                <td style="font-size:15px;vertical-align:top">${payment.texts.ru.option}</td>
                                            </tr>
                                            </tbody></table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="border-top:1px solid #f0f0f0;padding-top:17px;padding-bottom:17px">
                                        <table cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;width:100%">
                                            <tbody><tr>
                                                <td style="font-size:15px;vertical-align:top;width:140px">Покупатель</td>
                                                <td style="font-size:15px;vertical-align:top">${customer.name}, ${customer.phone}</td>
                                            </tr>
                                            </tbody></table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="border-top:1px solid #f0f0f0;padding-top:22px;padding-bottom:22px">
                                        <table cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;width:100%">
                                            <tbody><tr>
                                                <td style="font-size:18px;vertical-align:baseline">Всего к оплате</td>
                                                <td style="font-size:26px;text-align:right;vertical-align:baseline">${formatMoney(productsPrice + (delivery.price || 0))}</td>
                                            </tr>
                                            </tbody></table>
                                    </td>
                                </tr>
                                </tbody></table>
                        </td>
                    </tr>

                    </tbody></table>
            </div>
            </div>
            </div>
            <div style="background-color:#414141;">
                <div class="block-grid"
                     style="Margin: 0 auto; min-width: 320px; max-width: 680px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                        <!--[if (mso)|(IE)]>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="background-color:#414141;">
                            <tr>
                                <td align="center">
                                    <table cellpadding="0" cellspacing="0" border="0" style="width:680px">
                                        <tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                        <!--[if (mso)|(IE)]>
                        <td align="center" width="680"
                            style="background-color:transparent;width:680px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;"
                            valign="top">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;">
                        <![endif]-->
                        <div class="col num12"
                             style="min-width: 320px; max-width: 680px; display: table-cell; vertical-align: top; width: 680px;">
                            <div style="width:100% !important;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                    <!--<![endif]-->
                                </div>
                                <table cellpadding="0" cellspacing="0" class="social_icons" role="presentation"
                                       style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                       valign="top" width="100%">
                                    <tbody>
                                    <tr style="vertical-align: top;" valign="top">
                                        <td style="word-break: break-word; vertical-align: top; padding-top: 15px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                            valign="top">
                                            <table align="center" cellpadding="0" cellspacing="0" class="social_table"
                                                   role="presentation"
                                                   style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;"
                                                   valign="top">
                                                <tbody>
                                                <tr align="center"
                                                    style="vertical-align: top; display: inline-block; text-align: center;"
                                                    valign="top">
                                                    <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 4px; padding-left: 4px;"
                                                        valign="top"><a href="http://example.com/" target="_blank"><img
                                                            alt="Facebook" height="32"
                                                            src=${domain + '/client/images/facebook.png'}
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                            title="Facebook" width="32"/></a></td>
                                                    <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 4px; padding-left: 4px;"
                                                        valign="top"><a href="http://example.com/" target="_blank"><img
                                                            alt="YouTube" height="32"
                                                            src=${domain + '/client/images/youtube.png'}
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                            title="YouTube" width="32"/></a></td>
                                                    <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 4px; padding-left: 4px;"
                                                        valign="top"><a href="http://example.com/" target="_blank"><img
                                                            alt="Instagram" height="32"
                                                            src=${domain + '/client/images/instagram.png'}
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                            title="Instagram" width="32"/></a></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <!--[if mso]>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px; font-family: Arial, sans-serif">
                                <![endif]-->
                                <div style="color:#ffffff;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:20px;padding-left:10px;">
                                    <div style="font-size: 14px; line-height: 1.2; color: #ffffff; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                        <p style="font-size: 12px; line-height: 1.6; word-break: break-word; text-align: center; mso-line-height-alt: 13px; margin: 0;">
                                            <span style="font-size: 12px;">Киев, ул. Большая Окружная, 4</span></p>

                                        <p style="font-size: 12px; line-height: 1.6; word-break: break-word; text-align: center; mso-line-height-alt: 13px; margin: 0;">
                                            <span style="font-size: 12px;"><a href="mailto:mebelmarket@gmail.com"
                                                                              style="text-decoration: none; color: #ffffff;"
                                                                              title="mebelmarket@gmail.com">mebelmarket@gmail.com  </a></span>
                                        </p>

                                        <p style="font-size: 12px; line-height: 1.6; word-break: break-word; text-align: center; mso-line-height-alt: 13px; margin: 0;">
                                            <span style="font-size: 12px;"><a href="tel:+380443557720"
                                                                              style="text-decoration: none; color: #ffffff;"
                                                                              title="tel:+380443557720">+38 (044) 355-77-20</a></span>
                                        </p>

                                        <p style="font-size: 12px; line-height: 1.4; word-break: break-word; text-align: center; mso-line-height-alt: 13px; margin: 0;">
                                            <span style="font-size: 12px;"><a href="tel:+380500511000"
                                                                              style="text-decoration: none; color: #ffffff;"
                                                                              title="tel:+380500511000">+38 (050) 051-10-00</a></span>
                                        </p>

                                        <p style="font-size: 12px; line-height: 1.4; word-break: break-word; text-align: center; mso-line-height-alt: 13px; margin: 0;">
                                            <span style="font-size: 12px;"><a href="tel:+380679000522"
                                                                              style="text-decoration: none; color: #ffffff;"
                                                                              title="tel:+380679000522">+38 (067) 900-05-22</a></span>
                                        </p>

                                    </div>
                                </div>
                                <!--[if mso]></td></tr></table><![endif]-->
                                <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation"
                                       style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                       valign="top" width="100%">
                                    <tbody>
                                    <tr style="vertical-align: top;" valign="top">
                                        <td class="divider_inner"
                                            style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 5px; padding-right: 5px; padding-bottom: 5px; padding-left: 5px;"
                                            valign="top">
                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                   class="divider_content" role="presentation"
                                                   style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #919191; width: 40%;"
                                                   valign="top" width="40%">
                                                <tbody>
                                                <tr style="vertical-align: top;" valign="top">
                                                    <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                        valign="top"><span></span></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <!--[if mso]>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 15px; font-family: Arial, sans-serif">
                                <![endif]-->
                                <div style="color:#ffffff;font-family:Poppins, Arial, Helvetica, sans-serif;line-height:1.2;padding-top:15px;padding-right:10px;padding-bottom:15px;padding-left:10px;">
                                    <div style="font-size: 14px; line-height: 1.2; color: #ffffff; font-family: Poppins, Arial, Helvetica, sans-serif; mso-line-height-alt: 17px;">
                                        <p style="font-size: 12px; line-height: 1.6; word-break: break-word; text-align: center; mso-line-height-alt: 13px; margin: 0;">
                                            <span style="font-size: 12px;">2020 © Все права защищены</span></p>
                                    </div>
                                </div>
                                <!--[if mso]></td></tr></table><![endif]-->
                                <!--[if (!mso)&(!IE)]><!-->
                            </div>
                            <!--<![endif]-->
                        </div>
                    </div>
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                </div>
            </div>
            </div>
            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
    </tr>
    </tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>
`;
}
