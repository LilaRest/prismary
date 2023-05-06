import { SourceFile } from "ts-morph";

export const formatConfig = {
  // convertTabsToSpaces: true,
  // insertSpaceAfterCommaDelimiter: true,
  // insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
  // newLineCharacter: "\n",
  // tabSize: 2,
};

export function formatFile (file: SourceFile) {
  file.organizeImports();
  file.formatText(formatConfig);
}