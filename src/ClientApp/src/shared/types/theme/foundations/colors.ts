import colors from "@/shared/styles/theme/foundations/colors";

type TBrandPrimary = {
  50: string;
      100: string;
      150: string;
      800: string;
      900: string;
      950: string;
}

type TBrandSecondary = {
      600: string;
      800: string;
}

type TBrandLinks = {
  50: string;
  800: string;
  900: string;
}

export type TColors = {
  colors: {
    brandPrimary: TBrandPrimary;
    brandSecondary: TBrandSecondary;
    brandLinks: TBrandLinks;
  } 
}

