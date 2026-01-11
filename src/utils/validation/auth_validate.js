const AuthValidation = (data) => {
  if (!data || typeof data !== "object") {
    return { valid: false, message: "invalid response" };
  }

  const { name, username, email, password } = data;

  if (!(name || username || email || password)) {
    return { valid: false, message: "all fields required" };
  }

  if (!name) {
    return { valid: false, message: "name required" };
  }

  // username regex
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, message: "invalid username" };
  }

  // email regex
  const emailRegex = /^[a-zA-Z0-9_]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "invalid email" };
  }

  // password
  if (password < 6 || password > 20) {
    return { valid: false, message: "password show be 6 to 20 character long" };
  }

  return { valid: true };
};

const Loginvalidate = (data) => {
  if (!data || typeof data !== "object") {
    return { valid: false, message: "invalid response" };
  }

  const { identifier, password } = data;

  if (!(identifier || password)) {
    return { valid: false, message: "username & password is required" };
  }

  if (!identifier) {
    return { valid: false, message: "username or email is required" };
  }

  if (!password) {
    return { valid: false, message: "password is required" };
  }

  return { valid: true };
};

export { AuthValidation, Loginvalidate };
