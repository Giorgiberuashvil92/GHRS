'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiCheck, FiClock } from 'react-icons/fi';
import { SimpleLogo } from '../components/Logo';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../config/api';
import { copy, Options, QuestionnaireAnswers, Submission } from './content';
import s from './questionnaire.module.css';
import { CONDITION_GROUPS } from '../../backend/src/questionnaire/conditions';
const emptyAnswers: QuestionnaireAnswers = { locale: 'en', purpose: 'rehabilitation', nickname: '', fullName: '', phone: '', email: '', gender: '', trainingLevel: '', conditionId: '', conditionDetails: '', additionalInfo: '', consent: false };
export default function QuestionnairePage() {
  const { locale, setLocale } = useI18n();
  const language = locale === 'ru' ? 'ru' : 'en';
  const c = copy[language];
  const { user, isLoading: authLoading } = useAuth();
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(emptyAnswers);
  const [options, setOptions] = useState<Options>({ groups: CONDITION_GROUPS, catalog: [] });
  const [loadError, setLoadError] = useState(false), [revision, setRevision] = useState(0);
  const [step, setStep] = useState(0), [previous, setPrevious] = useState(false), [sending, setSending] = useState(false), [error, setError] = useState('');
  const [result, setResult] = useState<Submission | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const edited = useRef(false);
  useEffect(() => {
    const lang = new URLSearchParams(window.location.search).get('lang');
    if (lang === 'ru' || lang === 'en') setLocale(lang);
    try {
      const raw = sessionStorage.getItem('ghrs-questionnaire-draft');
      if (!raw) return;
      const draft = JSON.parse(raw);
      sessionStorage.removeItem('ghrs-questionnaire-draft');
      if (Date.now() - draft.savedAt > 30 * 60 * 1000 || !draft.answers || !['en', 'ru'].includes(draft.answers.locale)) return;
      edited.current = true;
      setAnswers({ ...emptyAnswers, ...draft.answers, consent: false });
      setLocale(draft.answers.locale);
      setStep(2);
    } catch { /* A browser with disabled storage can still use the form. */ }
  }, []);
  const selectLanguage = (value: 'en' | 'ru') => {
    setLocale(value);
    window.history.replaceState(null, '', `/test?lang=${value}`);
  };
  const rememberDraft = () => {
    try { sessionStorage.setItem('ghrs-questionnaire-draft', JSON.stringify({ answers: { ...answers, locale: language, consent: false }, savedAt: Date.now() })); } catch { /* Storage may be unavailable. */ }
  };
  useEffect(() => {
    let active = true;
    setLoadError(false);
    apiRequest<Options>('/api/questionnaires/options').then(data => { if (active) setOptions(data); })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [revision]);
  useEffect(() => {
    if (authLoading || !user || edited.current) return;
    let active = true;
    setAnswers(current => ({ ...current, nickname: user.name || '', fullName: user.name || '', phone: user.phone || '', email: user.email || '' }));
    apiRequest<Submission | null>('/api/questionnaires/me', { cache: 'no-store' }).then(latest => {
      if (!active || !latest || edited.current) return;
      setPrevious(true);
      setAnswers({ ...emptyAnswers, ...latest.answers, consent: false });
    }).catch(() => { /* Loading previous answers never blocks a new questionnaire. */ });
    return () => { active = false; };
  }, [user?.id, authLoading]);
  const change = <K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) => { edited.current = true; setAnswers(current => ({ ...current, [key]: value })); setError(''); };
  const move = (next: number) => { setStep(next); setError(''); requestAnimationFrame(() => heading.current?.focus()); };
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    if (step < 2) { move(step + 1); return; }
    if (!user) { setError('session'); return; }
    setSending(true); setError('');
    const payload = Object.fromEntries(Object.entries({ ...answers, locale: language }).filter(([, value]) => value !== '' && value !== undefined));
    try { const saved = await apiRequest<Submission>('/api/questionnaires/me', { method: 'POST', body: JSON.stringify(payload) }); setResult(saved); requestAnimationFrame(() => heading.current?.focus()); }
    catch (cause) { setError(cause instanceof Error && cause.message.startsWith('HTTP 401:') ? 'session' : 'save'); }
    finally { setSending(false); }
  };
  const conditionLabel = options?.groups.flatMap(group => group.options).find(option => option.id === answers.conditionId)?.label[language]
    || options?.catalog.find(option => option.id === answers.conditionId)?.label[language] || c.notProvided;
  const genderLabel = ({ female: c.female, male: c.male, other: c.other, 'prefer-not-to-say': c.prefer } as Record<string, string>)[answers.gender || ''];
  const levelLabel = ({ beginner: c.beginner, intermediate: c.intermediate, advanced: c.advanced } as Record<string, string>)[answers.trainingLevel || ''];
  const summary = [[c.purpose, answers.purpose === 'professional' ? c.professional : c.rehabilitation], [c.nickname, answers.nickname], [c.fullName, answers.fullName], [c.phone, answers.phone], [c.email, answers.email], [c.gender, genderLabel], [c.age, answers.age], [c.weight, answers.weight], [c.level, levelLabel], [c.condition, conditionLabel], [c.otherDetails, answers.conditionDetails], [c.additionalInfo, answers.additionalInfo], [c.date, c.automatic]];
  return <div className={s.page} lang={language}>
    <header className={s.brand}><Link href="/" aria-label="GHRS"><SimpleLogo /></Link><span>GLOBAL HEALTH & REHABILITATION SYSTEM</span></header>
    <main className={s.container}>
      <div className={s.top}><Link className={s.home} href="/"><FiArrowLeft aria-hidden />{c.home}</Link><div className={s.languages} aria-label="Language"><button type="button" aria-pressed={language === 'en'} onClick={() => selectLanguage('en')}>EN</button><button type="button" aria-pressed={language === 'ru'} onClick={() => selectLanguage('ru')}>RU</button></div></div>
      <div className={s.layout}>
        <aside className={s.aside}><p className={s.eyebrow}>{c.eyebrow}</p><h1>{c.title}</h1><p className={s.intro}>{c.intro}</p><span className={s.time}><FiClock aria-hidden />{c.time}</span>
          <ol className={s.steps}>{c.steps.map((label, index) => <li key={label} data-active={result || index <= step ? 'true' : 'false'} aria-current={!result && index === step ? 'step' : undefined}><span className={s.stepNumber}>{result || index < step ? <FiCheck aria-hidden /> : `0${index + 1}`}</span><div><strong>{label}</strong><small>{c.stepHints[index]}</small></div></li>)}</ol>
        </aside>
        <section className={s.card} aria-busy={sending}>
          {result ? <div className={s.empty}><div className={s.successIcon}><FiCheck aria-hidden /></div><h2 ref={heading} tabIndex={-1}>{c.success}</h2><p className={s.hint}>{c.saved}</p><p className={s.notice}>{result.outcome === 'catalog' ? c.catalogResult : result.outcome === 'professional' ? c.professionalResult : c.reviewResult}</p>
            <div className={s.links}>{result.links.map(link => <Link href={link.href} key={link.href} className={s.resultLink}><div><strong>{link.title[language]}</strong><small>{c.openCatalog}</small></div><FiArrowRight aria-hidden /></Link>)}</div><p className={s.hint}>{c.sentAt}: {new Date(result.createdAt).toLocaleString(language)}</p><button type="button" className={s.primary} onClick={() => { setResult(null); change('consent', false); setPrevious(true); move(0); }}>{c.another}</button>
          </div> : <form onSubmit={send}>
            <h2 ref={heading} tabIndex={-1}>{[c.first, c.second, c.third][step]}</h2><p className={s.hint}>{[c.firstHint, c.secondHint, c.thirdHint][step]}</p>
            {step === 0 && <><p className={s.required}>{c.required}</p>{previous && <p className={s.notice}>{c.previous}</p>}<fieldset className={s.choices}><legend>{c.purpose} *</legend><div className={s.choiceGrid}>{(['rehabilitation', 'professional'] as const).map(value => <label key={value} className={s.choice}><input type="radio" name="purpose" value={value} checked={answers.purpose === value} onChange={() => change('purpose', value)} required /><span><strong>{c[value]}</strong><small>{value === 'rehabilitation' ? c.rehabilitationHint : c.professionalHint}</small></span></label>)}</div></fieldset>
              <div className={s.fields}>
                <label className={s.field}><span>{c.nickname} *</span><input required maxLength={80} autoComplete="nickname" value={answers.nickname} onChange={event => change('nickname', event.target.value)} /></label>
                <label className={s.field}><span>{c.fullName}</span><input maxLength={200} autoComplete="name" value={answers.fullName || ''} onChange={event => change('fullName', event.target.value)} /></label>
                <label className={s.field}><span>{c.phone} *</span><input required type="tel" autoComplete="tel" maxLength={30} pattern={'\\+?[0-9 \\(\\)\\-]{7,30}'} value={answers.phone} onChange={event => change('phone', event.target.value)} /></label>
                <label className={s.field}><span>{c.email}</span><input type="email" autoComplete="email" maxLength={254} value={answers.email || ''} onChange={event => change('email', event.target.value)} /></label>
                <label className={s.field}><span>{c.gender}</span><select value={answers.gender || ''} onChange={event => change('gender', event.target.value)}><option value="">{c.optional}</option><option value="female">{c.female}</option><option value="male">{c.male}</option><option value="other">{c.other}</option><option value="prefer-not-to-say">{c.prefer}</option></select></label>
                <div className="grid grid-cols-2 gap-4"><label className={s.field}><span>{c.age}</span><input type="number" min={1} max={120} step={1} value={answers.age ?? ''} onChange={event => change('age', event.target.value ? Number(event.target.value) : undefined)} /></label><label className={s.field}><span>{c.weight}</span><input type="number" min={1} max={500} step="0.1" value={answers.weight ?? ''} onChange={event => change('weight', event.target.value ? Number(event.target.value) : undefined)} /></label></div>
              </div></>}
            {step === 1 && <>{loadError && <p className={s.notice}>{c.catalogUnavailable} <button type="button" className="underline" onClick={() => setRevision(value => value + 1)}>{c.retry}</button></p>}<fieldset className={s.choices}><legend>{c.level} · {c.optional}</legend><div className={`${s.choiceGrid} ${s.levelGrid}`}>{(['beginner', 'intermediate', 'advanced'] as const).map(value => <label className={s.choice} key={value}><input type="radio" name="trainingLevel" value={value} checked={answers.trainingLevel === value} onChange={() => change('trainingLevel', value)} /><span><strong>{c[value]}</strong><small>{c[`${value}Hint`]}</small></span></label>)}</div></fieldset>
              <div className={s.fields}><label className={`${s.field} ${s.wide}`}><span>{c.condition}</span><select aria-describedby="condition-hint" value={answers.conditionId || ''} onChange={event => change('conditionId', event.target.value)}><option value="">{c.select}</option>{!!options?.catalog.length && <optgroup label={c.catalog}>{options.catalog.map(option => <option key={option.id} value={option.id}>{option.label[language]}</option>)}</optgroup>}{options?.groups.map(group => <optgroup key={group.id} label={group.label[language]}>{group.options.map(option => <option key={option.id} value={option.id}>{option.label[language]}</option>)}</optgroup>)}</select><small id="condition-hint" className={s.hint}>{c.conditionHint}</small></label>
                <label className={`${s.field} ${s.wide}`}><span>{c.otherDetails}{answers.conditionId?.endsWith('-other') ? ' *' : ''}</span><textarea required={answers.conditionId?.endsWith('-other')} maxLength={2000} value={answers.conditionDetails || ''} placeholder={c.otherPlaceholder} onChange={event => change('conditionDetails', event.target.value)} /></label>
                <label className={`${s.field} ${s.wide}`}><span>{c.additionalInfo}</span><textarea maxLength={5000} value={answers.additionalInfo || ''} placeholder={c.additionalPlaceholder} onChange={event => change('additionalInfo', event.target.value)} /></label>
              </div></>}
            {step === 2 && <>{!user && <p className={s.notice}>{c.signInHint} <Link className="underline" href="/auth/login?returnTo=%2Ftest" onClick={rememberDraft}>{c.signInButton}</Link></p>}<dl className={s.summary}>{summary.map(([label, value]) => <div key={String(label)}><dt>{label}</dt><dd>{value || c.notProvided}</dd></div>)}</dl><label className={s.consent}><input required type="checkbox" checked={answers.consent} onChange={event => change('consent', event.target.checked)} /><span>{c.consent}</span></label></>}
            {error && <div className={s.error} role="alert">{error === 'session' ? <>{c.sessionError} <Link className="underline" href="/auth/login?returnTo=%2Ftest" onClick={rememberDraft}>{c.signInButton}</Link></> : c.saveError}</div>}
            <div className={s.actions}>{step > 0 ? <button className={s.back} type="button" disabled={sending} onClick={() => move(step - 1)}><FiArrowLeft aria-hidden />{c.back}</button> : <span className={s.required}>01 / 03</span>}<button type="submit" disabled={sending || (step === 2 && authLoading)} className={s.primary}>{sending ? c.sending : step === 2 ? c.submit : c.next}{!sending && <FiArrowRight aria-hidden />}</button></div>
          </form>}
        </section>
      </div>
    </main>
  </div>;
}
