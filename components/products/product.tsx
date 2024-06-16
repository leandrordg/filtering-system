import { type Product } from "@/db";

export function Product({ product }: { product: Product }) {
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-auto group-hover:opacity-75 lg:h-80">
        <img
          src={product.imageId}
          alt="Imagem do Produto"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tamanho: {product.size.toUpperCase()}, {product.color}
          </p>
        </div>

        <p className="text-sm font-medium text-gray-900">{product.price}</p>
      </div>
    </div>
  );
}
