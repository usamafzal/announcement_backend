import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";

export const semesterModel = ConfigDB.define(
  "Semester",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    isFinal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "semesters",
    timestamps: true,
  }
);
