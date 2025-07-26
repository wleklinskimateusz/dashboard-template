import { z } from "zod";
import { ApiService, UnauthorizedError } from "@/server/api-service";
import { tryCatchAsync } from "@/lib/try-catch";
import { redirect } from "next/navigation";
import { AuthService } from "@/auth/auth-service";

export default async function Home() {
  const authService = new AuthService();
  const user = await authService.getUser();

  const { result, error } = await tryCatchAsync(() =>
    new ApiService().get("/products", {
      schema: z.object({
        products: z.array(
          z.object({
            id: z.number(),
            title: z.string(),
            price: z.number(),
          })
        ),
      }),
    })
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      redirect("/login");
    }
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Welcome {user.username}</h1>
      {result.products.map((product) => (
        <div key={product.id}>
          <h1>{product.title}</h1>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}
