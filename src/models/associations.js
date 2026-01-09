// models/associations.js
export default function applyAssociations(models) {
  /* =========================
     STUDENT
  ========================== */

  models.Student.hasMany(models.StudentEnrollment, {
    foreignKey: { name: "studentId", allowNull: false },
    onDelete: "RESTRICT", // protect history
    onUpdate: "CASCADE",
  });

  models.StudentEnrollment.belongsTo(models.Student, {
    foreignKey: { name: "studentId", allowNull: false },
  });

  models.Student.hasMany(models.StudentDevice, {
    foreignKey: { name: "studentId", allowNull: false },
    onDelete: "CASCADE", // safe
    onUpdate: "CASCADE",
  });

  models.StudentDevice.belongsTo(models.Student, {
    foreignKey: { name: "studentId", allowNull: false },
  });

  /* =========================
     PROGRAM
  ========================== */

  models.programs.hasMany(models.StudentEnrollment, {
    foreignKey: { name: "programId", allowNull: false },
    onDelete: "CASCADE", // program removal removes enrollments
    onUpdate: "CASCADE",
  });

  models.StudentEnrollment.belongsTo(models.programs, {
    foreignKey: { name: "programId", allowNull: false },
  });

  models.Programs.hasMany(models.Class, {
    foreignKey: { name: "programId", allowNull: false },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  models.Class.belongsTo(models.Programs, {
    foreignKey: { name: "programId", allowNull: false },
  });

  /* =========================
     SEMESTER
  ========================== */

  models.Semester.hasMany(models.StudentEnrollment, {
    foreignKey: { name: "semesterId", allowNull: false },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  models.StudentEnrollment.belongsTo(models.Semester, {
    foreignKey: { name: "semesterId", allowNull: false },
  });

  /* =========================
     CLASS
  ========================== */

  models.Class.hasMany(models.StudentEnrollment, {
    foreignKey: { name: "classId", allowNull: true },
    onDelete: "SET NULL", // preserve enrollment
    onUpdate: "CASCADE",
  });

  models.StudentEnrollment.belongsTo(models.Class, {
    foreignKey: { name: "classId", allowNull: true },
  });

  /* =========================
     ANNOUNCEMENTS
  ========================== */

  models.Announcement.hasMany(models.AnnouncementTarget, {
    foreignKey: { name: "announcementId", allowNull: false },
    onDelete: "CASCADE", // delete targets if announcement removed
    onUpdate: "CASCADE",
  });

  models.AnnouncementTarget.belongsTo(models.Announcement, {
    foreignKey: { name: "announcementId", allowNull: false },
  });

  /* =========================
     ANNOUNCEMENT TARGET LINKS
  ========================== */

  models.Programs.hasMany(models.AnnouncementTarget, {
    foreignKey: { name: "programId", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  models.Semester.hasMany(models.AnnouncementTarget, {
    foreignKey: { name: "semesterId", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  models.Class.hasMany(models.AnnouncementTarget, {
    foreignKey: { name: "classId", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  models.Student.hasMany(models.AnnouncementTarget, {
    foreignKey: { name: "studentId", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
}
