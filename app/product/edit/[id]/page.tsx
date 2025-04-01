import { Product } from "@/app/types/product";
import { ProductForm } from "@/app/components/ProductForm";

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
export async function generateStaticParams() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  return products.map((product: { id: number }) => ({
    id: product.id.toString(),
  }));
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductForm product={product} isEdit />
    </main>
  );
}
