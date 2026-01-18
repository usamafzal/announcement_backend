// models/associations.js
export default function applyAssociations(models) {
  /* =========================
     STUDENT
  ========================== */

  models.studentModel.hasMany(models.studentEnrollment, {
    foreignKey: { name: "studentId", allowNull: false },
    onDelete: "RESTRICT", // protect history
    onUpdate: "CASCADE",
  });

  models.studentEnrollment.belongsTo(models.studentModel, {
    foreignKey: { name: "studentId", allowNull: false },
    as: "students",
  });

  models.studentModel.hasMany(models.studentDevice, {
    foreignKey: { name: "studentId", allowNull: false },
    onDelete: "CASCADE", // safe
    onUpdate: "CASCADE",
  });

  models.studentDevice.belongsTo(models.studentModel, {
    foreignKey: { name: "studentId", allowNull: false },
  });

  /* =========================
     PROGRAM
  ========================== */

  models.programModel.hasMany(models.studentEnrollment, {
    foreignKey: { name: "programId", allowNull: false },
    onDelete: "CASCADE", // program removal removes enrollments
    onUpdate: "CASCADE",
  });

  models.studentEnrollment.belongsTo(models.programModel, {
    foreignKey: { name: "programId", allowNull: false },
    as: "programs",
  });

  /* =========================
     SEMESTER
  ========================== */

  models.semesterModel.hasMany(models.studentEnrollment, {
    foreignKey: { name: "semesterId", allowNull: false },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  models.studentEnrollment.belongsTo(models.semesterModel, {
    foreignKey: { name: "semesterId", allowNull: false },
    as: "semesters",
  });
  /* =========================
     ANNOUNCEMENTS
  ========================== */

  models.announcementModel.hasMany(models.announcementTarget, {
    foreignKey: { name: "announcementId", allowNull: false },
    onDelete: "CASCADE", // delete targets if announcement removed
    onUpdate: "CASCADE",
  });

  models.announcementTarget.belongsTo(models.announcementModel, {
    foreignKey: { name: "announcementId", allowNull: false },
  });

  /* =========================
     ANNOUNCEMENT TARGET LINKS
  ========================== */

  models.programModel.hasMany(models.announcementTarget, {
    foreignKey: { name: "programId", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  models.semesterModel.hasMany(models.announcementTarget, {
    foreignKey: { name: "semesterId", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  models.studentModel.hasMany(models.announcementTarget, {
    foreignKey: { name: "studentId", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
}
