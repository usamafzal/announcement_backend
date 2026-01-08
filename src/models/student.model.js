import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

export const studentModel = ConfigDB.define(
  "Student",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    isGraduated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isFeeCleared: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "students",
    timestamps: true,
    hooks: {
      async beforeSave(value) {
        if (value.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(value.password, salt);
          value.password = hashPassword;
        }
      },
    },
  }
);
