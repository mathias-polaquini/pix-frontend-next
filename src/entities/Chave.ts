import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity("chaves")
export class Chave {
  @PrimaryColumn({ type: "varchar", length: 200 })
  chave!: string;

  @Column({ type: "char", length: 1 })
  tipo!: string;

  @Column({ name: "usuario_id", type: "int" })
  usuarioId!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.chaves, { onDelete: "CASCADE" })
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;
}
