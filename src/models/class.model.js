import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";

export const classModel = ConfigDB.define(
  "Class",
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
      unique: true,
    },
  },
  {
    tableName: "classes",
    timestamps: true,
  }
);
