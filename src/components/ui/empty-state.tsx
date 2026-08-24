type Props = {
  message: string;
};

/** 목록/데이터가 비어있을 때 쓰는 공용 빈 상태 문구. */
export function EmptyState({ message }: Props) {
  return <p className="py-8 text-center text-muted-foreground">{message}</p>;
}
