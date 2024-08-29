

/**
  * Indicates whether a specified string is complies as a url with protocol http or https
  *
  */
export const isValidHttpUrl = (string: string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

