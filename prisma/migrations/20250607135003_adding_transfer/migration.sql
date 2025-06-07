/*
  Warnings:

  - The values [TRANSFERENCIA] on the enum `TipoLancamento` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoLancamento_new" AS ENUM ('CREDITO', 'DEBITO', 'AJUSTE_LIMITE', 'BONUS', 'TRANSFERENCIA_DEBITO', 'TRANSFERENCIA_CREDITO');
ALTER TABLE "Lancamento" ALTER COLUMN "tipo" TYPE "TipoLancamento_new" USING ("tipo"::text::"TipoLancamento_new");
ALTER TYPE "TipoLancamento" RENAME TO "TipoLancamento_old";
ALTER TYPE "TipoLancamento_new" RENAME TO "TipoLancamento";
DROP TYPE "TipoLancamento_old";
COMMIT;
