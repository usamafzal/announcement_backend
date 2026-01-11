const StudentValidation = (data) => {
  if (!data || typeof data !== "object") {
    return { valid: false, message: "invalid response" };
  }
  //id, name userId password isGraduated isFeeCleared isActive
  const { name, userId, password } = data;

  if (!(name || userId || password)) {
    return { valid: false, message: "name, userid & password is required" };
  }
  return { valid: true };
};

const studentLoginValidation = (data) => {
  if (!data || typeof data !== "object") {
    return { valid: false, message: "invalid response" };
  }

  const { userId, password } = data;

  if (!(userId || password)) {
    return { valid: false, message: "userid & password is required" };
  }

  return { valid: true };
};

export { StudentValidation, studentLoginValidation };
