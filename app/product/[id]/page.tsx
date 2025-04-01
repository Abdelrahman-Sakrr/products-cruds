import { Product } from "@/app/types/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteProduct from "./DeleteProduct";

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

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl">{product.title}</CardTitle>
            <div className="flex gap-2">
              <Link href={`/product/edit/${product.id}`}>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <DeleteProduct id={product.id!} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative w-full md:w-1/2 h-[400px]">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">
                      {product.rating.rate} ({product.rating.count} reviews)
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Category</h3>
                <p className="text-muted-foreground capitalize">
                  {product.category}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Products
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
