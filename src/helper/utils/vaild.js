function isValidMobileNumber(number) {
  const mobileNumberPattern = /^\d{10}$/;
  return mobileNumberPattern.test(number);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = { isValidMobileNumber, isValidEmail };
