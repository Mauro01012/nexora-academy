import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { TextAreaField } from '@/components/admin/FormFields';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Flash } from '@/components/ui/Flash';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { brand } from '@/config/brand';
import { useBrand } from '@/hooks/useBrand';
import { brandDefaults, getBrandOverrides, isBrandCustomized, paletteFor, resetBrand, saveBrand, validateBrand } from '@/services/brandStore';
import type { BrandOverrides } from '@/services/brandStore';
import { contrast, isHex } from '@/utils/color';

type Errors = Partial<Record<keyof BrandOverrides, string>>;
const order: (keyof BrandOverrides)[] = ['wordmark', 'suffix', 'tagline', 'description', 'email', 'primary', 'accent'];

function ColorField({ id, label, value, error, hint, onChange }: { id: string; label: string; value: string; error?: string; hint: string; onChange: (v: string) => void }) {
  return (
    <div className="color-field">
      <Input id={id} label={label} value={value} error={error} hint={hint} maxLength={7} spellCheck={false} onChange={(e) => onChange(e.target.value)} />
      <input type="color" className="color-field__picker" aria-label={`Selecionar ${label.toLowerCase()}`} value={isHex(value) ? value.toLowerCase() : '#000000'} onChange={(e) => onChange(e.target.value.toUpperCase())} />
    </div>
  );
}

export function AdminBrand() {
  const active = useBrand();
  const [draft, setDraft] = useState<BrandOverrides>(getBrandOverrides);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (key: keyof BrandOverrides, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaved(null);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateBrand(draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = order.find((key) => found[key]);
      if (first) document.getElementById(`marca-${first}`)?.focus();
      return;
    }
    saveBrand(draft);
    setDraft(getBrandOverrides());
    setSaved('Identidade salva. O site público já usa o novo nome, as cores e os textos.');
  };

  const previewVars = paletteFor(isHex(draft.primary) ? draft.primary : brand.colors['primary-600'], isHex(draft.accent) ? draft.accent : brand.colors['accent-500']) as CSSProperties;
  const ratio = (hex: string, on: string) => (isHex(hex) ? contrast(hex, on).toFixed(1).replace('.', ',') : '—');

  return (
    <AdminShell title="Marca">
      <h1 className="display admin__title">Marca</h1>
      <p className="admin__lead">
        Parte dos padrões de <code>src/config/brand.ts</code> e aplica por cima o que for salvo aqui, só neste navegador. A prévia mostra o resultado antes de salvar.
      </p>

      {saved ? <Flash>{saved}</Flash> : null}

      <div className="brand-admin">
        <form className="admin-form" noValidate onSubmit={submit}>
          {Object.values(errors).some(Boolean) ? (
            <p className="form-summary" role="alert">
              Revise os campos destacados.
            </p>
          ) : null}
          <div className="admin-form__row">
            <Input id="marca-wordmark" label="Nome (logotipo)" hint="Salvo em maiúsculas. Até 14 caracteres." value={draft.wordmark} error={errors.wordmark} onChange={(e) => set('wordmark', e.target.value)} />
            <Input id="marca-suffix" label="Complemento do nome" hint="Até 14 caracteres." value={draft.suffix} error={errors.suffix} onChange={(e) => set('suffix', e.target.value)} />
          </div>
          <Input id="marca-tagline" label="Slogan" hint="Aparece no título da aba. De 5 a 80 caracteres." value={draft.tagline} error={errors.tagline} onChange={(e) => set('tagline', e.target.value)} />
          <TextAreaField id="marca-description" label="Descrição" hint="Aparece no rodapé. De 20 a 200 caracteres." value={draft.description} error={errors.description} onChange={(e) => set('description', e.target.value)} />
          <Input id="marca-email" type="email" label="E-mail de contato" value={draft.email} error={errors.email} onChange={(e) => set('email', e.target.value)} />
          <div className="admin-form__row">
            <ColorField id="marca-primary" label="Cor primária" value={draft.primary} error={errors.primary} hint={`Contraste com branco: ${ratio(draft.primary, '#FFFFFF')}:1 (mínimo 4,5)`} onChange={(v) => set('primary', v)} />
            <ColorField id="marca-accent" label="Cor de destaque" value={draft.accent} error={errors.accent} hint={`Contraste com o texto escuro: ${ratio(draft.accent, brand.colors['ink-950'])}:1 (mínimo 4,5)`} onChange={(v) => set('accent', v)} />
          </div>
          <div className="admin-form__actions">
            <Button type="submit" variant="primary">
              Salvar identidade
            </Button>
            <Button variant="secondary" onClick={() => setConfirmReset(true)} disabled={!isBrandCustomized()}>
              Restaurar identidade original
            </Button>
          </div>
        </form>

        <section className="brand-preview-wrap" aria-labelledby="marca-previa">
          <h2 id="marca-previa" className="display admin-card__title">
            Prévia
          </h2>
          <div className="brand-preview" style={previewVars} aria-hidden="true">
            <div className="brand-preview__bar surface-dark">
              <Logo wordmark={draft.wordmark.trim().toUpperCase() || '…'} suffix={draft.suffix.trim().toUpperCase() || '…'} />
            </div>
            <div className="brand-preview__body surface-light">
              <p className="display brand-preview__tagline">{draft.tagline.trim() || '…'}</p>
              <div className="brand-preview__row">
                <span className="btn btn--primary btn--md">Botão primário</span>
                <span className="btn btn--accent btn--md">Destaque</span>
                <Badge tone="primary">Categoria</Badge>
              </div>
              <div className="brand-preview__cta surface-brand">
                <p>Bloco de chamada na cor primária</p>
              </div>
            </div>
          </div>
          <p className="admin__muted">
            Em uso agora: <strong>{active.name}</strong>. Páginas servidas antes do carregamento do aplicativo (título e descrição no <code>index.html</code>) continuam com o texto original.
          </p>
        </section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Restaurar a identidade original?"
        confirmLabel="Restaurar identidade"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetBrand();
          setDraft(brandDefaults());
          setErrors({});
          setSaved('Identidade original restaurada.');
          setConfirmReset(false);
        }}
      >
        <p>O nome, o slogan, a descrição, o e-mail e as cores voltam aos valores de src/config/brand.ts.</p>
      </ConfirmDialog>
    </AdminShell>
  );
}
