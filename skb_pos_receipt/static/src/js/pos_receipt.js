import { patch } from "@web/core/utils/patch";
import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { ReceiptHeader } from "@point_of_sale/app/screens/receipt_screen/receipt/receipt_header/receipt_header";
import { Orderline } from "@point_of_sale/app/generic_components/orderline/orderline";

patch(PosOrderline.prototype, {
    getDisplayData() {
        const result = super.getDisplayData(...arguments);
        // Discount lines have negative price with positive qty.
        // Refund lines have negative qty — those must NOT be hidden.
        result.skb_is_discount = this.get_price_with_tax() < 0 && this.qty > 0;
        // Remove unnecessary decimal places from qty (e.g. "1.00" → "1", "1.50" → "1.5")
        result.skb_qty = String(parseFloat(result.qty));
        return result;
    },
});

Orderline.props = {
    ...Orderline.props,
    line: {
        ...Orderline.props.line,
        shape: {
            ...Orderline.props.line.shape,
            skb_is_discount: { type: Boolean, optional: true },
            skb_qty: { type: String, optional: true },
        },
    },
};

patch(PosOrder.prototype, {
    export_for_printing(_baseUrl, _headerData) {
        const result = super.export_for_printing(...arguments);

        // Discount lines: negative price, positive qty. Refund lines: negative qty.
        let skb_net_total = 0;
        let skb_discount_amount = 0;
        for (const line of this.get_orderlines()) {
            const lineTotal = line.get_price_with_tax();
            if (lineTotal < 0 && line.qty > 0) {
                skb_discount_amount += Math.abs(lineTotal);
            } else {
                skb_net_total += lineTotal;
            }
        }

        result.skb_net_total = skb_net_total;
        result.skb_discount_amount = skb_discount_amount;
        result.skb_total = skb_net_total - skb_discount_amount;
        result.skb_opening_time = this.config.skb_opening_time || '';
        result.skb_closing_time = this.config.skb_closing_time || '';
        result.skb_customer = this.get_partner_name() || '';

        return result;
    },
});

// Pass raw cashier name (without "Served by" prefix) into header data
patch(PosStore.prototype, {
    getReceiptHeaderData(order) {
        const result = super.getReceiptHeaderData(...arguments);
        result.skb_cashier_name = order?.getCashierName() || this.get_cashier()?.name || '';
        return result;
    },
});

// Extend ReceiptHeader props to accept the extra fields passed from the receipt template
ReceiptHeader.props = {
    ...ReceiptHeader.props,
    data: {
        ...ReceiptHeader.props.data,
        shape: {
            ...ReceiptHeader.props.data.shape,
            slip_no: { type: String, optional: true },
            skb_date: { type: String, optional: true },
            skb_customer: { type: String, optional: true },
            skb_cashier_name: { type: String, optional: true },
        },
    },
};
