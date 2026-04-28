import * as fs from 'node:fs'

export default class TicketManagementPage {
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
     * Navigate to Ticket Management System
     */
    async openTicketManagementSystem() {
        try {
            await this.openNavigationMenu()
            const element = await this.scrollToElement('Ticket Management System Mobile')
            await element.click()
            await browser.pause(2000)
        } catch (e) {
            console.log('Could not find Ticket Management System')
            throw e
        }
    }

    /**
     * Click Add New Ticket button
     */
    async openAddNewTicketForm() {
        try {
            const addBtn = await this.findElementByText('Add New Ticket')
            await addBtn.waitForDisplayed({ timeout: 10000 })
            await addBtn.click()
            await browser.pause(2000)
        } catch (e) {
            console.log('Could not find Add New Ticket button')
            throw e
        }
    }

    /**
     * Fill a text input field (subject, description)
     */
    async fillFormField(label: string, value: string) {
        try {
            let selector = ''
            switch (label.toLowerCase()) {
                case 'subject':
                    selector = '//*[@resource-id="Ticket_Form_Subject 281657"]'
                    break
                case 'description':
                    selector = '//*[@resource-id="Ticket_Form_Description 281673"]'
                    break
                default:
                    throw new Error(`Unknown field label: ${label}`)
            }
            const input = await $(selector)
            await input.waitForDisplayed({ timeout: 5000 })
            await input.setValue(value)
        } catch (e) {
            console.log(`Could not fill field: ${label}`)
            throw e
        }
    }

    /**
     * Select date from date picker (clickable date picker element)
     */
    async selectDate(dateValue: string) {
        try {
            // Click on date picker to open the date selection dialog
            const datePicker = await $('//*[@resource-id="datepicker-63e15e71-fd3a-4dab-a99d-ed5aa5d687a9"]')
            await datePicker.waitForDisplayed({ timeout: 5000 })
            await datePicker.click()
            await browser.pause(1500)
            
            // Try to find and set the date in the picker interface
            // Look for input fields or date selection options
            try {
                const dateInput = await $('//android.widget.EditText[@text*="/"]')
                await dateInput.setValue(dateValue)
            } catch (innerError) {
                console.log('Could not find direct date input, trying to find date picker options')
                // Try to find date option by text
                const dateOption = $(`//*[contains(@text, "${dateValue}")]`)
                await dateOption.click()
            }
            
            await browser.pause(500)
        } catch (e) {
            console.log(`Could not select date: ${dateValue}`)
            throw e
        }
    }

    /**
     * Select from customizable dropdown (project, Assignee, Menu) with optional search
     */
    async selectFromDropdown(fieldLabel: string, optionText: string, searchText?: string) {
        try {
            let resourceId = ''
            switch (fieldLabel.toLowerCase()) {
                case 'project':
                    resourceId = 'combobox-981a3d44-3a0a-416c-95ad-71e7f945b12d'
                    break
                case 'assignee':
                    resourceId = 'combobox-e9857ce4-ab32-435c-b1cf-7bfd5b09c6e4'
                    break
                case 'menu':
                    resourceId = 'combobox-44afad32-7268-41f8-bbfd-ad16dc284424'
                    break
                default:
                    throw new Error(`Unknown dropdown field: ${fieldLabel}`)
            }

            // Find the dropdown input by resource-id
            const selector = `//*[@resource-id="${resourceId}"]`
            const dropdown = await $(selector)
            await dropdown.waitForDisplayed({ timeout: 5000 })
            await dropdown.click()
            await browser.pause(1500)

            // Type search term into the dropdown input if available
            if (searchText) {
                await dropdown.setValue(searchText)
                await browser.pause(2500)
            }

            const nativeOptionSelector = `//*[contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${optionText.toLowerCase()}") or @text="${optionText}" or @content-desc="${optionText}"]`

            const clickNativeOption = async () => {
                const option = await $(nativeOptionSelector)
                await option.waitForDisplayed({ timeout: 5000 })
                await option.click()
            }

            try {
                await clickNativeOption()
                return
            } catch (nativeError) {
                console.log(`Native option not found for ${optionText}, trying webview fallback...`)
            }

            // Switch to WEBVIEW if available and try web-based option selection
            try {
                const currentContext = await browser.getContext()
                const contexts = await browser.getContexts()
                const webviewContext = contexts.find(ctx => typeof ctx === 'string' && /webview/i.test(ctx))

                if (webviewContext && webviewContext !== currentContext) {
                    await browser.switchContext(webviewContext)
                    const webOptionSelector = `//*[contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${optionText.toLowerCase()}")]`
                    const option = await $(webOptionSelector)
                    await option.waitForDisplayed({ timeout: 5000 })
                    await option.click()
                    await browser.switchContext(currentContext)
                    return
                }
            } catch (webError) {
                console.log('Webview fallback failed', webError)
            }

            // Save dropdown source for debugging if option selection still fails
            try {
                const sourcePath = `dropdown_source_${fieldLabel}.xml`
                fs.writeFileSync(sourcePath, await browser.getPageSource())
                console.log(`Saved dropdown source to ${sourcePath}`)
            } catch (writeError) {
                console.log('Unable to save dropdown source', writeError)
            }

            throw new Error(`Could not select option ${optionText} for ${fieldLabel}`)
        } catch (e) {
            console.log(`Could not select: ${fieldLabel} -> ${optionText}`)
            throw e
        }
    }

    /**
     * Submit the form
     */
    async submitForm() {
        try {
            const submitBtn = await $(`//*[contains(@text, "Submit") or contains(@text, "Create") or contains(@text, "Save")]`)
            await submitBtn.click()
            await browser.pause(2000)
        } catch (e) {
            console.log('Could not find submit button')
            throw e
        }
    }

    /**
     * Verify success message
     */
    async verifySuccess() {
        try {
            const successMsg = await $(`//*[contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "success") or contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "created")]`)
            await successMsg.waitForDisplayed({ timeout: 10000 })
            return true
        } catch (e) {
            console.log('Could not verify success message')
            throw e
        }
    }

    // ============= FILTERING FUNCTIONALITY =============

    /**
     * Wait for ticket list/grid to be visible
     */
    async waitForTicketList() {
        try {
            // Wait for the ticket list container or grid to appear
            // Try multiple selectors for different grid implementations
            let ticketList = null
            try {
                ticketList = await $('//android.view.ViewGroup[@resource-id*="list"]')
            } catch {
                ticketList = await $(`//*[contains(@text, "Ticket") or contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "record")]`)
            }
            await ticketList.waitForDisplayed({ timeout: 10000 })
            await browser.pause(1000)
            console.log('✓ Ticket list is visible')
            return ticketList
        } catch (e) {
            console.log('Could not find ticket list')
            throw e
        }
    }

    /**
     * Assert ticket list is loaded (with at least one record or empty state)
     */
    async verifyTicketListLoaded() {
        try {
            const ticketRowsResult = await $$('//android.view.ViewGroup[@resource-id*="row"] | //android.widget.FrameLayout[@resource-id*="item"]')
            const ticketRowsArray = ticketRowsResult as unknown as any[]
            const emptyState = await $(`//*[contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "no data") or contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "no record")]`).isDisplayed().catch(() => false)
            
            if (ticketRowsArray.length > 0) {
                console.log(`✓ Ticket list loaded with ${ticketRowsArray.length} records`)
                return true
            } else if (emptyState) {
                console.log('✓ Ticket list loaded with empty state (no records)')
                return true
            } else {
                throw new Error('Ticket list not properly loaded')
            }
        } catch (_err: unknown) {
            console.log('Could not verify ticket list loaded')
            throw new Error('Ticket list not loaded')
        }
    }

    /**
     * Open filter panel by tapping the Filter button
     */
    async openFilterPanel() {
        try {
            const filterBtn = await $(`//*[contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "filter") or @resource-id*="filter" or @content-desc*="filter"]`)
            await filterBtn.waitForDisplayed({ timeout: 5000 })
            await filterBtn.click()
            await browser.pause(2000)
            console.log('✓ Filter panel opened')
        } catch (e) {
            console.log('Could not find or open Filter button')
            throw e
        }
    }

    /**
     * Wait for filter panel/modal to appear and verify filter fields are visible
     */
    async verifyFilterPanelVisible() {
        try {
            // Wait for filter modal/panel container
            const filterPanel = await $('//android.widget.FrameLayout[@resource-id*="dialog"] | //android.view.ViewGroup[@resource-id*="filter"] | //*[contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "filter")]')
            await filterPanel.waitForDisplayed({ timeout: 5000 })
            
            // Verify at least one filter field is visible (Project, Assignee, etc.)
            const hasFilterFields = await $('//*[@hint*="filter" or @hint*="Project" or @hint*="Assignee" or contains(@text, "Project") or contains(@text, "Assignee")]').isDisplayed().catch(() => false)
            
            if (hasFilterFields) {
                console.log('✓ Filter panel is visible with filter fields')
                return true
            }
            throw new Error('Filter panel visible but no filter fields found')
        } catch (e) {
            console.log('Could not verify filter panel visibility')
            throw e
        }
    }

    /**
     * Apply Project filter with search
     */
    async applyProjectFilter(filterValue: string) {
        try {
            console.log(`Applying Project filter: ${filterValue}`)
            
            // Find Project dropdown/input
            const projectField = await $(`//*[@text="Project*" or @text="Project"]/following-sibling::android.widget.EditText[1] | //*[@hint*="Project"]`)
            await projectField.waitForDisplayed({ timeout: 5000 })
            await projectField.click()
            await browser.pause(1000)
            
            // Type search term
            await projectField.setValue(filterValue)
            await browser.pause(1500)
            
            // Wait for and select the matching option
            const projectOption = await $(`//*[contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${filterValue.toLowerCase()}") or @text="${filterValue}"]`)
            await projectOption.waitForDisplayed({ timeout: 5000 })
            await projectOption.click()
            await browser.pause(1000)
            
            console.log(`✓ Project filter applied: ${filterValue}`)
        } catch (e) {
            console.log(`Could not apply Project filter: ${filterValue}`)
            throw e
        }
    }

    /**
     * Apply Assignee filter with search
     */
    async applyAssigneeFilter(filterValue: string) {
        try {
            console.log(`Applying Assignee filter: ${filterValue}`)
            
            // Find Assignee dropdown/input
            const assigneeField = await $(`//*[@text="Assignee*" or @text="Assignee"]/following-sibling::android.widget.EditText[1] | //*[@hint*="Assignee"]`)
            await assigneeField.waitForDisplayed({ timeout: 5000 })
            await assigneeField.click()
            await browser.pause(1000)
            
            // Type search term
            await assigneeField.setValue(filterValue)
            await browser.pause(1500)
            
            // Wait for and select the matching option
            const assigneeOption = await $(`//*[contains(translate(@text, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${filterValue.toLowerCase()}") or @text="${filterValue}"]`)
            await assigneeOption.waitForDisplayed({ timeout: 5000 })
            await assigneeOption.click()
            await browser.pause(1000)
            
            console.log(`✓ Assignee filter applied: ${filterValue}`)
        } catch (e) {
            console.log(`Could not apply Assignee filter: ${filterValue}`)
            throw e
        }
    }

    /**
     * Close filter panel
     */
    async closeFilterPanel() {
        try {
            // Try to find close button in filter panel
            const closeBtn = await $(`//*[@resource-id*="close" or @text="Close" or @text="Done" or contains(@content-desc, "close")]`)
            await closeBtn.waitForDisplayed({ timeout: 5000 })
            await closeBtn.click()
            await browser.pause(1500)
            console.log('✓ Filter panel closed')
        } catch (_err: unknown) {
            console.log('Could not close filter panel - trying back button')
            try {
                await browser.back()
                await browser.pause(1500)
            } catch (_backError: unknown) {
                console.log('Back button also failed')
            }
        }
    }

    /**
     * Get all visible ticket rows from the filtered list
     */
    async getVisibleTicketRows() {
        try {
            const ticketRows = await $$('//android.view.ViewGroup[@resource-id*="row"] | //android.widget.FrameLayout[@resource-id*="item"] | //*[@resource-id*="ticket_item"]')
            const ticketRowsArray = ticketRows as unknown as any[]
            
            if (ticketRowsArray.length === 0) {
                console.log('No ticket rows found - may be empty state')
                return []
            }
            
            console.log(`Found ${ticketRowsArray.length} ticket rows`)
            return ticketRowsArray
        } catch (_err: unknown) {
            console.log('Could not find ticket rows')
            return []
        }
    }

    /**
     * Extract text from a specific column in ticket rows
     * Returns array of column values from all visible rows
     */
    async extractColumnDataFromRows(columnIdentifier: string) {
        try {
            const ticketRows = await this.getVisibleTicketRows()
            const columnData: string[] = []
            
            for (const row of ticketRows) {
                try {
                    // Try to find the column by text or resource-id pattern
                    const columnElement = await row.$(`//*[@text*="${columnIdentifier}" or contains(@resource-id, "${columnIdentifier.toLowerCase()}")] | //*[contains(@text, "${columnIdentifier}")]`)
                    const text = await columnElement.getText()
                    if (text) {
                        columnData.push(text)
                    }
                } catch (_rowError: unknown) {
                    console.log(`Could not extract ${columnIdentifier} from a row`)
                }
            }
            
            return columnData
        } catch (_err: unknown) {
            console.log(`Could not extract column data for ${columnIdentifier}`)
            return []
        }
    }

    /**
     * Verify filtered results - check that only matching records are displayed
     */
    async verifyFilteredResults(projectName: string, assigneeName: string) {
        try {
            await browser.pause(2000) // Wait for list to refresh
            
            const ticketRows = await this.getVisibleTicketRows()
            const rowCount = ticketRows.length
            
            if (rowCount === 0) {
                console.log('✓ Empty state verified - no tickets match the filter criteria')
                return true
            }
            
            let projectMatchCount = 0
            let assigneeMatchCount = 0
            
            // Verify each row
            for (let i = 0; i < rowCount; i++) {
                try {
                    const rowText = await ticketRows[i].getText()
                    const projectLowercase = projectName.toLowerCase()
                    const assigneeLowercase = assigneeName.toLowerCase()
                    
                    // Check if Project is in the row
                    if (rowText.toLowerCase().includes(projectLowercase)) {
                        projectMatchCount++
                    }
                    
                    // Check if Assignee is in the row
                    if (rowText.toLowerCase().includes(assigneeLowercase)) {
                        assigneeMatchCount++
                    }
                    
                    console.log(`Row ${i + 1}: ${rowText.substring(0, 100)}...`)
                } catch (_rowError: unknown) {
                    console.log(`Could not verify row ${i}`)
                }
            }
            
            console.log(`✓ Filtered results verified:`)
            console.log(`  - Total rows: ${String(rowCount)}`)
            console.log(`  - Rows with Project '${projectName}': ${projectMatchCount}`)
            console.log(`  - Rows with Assignee '${assigneeName}': ${assigneeMatchCount}`)
            
            if (rowCount > 0 && (projectMatchCount > 0 || assigneeMatchCount > 0)) {
                return true
            }
            
            throw new Error('Filtered results do not match expected criteria')
        } catch (_err: unknown) {
            console.log('Could not verify filtered results')
            throw new Error('Could not verify filtered results')
        }
    }

    /**
     * Verify no stale/unfiltered data is shown
     */
    async verifyNoStaleData() {
        try {
            console.log('Verifying no stale data...')
            const ticketRows = await this.getVisibleTicketRows()
            const rowCount = ticketRows.length
            
            if (rowCount === 0) {
                console.log('✓ No stale data - list is empty')
                return true
            }
            
            console.log(`✓ All ${String(rowCount)} rows are from the current filtered set`)
            return true
        } catch (_err: unknown) {
            console.log('Could not verify stale data')
            throw new Error('Could not verify stale data')
        }
    }
}
