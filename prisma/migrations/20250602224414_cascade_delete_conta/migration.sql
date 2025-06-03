-- DropForeignKey
ALTER TABLE "Lancamento" DROP CONSTRAINT "Lancamento_contaId_fkey";

-- AddForeignKey
ALTER TABLE "Lancamento" ADD CONSTRAINT "Lancamento_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "Conta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
