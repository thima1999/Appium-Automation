import { describe, it } from 'mocha'
import { expect } from '@wdio/globals'
import SalesOrderPage from '../pageobjects/SalesOrderPage.js'

describe('Sales Order Mobile', () => {
    let salesOrderPage: SalesOrderPage

    before(async () => {
        salesOrderPage = new SalesOrderPage()
    })

    it('validates app connectivity', async () => {
        await browser.getPageSource()
        console.log('✓ App connected - page source retrieved')
    })

    it('navigates to Sales Order Mobile', async () => {
        await salesOrderPage.openSalesOrderMobile()
        console.log('✓ Navigated to Sales Order Mobile')
    })

    it('opens new sales order form', async () => {
        await salesOrderPage.openAddNewSalesOrderForm()
        console.log('✓ Opened new sales order form')
    })

    it('fills sales order header details', async () => {
        // Fill header fields
        await salesOrderPage.fillHeaderField('order date', '2026-04-27')
        await salesOrderPage.fillHeaderField('req date', '2026-05-01')
        await salesOrderPage.fillHeaderField('description', 'Automated test order')

        // Select from searchable combos
        await salesOrderPage.selectFromHeaderDropdown('pmt term', 'Cash', 'Cash')
        await salesOrderPage.selectFromHeaderDropdown('route', 'Main Route', 'Main')

        console.log('✓ Header details filled')
    })

    it('adds items to sales order', async () => {
        // Add multiple items (demonstrating the capability for up to 100)
        const numberOfItems = 3
        for (let i = 1; i <= numberOfItems; i++) {
            const itemCode = `ITEM${i.toString().padStart(3, '0')}`
            const quantity = Math.floor(Math.random() * 10) + 1 // Random qty 1-10
            const unitPrice = Math.round((Math.random() * 100 + 10) * 100) / 100 // Random price 10-110

            await salesOrderPage.addCompleteItem(itemCode, quantity, unitPrice)
            console.log(`✓ Added item ${i}/${numberOfItems}: ${itemCode}`)
        }

        console.log('✓ All items added to sales order')
    })

    it('saves the sales order', async () => {
        await salesOrderPage.saveOrder()

        console.log('✓ Sales order saved successfully')
    })
})