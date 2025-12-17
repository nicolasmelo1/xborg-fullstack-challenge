export interface Service<TInput, TOutput> {
  execute(input: TInput): TOutput;
}
