export const normalizeLegalText = (text: string): string => {
  return (
    text
      // Step 1: Temporarily preserve \n(1), \n(2), etc.
      .replace(/\n(\(\d+\))/g, "___BREAK___$1")

      // Step 2: Remove all other newlines
      .replace(/\n/g, " ")

      // Step 3: Insert newline before bullet-style points (a., b., 1., •, -), but not inside words
      .replace(/(?<!\w)\s?([a-z]\.|[0-9]+\.)\s/g, "\n$1 ")
      .replace(/\s?([•-])\s/g, "\n$1 ")

      // Step 4: Restore preserved newlines
      .replace(/___BREAK___/g, "\n")

      // Step 5: Clean up spacing
      .replace(/[ \t]+/g, " ")
      .trim()
  );
};
