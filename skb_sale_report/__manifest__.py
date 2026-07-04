{
    'name': "SKB Sale Order Report",
    'version': '18.0.1.0.0',
    'author': "SKB",
    'summary': "Sale order PDF: A5 format, bigger font, No. column, split Qty and UoM columns",
    'license': 'LGPL-3',
    'depends': ['sale', 'skb_account_report'],
    'data': [
        'data/report_paperformat.xml',
        'views/report_saleorder.xml',
    ],
    'installable': True,
    'application': False,
}
