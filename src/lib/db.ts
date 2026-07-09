import { supabase } from "./supabase";
import { mockProjects, mockProducts, Project, Product, Order, ContactMessage } from "./data";

// Simple in-memory storage for mockup mode additions/updates during development
let localProjects: Project[] = [...mockProjects];
let localProducts: Product[] = [...mockProducts];
let localOrders: Order[] = [];
let localMessages: ContactMessage[] = [];

// Helper to check if database operations should use Supabase
const useSupabase = () => supabase !== null;

export async function getProjects(): Promise<Project[]> {
  if (useSupabase()) {
    const { data, error } = await supabase!
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((d) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        description: d.description,
        coverImageUrl: d.cover_image_url,
        gallery: d.gallery || [],
        tags: d.tags || [],
        liveUrl: d.live_url,
        githubUrl: d.github_url,
        problem: d.problem,
        solution: d.solution,
        tools: d.tools || [],
        createdAt: d.created_at,
      }));
    }
    console.error("Supabase error fetching projects, using mock fallback:", error);
  }
  return localProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (useSupabase()) {
    const { data, error } = await supabase!
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) {
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImageUrl: data.cover_image_url,
        gallery: data.gallery || [],
        tags: data.tags || [],
        liveUrl: data.live_url,
        githubUrl: data.github_url,
        problem: data.problem,
        solution: data.solution,
        tools: data.tools || [],
        createdAt: data.created_at,
      };
    }
    console.error("Supabase error fetching project by slug:", error);
  }
  return localProjects.find((p) => p.slug === slug) || null;
}

export async function getProducts(): Promise<Product[]> {
  if (useSupabase()) {
    const { data, error } = await supabase!
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return data.map((d) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        description: d.description,
        priceCents: d.price_cents,
        previewImages: d.preview_images || [],
        fileUrl: d.file_url,
        tags: d.tags || [],
        features: d.features || [],
        createdAt: d.created_at,
      }));
    }
    console.error("Supabase error fetching products, using mock fallback:", error);
  }
  return localProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (useSupabase()) {
    const { data, error } = await supabase!
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!error && data) {
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        priceCents: data.price_cents,
        previewImages: data.preview_images || [],
        fileUrl: data.file_url,
        tags: data.tags || [],
        features: data.features || [],
        createdAt: data.created_at,
      };
    }
    console.error("Supabase error fetching product by slug:", error);
  }
  return localProducts.find((p) => p.slug === slug) || null;
}

export async function createOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const newOrder: Order = {
    ...order,
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    createdAt: new Date().toISOString(),
  };

  if (useSupabase()) {
    const { data, error } = await supabase!
      .from("orders")
      .insert([
        {
          product_id: order.productId,
          buyer_email: order.buyerEmail,
          stripe_session_id: order.stripeSessionId,
          status: order.status,
          download_url: order.downloadUrl,
        },
      ])
      .select()
      .single();
    
    if (!error && data) {
      return {
        id: data.id,
        productId: data.product_id,
        buyerEmail: data.buyer_email,
        stripeSessionId: data.stripe_session_id,
        status: data.status,
        downloadUrl: data.download_url,
        createdAt: data.created_at,
      };
    }
    console.error("Supabase error creating order:", error);
  }

  localOrders.push(newOrder);
  return newOrder;
}

export async function createMessage(message: Omit<ContactMessage, "id" | "createdAt">): Promise<ContactMessage> {
  const newMessage: ContactMessage = {
    ...message,
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    createdAt: new Date().toISOString(),
  };

  if (useSupabase()) {
    const { data, error } = await supabase!
      .from("messages")
      .insert([
        {
          name: message.name,
          email: message.email,
          phone: message.phone,
          message: message.message,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        createdAt: data.created_at,
      };
    }
    console.error("Supabase error saving message:", error);
  }

  localMessages.push(newMessage);
  return newMessage;
}

// Admin Write Operations (Mock Cache helpers)
export async function adminAddProject(project: Omit<Project, "id" | "createdAt">): Promise<Project> {
  const newProject: Project = {
    ...project,
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    createdAt: new Date().toISOString().split("T")[0],
  };

  if (useSupabase()) {
    const { data, error } = await supabase!
      .from("projects")
      .insert([
        {
          title: project.title,
          slug: project.slug,
          description: project.description,
          cover_image_url: project.coverImageUrl,
          gallery: project.gallery,
          tags: project.tags,
          live_url: project.liveUrl,
          github_url: project.githubUrl,
          problem: project.problem,
          solution: project.solution,
          tools: project.tools,
        },
      ])
      .select()
      .single();
    if (!error && data) {
      return data;
    }
    console.error("Supabase error adding project:", error);
  }

  localProjects = [newProject, ...localProjects];
  return newProject;
}

export async function adminDeleteProject(id: string): Promise<boolean> {
  if (useSupabase()) {
    const { error } = await supabase!.from("projects").delete().eq("id", id);
    if (!error) return true;
    console.error("Supabase error deleting project:", error);
    return false;
  }

  localProjects = localProjects.filter((p) => p.id !== id);
  return true;
}

export async function adminAddProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    createdAt: new Date().toISOString().split("T")[0],
  };

  if (useSupabase()) {
    const { data, error } = await supabase!
      .from("products")
      .insert([
        {
          title: product.title,
          slug: product.slug,
          description: product.description,
          price_cents: product.priceCents,
          preview_images: product.previewImages,
          file_url: product.fileUrl,
          tags: product.tags,
          features: product.features,
        },
      ])
      .select()
      .single();
    if (!error && data) {
      return data;
    }
    console.error("Supabase error adding product:", error);
  }

  localProducts = [newProduct, ...localProducts];
  return newProduct;
}

export async function adminDeleteProduct(id: string): Promise<boolean> {
  if (useSupabase()) {
    const { error } = await supabase!.from("products").delete().eq("id", id);
    if (!error) return true;
    console.error("Supabase error deleting product:", error);
    return false;
  }

  localProducts = localProducts.filter((p) => p.id !== id);
  return true;
}
