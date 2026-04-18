# -*- coding: utf-8 -*-
{
    'name': "SKB POS Negative Stock",

    'summary': "",

    'description': """
        SKB POS Negative Stock
    """,

    'author': "GCA",
    'website': "gca.com.mm",

    # for the full list
    'category': 'Uncategorized',
    'version': '0.2',

    # any module necessary for this one to work correctly
    'depends': [
        'base','point_of_sale',
    ],

    "assets": {
        "point_of_sale._assets_pos": [
            "skb_pos_negative_stock/static/src/**/*",
        ],
    },


    # always loaded
    'data': [
    ],


    'License': 'LGPL-3',
}

