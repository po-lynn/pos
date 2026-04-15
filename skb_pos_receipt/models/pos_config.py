# -*- coding: utf-8 -*-
from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    skb_opening_time = fields.Char(
        string='Opening Time',
        help='Business opening time shown in the receipt footer (e.g. "8:00 A.M.").',
    )
    skb_closing_time = fields.Char(
        string='Closing Time',
        help='Business closing time shown in the receipt footer (e.g. "7:30 P.M.").',
    )
