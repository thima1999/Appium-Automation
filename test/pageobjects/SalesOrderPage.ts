export default class SalesOrderPage {
    /**
     * Get navigation menu element
     */
    get navigationMenu() {
        return $('//android.widget.ListView[@resource-id="com.bluelotus360.bl360erpgo:id/navigation_layout"]//android.widget.ListView')
    }

    /**
     * Find element by partial text match
     */
    async findElementByText(text: string) {
        return $(`//*[contains(@text, "${text}")]`)
    }

    /**
     * Open navigation menu
     */
    async openNavigationMenu() {
        try {
            const menuBtn = await $('//android.widget.TextView[@text=""]')
            await menuBtn.waitForDisplayed({ timeout: 5000 })
            await menuBtn.click()
            await browser.pause(2000)
        } catch (e) {
            console.log('Could not find navigation menu button')
            throw e
        }
    }

    /**
     * Navigate to Sales Order Mobile
     */
    async openSalesOrderMobile() {
        try {
            // Tap on the Sales Order Mobile panel at coordinates (880, 1833)
            await browser.touchAction([
                { action: 'press', x: 880, y: 1833 },
                { action: 'release' }
            ])
            await browser.pause(2000)
        } catch (e) {
            console.log('Could not tap on Sales Order Mobile')
            throw e
        }
    }

    /**
     * Scroll to element by text
     */
    async scrollToElement(text: string) {
        try {
            const element = await this.findElementByText(text)
            await element.waitForDisplayed({ timeout: 5000 })
            return element
        } catch (e) {
            // Try scrolling
            await browser.execute('mobile: scroll', { direction: 'down' })
            await browser.pause(1000)
            return await this.findElementByText(text)
        }
    }

    /**
     * Click Add New Sales Order button
     */
    async openAddNewSalesOrderForm() {
        try {
            const addBtn = await $('//*[@resource-id="SalesOrder_BtnSec_LeftSec_Addbtn_278969"]')
            await addBtn.waitForDisplayed({ timeout: 10000 })
            await addBtn.click()
            await browser.pause(2000)
        } catch (e) {
            console.log('Could not find Add button')
            throw e
        }
    }

    /**
     * Fill header form field
     */
    async fillHeaderField(label: string, value: string) {
        try {
            let selector = ''
            switch (label.toLowerCase()) {
                case 'order date':
                    selector = '//*[@resource-id="datepicker-76a64dd6-942f-4ddc-98dc-0732c116b8d3"]'
                    break
                case 'req date':
                    selector = '//*[@resource-id="datepicker-22a52ded-eb66-4350-a93a-d7b598d841a8"]'
                    break
                case 'pmt term':
                    selector = '//android.view.View[@text="Pmt Term*"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'route':
                    selector = '//android.view.View[@text="Route*"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'advance analysis':
                    selector = '//android.view.View[@text="Advance Analysis*"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'rep':
                    selector = '//android.view.View[@text="Rep*"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'order mode':
                    selector = '//android.view.View[@text="Order Mode"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'delivery mode':
                    selector = '//android.view.View[@text="Delivery Mode"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'doc number':
                    selector = '//*[@resource-id="HeaderLevel_DocNumber 280125"]'
                    break
                case 'header dis(%)':
                    selector = '//*[@resource-id="HeaderLevel_Discount 280135"]'
                    break
                case 'header dis amount':
                    selector = '//*[@resource-id="HeaderLevel_DiscountAmount 280136"]'
                    break
                case 'description':
                    selector = '//*[@resource-id="HeaderLevel_Description 280137"]'
                    break
                default:
                    throw new Error(`Unknown header field label: ${label}`)
            }
            const input = await $(selector)
            await input.waitForDisplayed({ timeout: 5000 })
            await input.setValue(value)
        } catch (e) {
            console.log(`Could not fill header field: ${label}`)
            throw e
        }
    }

    /**
     * Select from header dropdown
     */
    async selectFromHeaderDropdown(fieldLabel: string, optionText: string, searchText?: string) {
        try {
            let selector = ''
            switch (fieldLabel.toLowerCase()) {
                case 'pmt term':
                    selector = '//android.view.View[@text="Pmt Term*"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'route':
                    selector = '//android.view.View[@text="Route*"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'advance analysis':
                    selector = '//android.view.View[@text="Advance Analysis*"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'rep':
                    selector = '//android.view.View[@text="Rep*"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'order mode':
                    selector = '//android.view.View[@text="Order Mode"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                case 'delivery mode':
                    selector = '//android.view.View[@text="Delivery Mode"]/following-sibling::android.view.View[1]//android.widget.EditText'
                    break
                default:
                    throw new Error(`Unknown dropdown field: ${fieldLabel}`)
            }

            const dropdown = await $(selector)
            await dropdown.waitForDisplayed({ timeout: 5000 })
            await dropdown.click()
            if (searchText) {
                await dropdown.setValue(searchText)
                await browser.pause(1000)
            }
            const option = await $('//*[contains(@text, "' + optionText + '")]')
            await option.waitForDisplayed({ timeout: 5000 })
            await option.click()
        } catch (e) {
            console.log(`Could not select from dropdown: ${fieldLabel}`)
            throw e
        }
    }

    /**
     * Click Add Item button
     */
    async addItem() {
        try {
            const addItemBtn = await $('//*[@content-desc=""]')
            await addItemBtn.waitForDisplayed({ timeout: 10000 })
            await addItemBtn.click()
            await browser.pause(2000)
        } catch (e) {
            console.log('Could not find Add Item button')
            throw e
        }
    }

    /**
     * Fill item details
     */
    async fillItemDetails(itemCode: string, quantity: number, unitPrice: number) {
        try {
            // Assume item form is open after clicking add item
            // Select item from dropdown - assuming it's a searchable combo
            const itemSelector = '//android.view.View[@text="Item*"]/following-sibling::android.view.View[1]//android.widget.EditText'
            const itemInput = await $(itemSelector)
            await itemInput.waitForDisplayed({ timeout: 5000 })
            await itemInput.click()
            await itemInput.setValue(itemCode)
            await browser.pause(1000)
            // Select first option or search result
            const itemOption = await $('//*[contains(@text, "' + itemCode + '")]')
            await itemOption.click()

            // Fill quantity
            const qtySelector = '//android.view.View[@text="Quantity*"]/following-sibling::android.view.View[1]//android.widget.EditText'
            const qtyInput = await $(qtySelector)
            await qtyInput.setValue(quantity.toString())

            // Fill unit price
            const priceSelector = '//android.view.View[@text="Unit Price*"]/following-sibling::android.view.View[1]//android.widget.EditText'
            const priceInput = await $(priceSelector)
            await priceInput.setValue(unitPrice.toString())

            // Save item - assume there's a save button
            const saveItemBtn = await this.findElementByText('Save')
            await saveItemBtn.click()
            await browser.pause(1000)
        } catch (e) {
            console.log(`Could not fill item details: ${itemCode}`)
            throw e
        }
    }

    /**
     * Add complete item (click add + fill details)
     */
    async addCompleteItem(itemCode: string, quantity: number, unitPrice: number) {
        await this.addItem()
        await this.fillItemDetails(itemCode, quantity, unitPrice)
    }

    /**
     * Save the sales order
     */
    async saveOrder() {
        try {
            const saveBtn = await $('//*[@resource-id="SalesOrder_BtnSec_LeftSec_SplitBtnSave_278964"]')
            await saveBtn.waitForDisplayed({ timeout: 10000 })
            await saveBtn.click()
            await browser.pause(2000)
        } catch (e) {
            console.log('Could not find Save Order button')
            throw e
        }
    }
}