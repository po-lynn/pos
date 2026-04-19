{
    'name': "SKB UoM Sale Price",
    'version': '18.0.1.0.0',
    'author': "SKB",
    'summary': "Apply UoM-specific prices in Sales orders (and POS via pos_multi_price_uom_barcode)",
    'depends': ['sale', 'pos_multi_price_uom_barcode'],
    'data': [
        'views/sale_order_views.xml',
    ],
    'installable': True,
    'application': False,
}
