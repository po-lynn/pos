from odoo import _, api, fields, models


class ProductProduct(models.Model):
    _inherit = 'product.product'

    def get_pos_display_stock(self, qty, pick_type):
        self.ensure_one()
        if not self.is_storable:
            return True

        stock_picking_type = self.env['stock.picking.type'].browse(pick_type)
        stock_location = stock_picking_type.warehouse_id.lot_stock_id
        product_with_loc = self.with_context(location=stock_location.id)

        if product_with_loc.free_qty - qty < 0:
            return False
        return True
