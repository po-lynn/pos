# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This is a new client project directory (`skb/`) within an Odoo 18.0 multi-client ERP workspace at `/home/po/Documents/erp/18.0/`. The workspace contains:

- `/home/po/Documents/erp/18.0/odoo/` — Core Odoo 18.0 framework and `odoo-bin` executable
- `/home/po/Documents/erp/18.0/enterprise/` — Odoo Enterprise modules
- `/home/po/Documents/erp/18.0/thirdpartry18/` — Third-party modules
- `/home/po/Documents/erp/18.0/<client>/` — Per-client custom module directories (gca18, kwa18, OK-Group, etc.)
- `/home/po/Documents/erp/18.0/*.cfg` — Per-client Odoo server configs

The `skb/` directory will hold all custom Odoo modules for the SKB client.

## Running the Server

```bash
# Start Odoo with a specific client config
/home/po/Documents/erp/18.0/odoo/odoo-bin -c /home/po/Documents/erp/18.0/<config>.cfg

# Install or update a specific module
/home/po/Documents/erp/18.0/odoo/odoo-bin -c <config>.cfg -d <database> -i <module_name> --stop-after-init
/home/po/Documents/erp/18.0/odoo/odoo-bin -c <config>.cfg -d <database> -u <module_name> --stop-after-init
```

Server defaults (from `odoo18.cfg`): HTTP port `8069`, gevent port `8072`, PostgreSQL 16, Python 3.12.8.

## Running Tests

```bash
/home/po/Documents/erp/18.0/odoo/odoo-bin -c <config>.cfg -d <database> \
  --test-tags <module_name> --stop-after-init
```

Test files follow the pattern `tests/test_*.py` inside a module directory.

## Standard Module Structure

Every custom module in `skb/` must follow this layout:

```
skb_module_name/
├── __manifest__.py        # name, version, depends, data file list
├── __init__.py            # imports models (and controllers if present)
├── models/
│   ├── __init__.py        # imports each model file
│   └── model_name.py      # classes using _inherit or _name
├── views/
│   └── model_name_view.xml
├── security/
│   └── ir.model.access.csv
├── controllers/           # only if HTTP routes needed
│   ├── __init__.py
│   └── controllers.py
└── data/                  # or demo/
    └── data.xml
```

**`__manifest__.py` required keys:**
```python
{
    'name': "SKB Module Name",
    'version': '18.0.1.0.0',
    'author': "SKB",
    'depends': ['base', ...],       # list all Odoo module dependencies
    'data': [
        'security/ir.model.access.csv',
        'views/model_name_view.xml',
    ],
    'installable': True,
    'application': False,
}
```

## Key Odoo Development Patterns

**Model inheritance** (extend existing models):
```python
from odoo import models, fields, api

class SaleOrder(models.Model):
    _inherit = 'sale.order'

    custom_field = fields.Char(string='Custom Field')

    @api.onchange('custom_field')
    def _onchange_custom_field(self):
        pass
```

**New model**:
```python
class SkbCustomModel(models.Model):
    _name = 'skb.custom.model'
    _description = 'SKB Custom Model'
```

**XML view inheritance** (modify existing views via XPath):
```xml
<record id="view_sale_order_form_inherit" model="ir.ui.view">
    <field name="model">sale.order</field>
    <field name="inherit_id" ref="sale.view_order_form"/>
    <field name="arch" type="xml">
        <xpath expr="//field[@name='partner_id']" position="after">
            <field name="custom_field"/>
        </xpath>
    </field>
</record>
```

**`ir.model.access.csv` format:**
```
id,name,model_id:id,group_id:id,perm_read,perm_write,perm_create,perm_unlink
access_skb_model,skb.model,model_skb_custom_model,,1,1,1,0
```

## Addons Path Configuration

When creating a new `skb.cfg`, include `skb/` in the `addons_path`. Reference an existing config such as `odoo18.cfg` or `gca18.cfg` for the full path list and server settings to copy.

## Reference Client Projects

For concrete examples of module patterns used in this workspace, see sibling directories:
- `gca18/gca_foc_product/` — sale order and purchase customization example
- `gca18/gca_expense_advance_exchange/` — multi-model module example
- `OK-Group/` — 67 modules covering POS, warehouse, costing
