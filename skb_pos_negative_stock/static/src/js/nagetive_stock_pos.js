/** @odoo-module */
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { _t } from "@web/core/l10n/translation";

patch(PosStore.prototype, {
    async pay() {
        const currentOrder = this.get_order();
        if (!currentOrder || currentOrder.get_orderlines().length === 0) {
            return super.pay(...arguments);
        }
        const isValid = await this.validateStock(currentOrder);
        if (isValid) {
            return await super.pay(...arguments);
        }
    },

    async validateStock(currentOrder) {
        const groupedLines = {};

        for (const line of currentOrder.get_orderlines()) {
            const product = line.get_product();
            if (!product.is_storable) {
                continue;
            }

            const productId = product.id;
            const lineUom = line.uom_id || line.product_uom_id || product.uom_id;
            const productUom = product.uom_id;

            // Convert qty from sale UoM to product's base UoM via category reference
            // Formula: qty_in_base = (qty / lineUom.factor) * productUom.factor
            let qtyInBase;
            if (!lineUom || !productUom || lineUom.id === productUom.id) {
                qtyInBase = line.get_quantity();
            } else {
                const lineFactor = lineUom.factor || 1;
                const productFactor = productUom.factor || 1;
                qtyInBase = (line.get_quantity() / lineFactor) * productFactor;
            }

            if (!groupedLines[productId]) {
                groupedLines[productId] = {
                    id: productId,
                    display_name: product.display_name,
                    qty: 0,
                    picking_type_id: this.config.picking_type_id?.id ?? this.config.picking_type_id,
                };
            }
            groupedLines[productId].qty += qtyInBase;
        }

        for (const productId in groupedLines) {
            const data = groupedLines[productId];
            const isAvailable = await this.env.services.orm.call(
                "product.product",
                "get_pos_display_stock",
                [data.id, data.qty, data.picking_type_id]
            );
            if (!isAvailable) {
                this.dialog.add(AlertDialog, {
                    title: _t('Out of Stock'),
                    body: _t(`${data.display_name} is out of stock.`),
                });
                return false;
            }
        }
        return true;
    }
});
