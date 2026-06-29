// ============================================================
// 出来事メタ（コード側）: 公式リンク / 介護導線 / 3問ナビ / 検索類語
// DBスキーマを汚さず、自治体共通のUI挙動を定義する。
// 磐田市の公式セクションURLは官公式（city.iwata）。
// ============================================================

import type { EventMeta } from '../types';

const IWATA = 'https://www.city.iwata.shizuoka.jp';

/** 出来事ID → メタ。officialUrl は最終案内先（公式が正本）。 */
export const EVENT_META: Record<string, EventMeta> = {
  death: {
    categoryId: 'kurashi',
    officialUrl: `${IWATA}/kurashi_tetsuzuki/index.html`,
    officialLabel: '磐田市「くらし・手続き」',
    nav: {
      intro: '3つの質問に答えると、必要な手続きだけを表示します。',
      questions: [
        { id: 'q1', label: '亡くなった方は磐田市に住民登録がありましたか？', hideStepOrdersIfNo: [], noteIfNo: '住民登録のあった市区町村が届出の窓口になります。' },
        { id: 'q2', label: '国保・後期高齢者医療・介護保険を利用していましたか？', hideStepOrdersIfNo: [3, 4], noteIfNo: '保険・介護の喪失手続きは不要なことがあります。' },
        { id: 'q3', label: '不動産・固定資産を持っていましたか？', hideStepOrdersIfNo: [7], noteIfNo: '不動産の相続登記は不要です。' },
      ],
    },
  },
  moving_in: {
    categoryId: 'kurashi',
    officialUrl: `${IWATA}/kurashi_tetsuzuki/index.html`,
    officialLabel: '磐田市「くらし・手続き」',
  },
  moving_out: {
    categoryId: 'kurashi',
    officialUrl: `${IWATA}/kurashi_tetsuzuki/index.html`,
    officialLabel: '磐田市「くらし・手続き」',
  },
  birth: {
    categoryId: 'kosodate',
    officialUrl: `${IWATA}/kosodate_kyouiku/index.html`,
    officialLabel: '磐田市「子育て・教育」',
  },
  elderly_care: {
    categoryId: 'fukushi',
    officialUrl: `${IWATA}/kenkou_fukushi/index.html`,
    officialLabel: '磐田市「健康・福祉・医療」',
    careFunnel: true,
  },
  garbage: {
    categoryId: 'kurashi',
    officialUrl: `${IWATA}/kurashi_tetsuzuki/gomi_recycle/index.html`,
    officialLabel: '磐田市「ごみ・資源循環」',
  },
  disaster: {
    categoryId: 'bousai',
    officialUrl: `${IWATA}/bousai_anzen/index.html`,
    officialLabel: '磐田市「防災・安全」',
  },
  tax_notice: {
    categoryId: 'kurashi',
    officialUrl: `${IWATA}/kurashi_tetsuzuki/index.html`,
    officialLabel: '磐田市「くらし・手続き」',
  },
  facility_booking: {
    categoryId: 'event',
    officialUrl: `${IWATA}/sports_midokoro/index.html`,
    officialLabel: '磐田市「スポーツ・みどころ」',
  },
  vacant_house: {
    categoryId: 'kurashi',
    officialUrl: `${IWATA}/kurashi_tetsuzuki/index.html`,
    officialLabel: '磐田市「くらし・手続き」',
  },
};

/** トップの「緊急・重要カード」に出す出来事ID（順番どおり） */
export const URGENT_EVENTS = ['disaster', 'elderly_care', 'garbage'] as const;

/**
 * 検索語のゆらぎ → 出来事ID（簡易・ルールベース。LLMは使わない）。
 * 「親が死んだ」「引っ越した」等を適切な困りごとへ寄せる。
 * 部分一致で評価し、最初に当たった出来事を返す。
 */
export const EVENT_SYNONYMS: Array<{ event: string; keywords: string[] }> = [
  { event: 'death', keywords: ['死', '亡くな', 'なくな', '葬', '逝去', 'お悔', '相続', '遺産', '喪'] },
  { event: 'moving_in', keywords: ['引っ越してき', '転入', '引越してき', 'ひっこしてき', '越してき', '住み始め'] },
  { event: 'moving_out', keywords: ['引っ越す', '引越す', '転出', '出てい', '退去', 'ひっこす', '引っ越し予定'] },
  { event: 'birth', keywords: ['生まれ', '出産', '出生', '赤ちゃん', '妊娠', '児童手当', '子どもができ'] },
  { event: 'elderly_care', keywords: ['介護', '要介護', '認知症', '地域包括', 'デイサービス', 'ヘルパー', '寝たき', '老人ホーム', '親の世話'] },
  { event: 'garbage', keywords: ['ごみ', 'ゴミ', '粗大', '分別', '収集', 'リサイクル', '不用品'] },
  { event: 'disaster', keywords: ['台風', '大雨', '地震', '避難', '災害', 'ハザード', '洪水', '津波', '防災'] },
  { event: 'tax_notice', keywords: ['税', '納税', '固定資産', '住民税', '市県民税', '軽自動車税', '納付', '督促'] },
  { event: 'facility_booking', keywords: ['施設を借り', '公民館', '体育館', '会議室', '予約', '貸館', 'ホールを借り'] },
  { event: 'vacant_house', keywords: ['空き家', '実家', '親の家', '空家', '解体', '相続した家', '誰も住んで'] },
];

/** 検索語から最も近い出来事IDを推定（見つからなければ null） */
export function matchEvent(query: string): string | null {
  const q = (query || '').trim();
  if (!q) return null;
  for (const { event, keywords } of EVENT_SYNONYMS) {
    if (keywords.some((k) => q.includes(k))) return event;
  }
  return null;
}
