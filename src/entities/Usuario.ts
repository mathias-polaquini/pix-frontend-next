import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Chave } from "./Chave";
import { Transacao } from "./Transacao";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ name: "cpf_cnpj", type: "varchar", length: 14, unique: true })
  cpfCnpj!: string;

  @Column({ type: "varchar", length: 100 })
  nome!: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  telefone!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  rua!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  bairro!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  cidade!: string | null;

  @Column({ name: "numero_conta", type: "int" })
  numeroConta!: number;

  @Column({ name: "email", type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ name: "senha", type: "varchar", length: 255 })
  senha!: string;

  @OneToMany(() => Chave, (chave) => chave.usuario)
  chaves!: Chave[];

  @OneToMany(() => Transacao, (t) => t.usuario)
  transacoes!: Transacao[];
}
