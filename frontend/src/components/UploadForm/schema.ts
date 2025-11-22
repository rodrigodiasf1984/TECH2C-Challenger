import z from "zod";

const excelTypes = [
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];
export const schema = z.object({
  file: z
    .custom<FileList>()
    .refine((files) => files.length === 1, "File required")
    .refine((files) => excelTypes.includes(files[0].type), {
      message: "The file must be an Excel file with .xls or .xlsx extension",
    })
    .refine((files) => files[0].size <= 5 * 1024 * 1024, {
      message: "The file should not exceed 5 mb size.",
    }),
});

export type FormData = z.infer<typeof schema>;
