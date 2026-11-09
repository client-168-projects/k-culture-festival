type Props = {
  message: string;
};

export function EmptyState({ message }: Props) {
  return <p className="py-8 text-center text-muted-foreground">{message}</p>;
}
