export interface EventBrigdeRepository {
  putEvent(
    evetBustName: string,
    source: string,
    detailyType: string,
    detail: string
  ): Promise<void>;
}
