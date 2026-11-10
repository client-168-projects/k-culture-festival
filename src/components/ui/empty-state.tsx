type Props = {
  message: string;
};

/** 빈 목록 안내 문구 */
export function EmptyState({ message }: Props) {
  return <p className="py-8 text-center text-muted-foreground">{message}</p>;
}
