import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
} from "sequelize-typescript";

@Table({ timestamps: false, tableName: "log", underscored: true })
class Log extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID})
  id: string;

  @Column({ type: DataType.DATE })
  day: Date;

  @Column({ type: DataType.TIME })
  time: string;

  @Column({ type: DataType.TEXT })
  event_happening: string;
}

export default Log;
