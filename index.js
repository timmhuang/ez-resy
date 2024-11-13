import {
  checkForExistingBooking,
  getBookingConfig,
  makeBooking,
  fetchDataAndParseSlots,
} from './utils/bookingLogic.js';

import { checkTokenExpiration } from './utils/helpers.js';
import { logMsg } from './utils/logUtil.js';

console.log = logMsg;
let intermission = process.env.POLLING_INTERVAL_MS || 500;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the script
let token = await checkTokenExpiration(process.env.AUTH_TOKEN);
if (token) {
  var existingBooking = await checkForExistingBooking();
  while (!existingBooking) {
    let slots = await fetchDataAndParseSlots();

    if (slots) {
      let bookToken = await getBookingConfig(slots);
      let booking = await makeBooking(bookToken);
      if (booking.resy_token) {
        console.log(`You've got a reservation!`);
        process.exit(0);
      } else {
        console.log(`Something went to 💩`);
      }
    }

    console.log(`Checking again in ${intermission / 1000} seconds...`);
    await sleep(intermission);
    existingBooking = await checkForExistingBooking();
  }
}
