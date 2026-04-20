{
    'name': "SKB Account Invoice Report",
    'version': '18.0.1.0.0',
    'author': "SKB",
    'summary': "Invoice PDF: add No. column, split Qty and UoM into separate columns",
    'depends': ['account'],
    'data': [
        'views/report_invoice.xml',
    ],
    'installable': True,
    'application': False,
}
