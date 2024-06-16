"use client";

import axios from "axios";
import { useCallback, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { Product } from "@/components/products/product";
import { ProductSkeleton } from "@/components/products/product-skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { type Product as TProduct } from "@/db";
import { cn } from "@/lib/utils";
import { type ProductState } from "@/lib/validators/product-validator";
import { useQuery } from "@tanstack/react-query";
import { QueryResult } from "@upstash/vector";
import debounce from "lodash.debounce";
import { ChevronDownIcon, FilterIcon } from "lucide-react";

const SORT_OPTIONS = [
  { name: "Nenhum", value: "none" },
  {
    name: "Preço: baixo para alto",
    value: "price-asc",
  },
  {
    name: "Preço: alto para baixo",
    value: "price-desc",
  },
] as const;

const COLOR_FILTERS = {
  id: "color",
  name: "Cor",
  options: [
    {
      value: "white",
      label: "Branco",
    },
    {
      value: "beige",
      label: "Bege",
    },
    {
      value: "blue",
      label: "Azul",
    },
    {
      value: "green",
      label: "Verde",
    },
    {
      value: "purple",
      label: "Roxo",
    },
  ] as const,
};

const SIZE_FILTERS = {
  id: "size",
  name: "Tamanho",
  options: [
    {
      value: "S",
      label: "P",
    },
    {
      value: "M",
      label: "M",
    },
    {
      value: "L",
      label: "G",
    },
  ],
} as const;

const PRICE_FILTERS = {
  id: "price",
  name: "Preço",
  options: [
    {
      value: [0, 1000],
      label: "Qualquer preço",
    },
    {
      value: [0, 50],
      label: "Até R$ 50",
    },
    {
      value: [0, 100],
      label: "Até R$ 100",
    },
  ],
} as const;

const SUB_CATEGORIES = [
  {
    name: "Camisetas",
    selected: true,
    href: "#",
  },
  {
    name: "Moletons",
    selected: false,
    href: "#",
  },
  {
    name: "Moletons com capuz",
    selected: false,
    href: "#",
  },
  {
    name: "Acessórios",
    selected: false,
    href: "#",
  },
];

const DEFAULT_CUSTOM_PRICE = [0, 1000] as [number, number];

export default function Page() {
  const [filter, setfilter] = useState<ProductState>({
    color: ["white", "beige", "blue", "green", "purple"],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ["S", "M", "L"],
    sort: "none",
  });

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<TProduct>[]>(
        "http://localhost:3000/api/products",
        {
          filter: {
            sort: filter.sort,
            color: filter.color,
            price: filter.price.range,
            size: filter.size,
          },
        }
      );

      return data;
    },
  });

  const onSubmit = () => refetch();

  const debouncedSubmit = debounce(onSubmit, 500);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    const isFilterApplied = filter[category].includes(value as never);

    if (isFilterApplied) {
      setfilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    } else {
      setfilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }

    _debouncedSubmit();
  };

  const minPrice = Math.min(filter.price.range[0], filter.price.range[1]);
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-baseline lg:justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Camisetas algodão de alta qualidade
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Filtrar
              <ChevronDownIcon className="-mr-1 ml-1 size-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={15} align="start">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.name}
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-gray-900 bg-gray-100": option.value === filter.sort,
                    "text-gray-500": option.value !== filter.sort,
                  })}
                  onClick={() => {
                    setfilter((prev) => ({
                      ...prev,
                      sort: option.value,
                    }));

                    _debouncedSubmit();
                  }}
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="p-2 text-gray-400 hover:text-gray-500 -mr-2 ml-4 sm:ml-6 lg:hidden">
            <FilterIcon className="size-5" />
          </button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUB_CATEGORIES.map((category) => (
                <li key={category.name}>
                  <button
                    disabled={!category.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <Accordion type="multiple" className="animate-none">
              {/* Color Filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Cor</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    {COLOR_FILTERS.options.map((option, index) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`color-${index}`}
                          onChange={() => {
                            applyArrayFilter({
                              category: "color",
                              value: option.value,
                            });
                          }}
                          checked={filter.color.includes(option.value)}
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`color-${index}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Size Filter */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Tamanho</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    {SIZE_FILTERS.options.map((option, index) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`size-${index}`}
                          onChange={() => {
                            applyArrayFilter({
                              category: "size",
                              value: option.value,
                            });
                          }}
                          checked={filter.size.includes(option.value)}
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`size-${index}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Price Filter */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Preço</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4">
                    {PRICE_FILTERS.options.map((option, index) => (
                      <li key={option.label} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${index}`}
                          onChange={() => {
                            setfilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }));

                            _debouncedSubmit();
                          }}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${index}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                    <li className="flex justify-center flex-col gap-2">
                      <div>
                        <input
                          type="radio"
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            setfilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 1000],
                              },
                            }));

                            _debouncedSubmit();
                          }}
                          checked={filter.price.isCustom}
                          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          Personalizado
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <p className="font-medium">Preço</p>
                        <div>
                          R${" "}
                          {filter.price.isCustom
                            ? minPrice.toFixed(0)
                            : filter.price.range[0].toFixed(0)}{" "}
                          - R${" "}
                          {filter.price.isCustom
                            ? maxPrice.toFixed(0)
                            : filter.price.range[1].toFixed(0)}
                        </div>
                      </div>
                      <Slider
                        className={cn({
                          "opacity-50": !filter.price.isCustom,
                        })}
                        disabled={!filter.price.isCustom}
                        onValueChange={(range) => {
                          const [newMin, newMax] = range;

                          setfilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [newMin, newMax],
                            },
                          }));

                          _debouncedSubmit();
                        }}
                        value={
                          filter.price.isCustom
                            ? filter.price.range
                            : DEFAULT_CUSTOM_PRICE
                        }
                        min={DEFAULT_CUSTOM_PRICE[0]}
                        max={DEFAULT_CUSTOM_PRICE[1]}
                        defaultValue={DEFAULT_CUSTOM_PRICE}
                        step={5}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Products */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products && products.length === 0 ? (
              <EmptyState />
            ) : products ? (
              products.map((product) => (
                <Product key={product.id} product={product.metadata!} />
              ))
            ) : (
              new Array(12)
                .fill(null)
                .map((_, i) => <ProductSkeleton key={i} />)
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
