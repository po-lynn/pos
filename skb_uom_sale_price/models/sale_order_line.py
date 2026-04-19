from odoo import models, fields, api


class SaleOrderLine(models.Model):
    _inherit = 'sale.order.line'

    allowed_uom_ids = fields.Many2many('uom.uom', compute='_compute_allowed_uom_ids')

    @api.depends('product_id')
    def _compute_allowed_uom_ids(self):
        for line in self:
            if not line.product_id:
                line.allowed_uom_ids = self.env['uom.uom'].search([])
            else:
                tmpl = line.product_id.product_tmpl_id
                line.allowed_uom_ids = tmpl.uom_id | tmpl.multi_uom_price_id.uom_id

    def _get_display_price(self):
        self.ensure_one()
        if self.product_id and self.product_uom:
            multi_price = self.env['product.multi.uom.price'].search(
                [('variant_id', '=', self.product_id.id),
                 ('uom_id', '=', self.product_uom.id)],
                limit=1,
            )
            if not multi_price:
                multi_price = self.env['product.multi.uom.price'].search(
                    [('product_id', '=', self.product_id.product_tmpl_id.id),
                     ('uom_id', '=', self.product_uom.id)],
                    limit=1,
                )
            if multi_price:
                return multi_price.price
        return super()._get_display_price()
