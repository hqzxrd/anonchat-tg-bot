import { PrimaryGeneratedColumn } from "typeorm";

abstract class Base {
  @PrimaryGeneratedColumn()
  id!: number;
}

export default Base;
