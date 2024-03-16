import _ from "lodash";

export const getInfoData = ({
  fields = [],
  object = {},
}: {
  fields: string[];
  object: Record<string, any>;
}) => {
  return _.pick(object, fields);
};
export function extractPublicId(url: string) {
  const parts = url.split("/");
  console.log(parts);
  const versionIndex = parts.findIndex((part) => part === "upload");
  if (versionIndex !== -1 && versionIndex < parts.length - 2) {
    console.log(parts[versionIndex + 2]);
    return parts[versionIndex + 2];
  }
  return null;
}

export const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

export const unGetSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
