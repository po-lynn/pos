# -*- coding: utf-8 -*-
from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    skb_opening_time = fields.Char(
        string='Opening Time',
        related='pos_config_id.skb_opening_time',
        readonly=False,
    )
    skb_closing_time = fields.Char(
        string='Closing Time',
        related='pos_config_id.skb_closing_time',
        readonly=False,
    )
