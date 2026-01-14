import ConfigDB from "../db/db.js";
import { DataTypes } from "sequelize";

export const programModel = ConfigDB.define(
  "Programs",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      set(value) {
        this.setDataValue("name", value.toUpperCase());
      },
    },
    durationSemesters: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "programs",
    timestamps: true,
  }
);
