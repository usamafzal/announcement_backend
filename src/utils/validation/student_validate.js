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

const updateStudentValidation = (data) => {
  if (!data || typeof data !== "object") {
    return { valid: false, message: "invalid response" };
  }

  const requiredFields = [
    { key: "name", message: "name is required" },
    { key: "userId", message: "userId is required" },
    { key: "password", message: "password is required" },
    { key: "isActive", message: "student status is required" },
    { key: "isFeeCleared", message: "fee status is required" },
    { key: "isGraduated", message: "Graduation status is required" },
  ];

  for (const field of requiredFields) {
    if (!data[field.key]) {
      return { valid: false, message: field.message };
    }
  }

  return { valid: true };
};
export { StudentValidation, studentLoginValidation, updateStudentValidation };
