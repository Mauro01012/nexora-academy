import { Icon } from '@/components/ui/Icon';

export function Rating({ value }: { value: number }) {
  return (
    <span className="rating">
      <Icon name="star" size={14} filled strokeWidth={1} />
      <span className="visually-hidden">Avaliação </span>
      {value.toFixed(1).replace('.', ',')}
    </span>
  );
}
