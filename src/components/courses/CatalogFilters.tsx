import { useId } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { categories } from '@/data/categories';
import { facetCounts, hasActiveFilters, levels, sortOptions } from '@/utils/catalog';
import type { CatalogFilters as Filters, SortKey } from '@/utils/catalog';
import { courses } from '@/data/courses';

interface Props {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
}

interface ChipGroupProps {
  label: string;
  options: { value: string; label: string; count: number }[];
  value: string;
  allLabel: string;
  total: number;
  onSelect: (value: string) => void;
}

function ChipGroup({ label, options, value, allLabel, total, onSelect }: ChipGroupProps) {
  const id = useId();
  return (
    <div className="filter-group" role="group" aria-labelledby={id}>
      <p id={id} className="filter-group__label">
        {label}
      </p>
      <div className="filter-group__chips">
        <button type="button" className="filter-chip" aria-pressed={value === ''} onClick={() => onSelect('')}>
          {allLabel} <span className="filter-chip__count">{total}</span>
        </button>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="filter-chip"
            aria-pressed={value === option.value}
            // Opção sem resultados fica desativada, a menos que seja a escolhida (para poder desmarcar).
            disabled={option.count === 0 && value !== option.value}
            onClick={() => onSelect(value === option.value ? '' : option.value)}
          >
            {option.label} <span className="filter-chip__count">{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Busca, filtros por categoria e nível e ordenação. Os números de cada opção respeitam a busca e o outro filtro. */
export function CatalogFilters({ filters, onChange, onClear }: Props) {
  const sortId = useId();
  const counts = facetCounts(courses, filters);
  const sum = (record: Record<string, number>) => Object.values(record).reduce((a, b) => a + b, 0);

  return (
    <form className="catalog-filters" role="search" aria-label="Buscar e filtrar cursos" onSubmit={(e) => e.preventDefault()}>
      <div className="catalog-filters__top">
        <Input
          className="catalog-filters__search"
          type="search"
          label="Buscar cursos"
          placeholder="Nome, tema, tecnologia ou instrutor"
          autoComplete="off"
          enterKeyHint="search"
          maxLength={80}
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
        />
        <div className="field catalog-filters__sort">
          <label className="field__label" htmlFor={sortId}>
            Ordenar por
          </label>
          <select id={sortId} className="input" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as SortKey })}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ChipGroup
        label="Categoria"
        allLabel="Todas"
        total={sum(counts.category)}
        value={filters.category}
        options={categories.map((c) => ({ value: c.id, label: c.name, count: counts.category[c.id] ?? 0 }))}
        onSelect={(value) => onChange({ category: value as Filters['category'] })}
      />
      <ChipGroup
        label="Nível"
        allLabel="Todos"
        total={sum(counts.level)}
        value={filters.level}
        options={levels.map((l) => ({ value: l, label: l, count: counts.level[l] ?? 0 }))}
        onSelect={(value) => onChange({ level: value as Filters['level'] })}
      />

      {hasActiveFilters(filters) ? (
        <div className="catalog-filters__clear">
          <Button variant="ghost" onClick={onClear}>
            Limpar busca e filtros
          </Button>
        </div>
      ) : null}
    </form>
  );
}
