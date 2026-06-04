


totalPriceOnBokkingcardLocator = '.text-xl.font-bold.text-indigo-700'
totalPriceOnBokkingcardLocator.innerText();
ticketCountOnBookingCardLocator = /🎫\s*\d+\s+tickets?/i
 ticketTextcount=ticketCountOnBookingCardLocator.innerText();


 OnViewDetailBookingPagebookingRef= page.getByText(/[A-Z]{3}-[A-Za-z0-9]+/).nth(1)
  const paymentSummaryDetailsCard = page.locator('.bg-white.rounded-2xl.border.border-gray-100.shadow-sm.p-6')
  .filter({ hasText: 'Payment Summary' })
  const viewDetailsPaymentSummaryTicketCount = await paymentSummaryDetailsCard.filter({ hasText: /ticket/i })
  .locator('span').nth(1)
  .innerText()
  const viewDetailsPaymentSummaryTotalTicketPrice = await paymentSummaryDetailsCard
  .filter({ hasText: /Total Paid/i })
  .locator('span').last()
 .innerText()