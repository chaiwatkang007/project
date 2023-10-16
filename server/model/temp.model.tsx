import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Length,
} from "sequelize-typescript";

@Table({ timestamps: false, tableName: "temperature", underscored: true })
class Temp extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;
  @Column({ type: DataType.TEXT })
  day: string;
  @Column({ type: DataType.TEXT })
  time: string;
  @Column(DataType.INTEGER)
  temp: number;
  @Column({ type: DataType.INTEGER })
  humidity: number;
}

export default Temp;
