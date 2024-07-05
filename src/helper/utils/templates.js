const verificationLinkTemplate = (url) => {
  return `<p>Please click the following link to verify your email:</p><p><a href="${url}">Verify Email</a></p>`;
};

module.exports = { verificationLinkTemplate };
