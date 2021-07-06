const emailValidator = (body) => {
  const {
    subject,
    filePath,
    message,
    from,
    to,
  } = body;

  if (!subject) return 'Provide email subject.';
  if (!filePath) return 'Provide email filePath.';
  if (!message) return 'Provide email body.';
  if (!from) return 'Provide sender email.';
  if (!to) return 'Provide receiver email.';
  return 'ok';
};

export default emailValidator;
