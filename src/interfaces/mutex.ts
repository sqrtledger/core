export interface IMutex {
  acquire(key: string): Promise<boolean>;

  release(key: string): Promise<boolean>;
}
