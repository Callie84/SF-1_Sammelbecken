// Stub für SMS-Versand (z.B. Twilio)
async function sendSMS(phoneNumber, message) {
  console.log(`SMS an ${phoneNumber}: ${message}`);
  return { success: true, to: phoneNumber };
}

module.exports = { sendSMS };
