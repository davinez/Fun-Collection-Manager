type TTitle = {
  fontSize: string;
  fontWeight:  string;
  fontFamily:  string;
}

type TPrimary = {
  fontSize: string;
  fontWeight:  string;
  fontFamily:  string;
}

type TSecondary = {
  fontSize: string;
  fontFamily:  string;
}

type TTertirary= {
  fontSize: string;
  fontFamily:  string;
}

export type TTextStyles = {
  textStyles: {
    title: TTitle;
    primary: TPrimary;
    secondary: TSecondary;
    tertiary: TTertirary;
  } 
}
