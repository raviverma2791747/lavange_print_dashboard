//@ts-nocheck
import { format } from "date-fns";
import { toast } from "svelte-sonner";

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
};

export const getVariant = (variantConfig, variantID) => {
  return variantConfig.variants.find((variant) => {
    return variant._id === variantID;
  });
};

export const getByValue = (obj, val) => {
  return Object.keys(obj).find((key) => obj[key] === val);
};

export const toastMessage = (msg, type = "success") => {
  switch (type) {
    case "success":
      toast.success(msg)
      break;
    case "error":
      toast.error(msg)
      break;
    case "info":
      toast.info(msg)
      break;
    case "desc":
      toast.message(msg.title, {
        description: msg.description
      })
      break;
    case "warning":
      toast.warning(msg)
      break;
    default:
      toast(msg)
  }
}

