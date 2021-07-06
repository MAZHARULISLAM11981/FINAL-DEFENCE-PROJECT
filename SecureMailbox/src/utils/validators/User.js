const userValidator = (body) => {
  const {
    fullName,
    email,
    password,
  } = body;

  if (!fullName) return 'Provide your name.';
  if (!email) return 'Provide your email.';
  if (!password) return 'Provide your password.';
  return 'ok';
};

export default userValidator;
