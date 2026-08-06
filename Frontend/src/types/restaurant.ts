export type Restaurant = {
  id: number;
  name: string;
  location: string;
  status: "open" | "closed";
  user_id?: number | null; 
};