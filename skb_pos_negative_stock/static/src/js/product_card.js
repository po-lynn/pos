/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { ProductCard } from "@point_of_sale/app/generic_components/product_card/product_card";

patch(ProductCard.prototype, {
    get stockDisplayPrice() {
        const product = this.props.product;
        const pos = this.env.services.pos;

        if (!product || !pos) {
            return "";
        }

        const order = pos.get_order();
        const pricelist = order?.pricelist_id || pos.default_pricelist;

        // Quantity = 1 for single item card
        // const price = product.get_price(pricelist, 1);
        const price = product.get_price_by_uom(
                pricelist,
                1,
                0,
                product.uom_id
            );

        return this.env.utils.formatCurrency(price) ;
    },
    
});

