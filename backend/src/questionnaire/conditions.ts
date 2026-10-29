// The questionnaire taxonomy follows the supplied GHRS intake form.
export type LocalizedLabel = { en: string; ru: string };
export const CONDITION_GROUPS = [
  { id: 'orthopedics', label: { en: 'Orthopedics', ru: 'Ортопедия' }, options: [
    ['neck', 'Cervical spine', 'Шейный отдел позвоночника'],
    ['lumbar', 'Lumbar spine and pelvic girdle', 'Поясничный отдел позвоночника и тазовый пояс'],
    ['flat-back', 'Flat back', 'Плоская спина'],
    ['round-back', 'Round back', 'Сутулость'],
    ['scoliosis', 'Scoliosis', 'Сколиоз'],
    ['thoracic', 'Thoracic spine', 'Грудной отдел позвоночника'],
    ['upper-limbs', 'Upper limbs and shoulder girdle', 'Верхние конечности и плечевой пояс'],
    ['lower-limbs', 'Lower limbs and pelvic girdle', 'Нижние конечности и тазовый пояс'],
    ['orthopedics-other', 'Other orthopedic condition', 'Другое ортопедическое заболевание'],
  ] },
  { id: 'neurology', label: { en: 'Neurology', ru: 'Неврология' }, options: [
    ['parkinsons', "Parkinson’s disease", 'Болезнь Паркинсона'],
    ['facial-palsy', 'Facial palsy', 'Паралич лицевого нерва'],
    ['multiple-sclerosis', 'Multiple sclerosis', 'Рассеянный склероз'],
    ['stroke', 'Stroke', 'Инсульт'],
    ['neurology-other', 'Other neurological condition', 'Другое неврологическое заболевание'],
  ] },
  { id: 'general', label: { en: 'Other areas', ru: 'Другие направления' }, options: [
    ['obesity', 'Obesity', 'Ожирение'],
    ['senior-strength', 'Senior health: strengthening and supportive therapy', 'Пожилой возраст: общеукрепляющая и поддерживающая терапия'],
    ['senior-balance', 'Senior health: balance and fall prevention', 'Пожилой возраст: равновесие и предотвращение падений'],
    ['senior-support', 'Senior health: everyday strategies and assistive devices', 'Пожилой возраст: повседневные навыки и вспомогательные средства'],
    ['post-covid', 'Post-COVID rehabilitation', 'Реабилитация после COVID'],
    ['speech', 'Aphasia and dysarthria', 'Афазия и дизартрия'],
    ['gait', 'Post-traumatic gait rehabilitation', 'Посттравматическая реабилитация походки'],
    ['general-other', 'Other / describe your condition', 'Другое / опишите ваше состояние'],
  ] },
].map(group => ({ ...group, options: group.options.map(([id, en, ru]) => ({ id, label: { en, ru } })) }));

// Exact, explicit catalogue-name aliases connect the intake taxonomy to existing
// sections. This is navigation, not a clinical recommendation or a fuzzy match.
const CATALOG_ALIASES: Record<string, string[]> = {
  neck: ['Cervical Spine Problems', 'Шейный отдел позвоночника'],
  lumbar: ['Lumbar Spine Problems', 'Lumber Spine Problems', 'Поясничный отдел позвоночника'],
  thoracic: ['Thoracic Spine Problems', 'Грудной отдел позвоночника'],
  'flat-back': ['Posture Problems', 'Проблемы осанки'],
  'round-back': ['Posture Problems', 'Проблемы осанки'],
  scoliosis: ['Posture Problems', 'Проблемы осанки'],
  'upper-limbs': ['Upper Limbs Problems', 'Проблемы верхних конечностей'],
  'lower-limbs': ['Lower Limbs Problems', 'Проблемы нижних конечностей'],
  parkinsons: ["Parkinson's Disease", 'Болезнь Паркинсона'],
  'facial-palsy': ['Facial Nerve Paralysis', 'Паралич лицевого нерва'],
  'multiple-sclerosis': ['Multiple Sclerosis', 'Рассеянный склероз'],
  stroke: ['Stroke', 'Инсульт'], obesity: ['Obesity', 'Ожирение'],
  'senior-strength': ["Senior's Zone"], 'senior-balance': ["Senior's Zone"], 'senior-support': ["Senior's Zone"],
  'post-covid': ['Rehabilitation after COVID-19', 'Реабилитация после COVID-19'],
  speech: ['Aphasia and Dysarthria', 'Афазия и дизартрия'],
  gait: ['Post-traumatic rehabilitation of gait disorders', 'Посттравматическая реабилитация походки'],
};
const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ');
export function findCatalogSection<T extends { label: LocalizedLabel }>(conditionId: string | undefined, catalog: T[]): T | undefined {
  const aliases = (CATALOG_ALIASES[conditionId || ''] || []).map(normalize);
  const matches = catalog.filter(section => aliases.includes(normalize(section.label.en)) || aliases.includes(normalize(section.label.ru)));
  return matches.length === 1 ? matches[0] : undefined;
}
