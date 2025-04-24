
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RawMaterialFromDB } from "../types/materialTypes";

export const useRawMaterialData = () => {
  return useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      console.log("Fetching materials directly from database");
      const { data, error } = await supabase
        .from("materials")
        .select("*");
      
      if (error) {
        console.error("Error fetching materials:", error);
        throw error;
      }
      
      console.log("Raw materials data from database:", data);
      return data as RawMaterialFromDB[];
    },
  });
};
