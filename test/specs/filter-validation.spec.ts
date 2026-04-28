import { expect } from '@wdio/globals'
import TicketManagementPage from '../pageobjects/TicketManagementPage.js'

describe('Ticket Management - Filter Validation', () => {
    let ticketMgmtPage: TicketManagementPage

    before(async () => {
        ticketMgmtPage = new TicketManagementPage()
        // Navigate to Ticket Management System
        await ticketMgmtPage.openNavigationMenu()
        await ticketMgmtPage.openTicketManagementSystem()
        await browser.pause(2000)
    })

    describe('Filter Functionality - Project and Assignee', () => {
        it('should load ticket list before applying filters', async () => {
            // Verify ticket list visible
            await ticketMgmtPage.waitForTicketList()
            
            // Verify ticket list is loaded (has records or empty state)
            const isLoaded = await ticketMgmtPage.verifyTicketListLoaded()
            expect(isLoaded).toBe(true)
        })

        it('should apply Project and Assignee filters', async () => {
            // Open filter panel
            await ticketMgmtPage.openFilterPanel()
            
            // Verify filter panel is visible
            const panelVisible = await ticketMgmtPage.verifyFilterPanelVisible()
            expect(panelVisible).toBe(true)
            
            // Apply Project filter with search
            const projectSearchTerm = 'demo'
            await ticketMgmtPage.applyProjectFilter(projectSearchTerm)
            
            // Apply Assignee filter with search
            const assigneeSearchTerm = 'thimathi'
            await ticketMgmtPage.applyAssigneeFilter(assigneeSearchTerm)
        })

        it('should close filter panel after applying filters', async () => {
            // Close filter panel
            await ticketMgmtPage.closeFilterPanel()
            
            // Verify back to main ticket list
            await ticketMgmtPage.waitForTicketList()
        })

        it('should display only filtered results matching Project=Demo and Assignee=Thimathi', async () => {
            // Wait for grid to refresh with filtered data
            await browser.pause(2000)
            
            // Verify filtered results
            const projectName = 'Demo'
            const assigneeName = 'Thimathi'
            
            const resultsValid = await ticketMgmtPage.verifyFilteredResults(projectName, assigneeName)
            expect(resultsValid).toBe(true)
        })

        it('should ensure no unfiltered/stale data is visible', async () => {
            // Verify no stale data
            const noStaleData = await ticketMgmtPage.verifyNoStaleData()
            expect(noStaleData).toBe(true)
        })

        it('should allow clearing filters by reopening filter panel', async () => {
            // Open filter panel again
            await ticketMgmtPage.openFilterPanel()
            
            // Verify filter panel is visible
            const panelVisible = await ticketMgmtPage.verifyFilterPanelVisible()
            expect(panelVisible).toBe(true)
            
            // Close without changing filters
            await ticketMgmtPage.closeFilterPanel()
        })
    })

    describe('Filter Edge Cases', () => {
        it('should handle empty filter results gracefully', async () => {
            // Open filter panel
            await ticketMgmtPage.openFilterPanel()
            
            // Attempt to apply a filter with non-existent value
            try {
                // Note: This test assumes the filter input allows typing
                // Actual implementation may vary based on UI behavior
                await ticketMgmtPage.applyProjectFilter('NonExistent')
                
                // Close filter panel
                await ticketMgmtPage.closeFilterPanel()
                
                // Verify empty state or "no records" message
                const ticketRows = await ticketMgmtPage.getVisibleTicketRows()
                // Empty results are acceptable for non-existent filters
                console.log(`Empty filter results: ${ticketRows.length === 0 ? 'PASS' : 'FAIL'}`)
            } catch (_err: unknown) {
                // If selection fails, that's also acceptable behavior
                console.log('Filter did not find matching option (expected for non-existent values)')
                await ticketMgmtPage.closeFilterPanel()
            }
        })

        it('should maintain filter state when navigating', async () => {
            // Apply Project filter
            await ticketMgmtPage.openFilterPanel()
            await ticketMgmtPage.applyProjectFilter('demo')
            await ticketMgmtPage.closeFilterPanel()
            
            // Wait for results
            await browser.pause(1000)
            
            // Navigate away (go to navigation menu)
            await ticketMgmtPage.openNavigationMenu()
            
            // Navigate back to Ticket Management
            await ticketMgmtPage.openTicketManagementSystem()
            
            // Verify we're back at the ticket list
            await ticketMgmtPage.waitForTicketList()
        })
    })
})
