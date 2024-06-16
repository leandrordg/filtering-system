import { XCircleIcon } from "lucide-react";

export function EmptyState() {
  return (
    <div className="relative col-span-full h-80 bg-gray-50 w-full p-12 flex flex-col items-center justify-center rounded-md">
      <XCircleIcon className="size-8 text-red-500" />
      <h3 className="font-semibold text-xl">Produtos não encontrados</h3>
      <p className="text-zinc-500 text-sm">
        Não encontramos produtos com os filtros aplicados.
      </p>
    </div>
  );
}
