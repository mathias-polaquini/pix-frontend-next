import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Chave } from "./Chave";
import { Usuario } from "./Usuario";

@Entity("transacoes")
export class Transacao {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({
    name: "data_transferencia",
    type: "date",
    default: () => "CURRENT_DATE",
  })
  dataTransferencia!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  valor!: number;

  @Column({ type: "text", nullable: true })
  mensagem!: string | null;

  @Column({ name: "chave_origem", type: "varchar", length: 200 })
  chaveOrigem!: string;

  @Column({ name: "chave_destino", type: "varchar", length: 200 })
  chaveDestino!: string;

  @ManyToOne(() => Chave, { onDelete: "CASCADE" })
  @JoinColumn({ name: "chave_origem", referencedColumnName: "chave" })
  origem!: Chave;

  @ManyToOne(() => Chave, { onDelete: "CASCADE" })
  @JoinColumn({ name: "chave_destino", referencedColumnName: "chave" })
  destino!: Chave;

  @ManyToOne(() => Usuario, (usuario) => usuario.transacoes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;
}
