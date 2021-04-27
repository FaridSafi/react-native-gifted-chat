declare module 'read-last-lines' {
  namespace readLastLines {
    function read(
      inputFilePath: string,
      maxLineCount: number,
      encoding?: string
    ): Promise<string[]>;
  }
  export = readLastLines;
}
