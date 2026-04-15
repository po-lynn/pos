# -*- coding: utf-8 -*-
{
    'name': "SKB POS Receipt",
    'summary': "Custom POS receipt layout for SKB",
    'description': "Customizes the POS receipt with table-style line items, service charge, discount, and business hours footer.",
    'author': "SKB",
    'category': 'Point of Sale',
    'version': '18.0.1.0.0',
    'depends': ['base', 'point_of_sale'],
    'data': [
        'views/res_config_settings_views.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'skb_pos_receipt/static/src/js/pos_receipt.js',
            'skb_pos_receipt/static/src/xml/receipt_header.xml',
            'skb_pos_receipt/static/src/xml/order_receipt.xml',
            'skb_pos_receipt/static/src/scss/receipt.scss',
        ],
    },
    'installable': True,
    'license': 'LGPL-3',
}
