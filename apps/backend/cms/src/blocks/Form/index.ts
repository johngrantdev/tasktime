import type { Block } from "payload/types";

export const FormBlock: Block = {
  slug: "formBlock",
  interfaceName: "Form Block",
  labels: {
    singular: "Form Block",
    plural: "Form Blocks",
  },
  graphQL: {
    singularName: "FormBlock",
  },
  fields: [
    {
      name: "form",
      type: "relationship",
      relationTo: "forms",
      required: true,
    },
    {
      name: "enableIntro",
      label: "Enable Intro Content",
      type: "checkbox",
    },
    {
      name: "introContent",
      label: "Intro Content",
      type: "richText",
    },
  ],
};
