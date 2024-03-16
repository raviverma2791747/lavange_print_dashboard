//@ts-nocheck
import { format } from "date-fns";

export const formatDate = (date, format_string) => {
  return format(date, format_string);
};

export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
}


export const getVariantSchema = (product, variantSchemaID) => {
  
  return product.variantConfigs.find((variantConfig) => {
    return variantConfig._id === variantSchemaID;
  });
}

export const getVariant = (variantConfig, variantID) => {

  return variantConfig.variants.find((variant) => {
    return variant._id === variantID;
  });
}
  
