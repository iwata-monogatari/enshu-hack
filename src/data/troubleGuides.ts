// ============================================================
// 困りごとガイド 初期10件（出来事ID = slug は全自治体共通）
// 公式文章の丸写しはしない。一般的な手続きの流れを「行動文」で示し、
// 詳細・最新は必ず公式ページ（troubleMeta の officialUrl）へ案内する。
// last_verified_at は seed 時に LAST_VERIFIED で付与。
// ============================================================

import type { TroubleGuide } from '../types';

export const LAST_VERIFIED = '2026-06-29';

export const TROUBLE_GUIDES: TroubleGuide[] = [
  // 1. 家族が亡くなった ------------------------------------------------
  {
    slug: 'death',
    title: '家族が亡くなったとき',
    situation_label: '家族が亡くなった',
    summary: '届出から保険・年金・介護・税金・不動産まで、必要な手続きを順番に確認します。',
    first_action:
      'まず死亡届を確認します。次に健康保険・年金・介護・税金・不動産の順に確認します。相続登記は市役所ではなく法務局です。',
    target_person: 'ご遺族',
    priority: 'A+',
    steps: [
      { step_order: 1, timing: 'today', task_name: '死亡届を出す（亡くなってから7日以内）', deadline: '7日以内', window_name: '市民課', required_items: ['死亡診断書（死亡届と一体）', '届出人の印鑑'], is_municipal: 1, nav_tags: ['base'], note: '葬儀社が代行してくれる場合が多いです。' },
      { step_order: 2, timing: 'today', task_name: '火葬許可証を受け取る', window_name: '市民課', is_municipal: 1, nav_tags: ['base'], note: '死亡届と同時に受け取れます。' },
      { step_order: 3, timing: 'this_week', task_name: '健康保険の資格喪失・葬祭費の確認', window_name: '国保年金課', required_items: ['保険証'], is_municipal: 1, nav_tags: ['insurance'], note: '国保・後期高齢者医療の方が対象です。' },
      { step_order: 4, timing: 'this_week', task_name: '介護保険の資格喪失・保険料の精算', window_name: '介護保険課', required_items: ['介護保険被保険者証'], is_municipal: 1, nav_tags: ['insurance'], note: '介護保険を利用していた方が対象です。' },
      { step_order: 5, timing: 'this_week', task_name: '年金を止める・未支給年金の確認', outside_agency: '年金事務所（厚生年金の場合）', is_municipal: 0, nav_tags: ['pension'], note: '国民年金は市役所、厚生年金は年金事務所が窓口です。' },
      { step_order: 6, timing: 'later', task_name: '世帯主の変更（必要な場合）', window_name: '市民課', is_municipal: 1, nav_tags: ['base'] },
      { step_order: 7, timing: 'later', task_name: '不動産の相続登記', outside_agency: '法務局（静岡地方法務局 磐田支局）', is_municipal: 0, nav_tags: ['realestate'], note: '相続登記は2024年から義務化されています。市役所ではなく法務局です。' },
      { step_order: 8, timing: 'later', task_name: '預貯金・公共料金・運転免許などの名義変更・解約', is_municipal: 0, nav_tags: ['base'] },
    ],
  },

  // 2. 引っ越してきた --------------------------------------------------
  {
    slug: 'moving_in',
    title: '磐田市に引っ越してきたとき',
    situation_label: '引っ越してきた',
    summary: '転入届を14日以内に出し、マイナンバー・保険・子ども関係を順に確認します。',
    first_action: 'まず転入届を14日以内に出します。次にマイナンバー・保険・子ども関係を確認します。',
    target_person: '転入された方',
    priority: 'A+',
    steps: [
      { step_order: 1, timing: 'today', task_name: '転入届を出す（引っ越し後14日以内）', deadline: '14日以内', window_name: '市民課', required_items: ['前住所の転出証明書', '本人確認書類', 'マイナンバーカード（お持ちの方）'], is_municipal: 1 },
      { step_order: 2, timing: 'this_week', task_name: 'マイナンバーカードの住所変更', window_name: '市民課', required_items: ['マイナンバーカード', '暗証番号'], is_municipal: 1 },
      { step_order: 3, timing: 'this_week', task_name: '国民健康保険・国民年金の手続き（該当する方）', window_name: '国保年金課', is_municipal: 1 },
      { step_order: 4, timing: 'this_week', task_name: '子どもの転入学・児童手当・保育の手続き', window_name: '学校教育課／こども未来課', is_municipal: 1, note: 'お子さんがいる場合です。' },
      { step_order: 5, timing: 'later', task_name: '上下水道・電気・ガスの開始', outside_agency: '電気・ガスは各事業者', is_municipal: 0, note: '上下水道は市の窓口、電気・ガスは契約先へ。' },
      { step_order: 6, timing: 'later', task_name: '運転免許・車庫証明・郵便の転送', outside_agency: '警察署・郵便局', is_municipal: 0 },
    ],
  },

  // 3. 引っ越す（転出） -----------------------------------------------
  {
    slug: 'moving_out',
    title: '磐田市から引っ越すとき',
    situation_label: '引っ越す',
    summary: '転出届を出して転出証明書を受け取り、保険・子ども・公共料金を整理します。',
    first_action:
      'まず転出届を出して転出証明書を受け取ります。新住所では14日以内に転入届を出します。',
    target_person: '転出される方',
    priority: 'A',
    steps: [
      { step_order: 1, timing: 'this_week', task_name: '転出届を出す（引っ越しの前後）', window_name: '市民課', is_municipal: 1, note: '市外への引っ越しはマイナンバーカードでのオンライン転出届も使えます。' },
      { step_order: 2, timing: 'this_week', task_name: '国保・介護・各種手当の住所変更・喪失手続き', window_name: '国保年金課／介護保険課', is_municipal: 1 },
      { step_order: 3, timing: 'this_week', task_name: '子どもの転校手続き', window_name: '学校教育課', is_municipal: 1, note: 'お子さんがいる場合です。' },
      { step_order: 4, timing: 'later', task_name: '上下水道の使用停止', window_name: '上下水道部', is_municipal: 1 },
      { step_order: 5, timing: 'later', task_name: '電気・ガス・郵便・各種契約の住所変更', outside_agency: '各事業者・郵便局', is_municipal: 0 },
    ],
  },

  // 4. 子どもが生まれた -----------------------------------------------
  {
    slug: 'birth',
    title: '子どもが生まれたとき',
    situation_label: '子どもが生まれた',
    summary: '出生届を14日以内に出し、児童手当・子ども医療費・健診を確認します。',
    first_action: 'まず出生届を14日以内に出します。次に児童手当と子ども医療費助成を申請します。',
    target_person: '保護者の方',
    priority: 'A+',
    steps: [
      { step_order: 1, timing: 'today', task_name: '出生届を出す（生まれた日を含めて14日以内）', deadline: '14日以内', window_name: '市民課', required_items: ['出生証明書（出生届と一体）', '母子健康手帳', '届出人の印鑑'], is_municipal: 1 },
      { step_order: 2, timing: 'this_week', task_name: '児童手当の申請', window_name: 'こども未来課', is_municipal: 1, note: '申請が遅れるとさかのぼれない場合があります。早めに。' },
      { step_order: 3, timing: 'this_week', task_name: '子ども医療費助成（受給者証）の申請', window_name: 'こども未来課', is_municipal: 1 },
      { step_order: 4, timing: 'this_week', task_name: '健康保険への加入', outside_agency: '勤務先（社保の場合）', is_municipal: 0, note: '国保の方は市役所、社保の方は勤務先で。' },
      { step_order: 5, timing: 'later', task_name: '乳幼児健診・予防接種の予定を確認', window_name: '健康増進課', is_municipal: 1 },
    ],
  },

  // 5. 介護が始まった -------------------------------------------------
  {
    slug: 'elderly_care',
    title: '介護が始まったとき',
    situation_label: '介護が始まった',
    summary: 'まず地域包括支援センターに相談し、要介護認定からサービス利用へ進みます。',
    first_action: 'まず地域包括支援センターに電話します。次に要介護認定を申請します。',
    target_person: 'ご本人・ご家族',
    priority: 'A+',
    steps: [
      { step_order: 1, timing: 'today', task_name: '地域包括支援センターに相談する', outside_agency: '地域包括支援センター（市の委託）', is_municipal: 0, note: '何から始めるか分からないときは、まずここに電話します。' },
      { step_order: 2, timing: 'this_week', task_name: '要介護認定を申請する', window_name: '介護保険課', required_items: ['介護保険被保険者証', 'マイナンバーが分かるもの'], is_municipal: 1 },
      { step_order: 3, timing: 'this_week', task_name: '主治医意見書を依頼する', outside_agency: 'かかりつけ医', is_municipal: 0 },
      { step_order: 4, timing: 'later', task_name: 'ケアマネジャー（居宅介護支援事業所）を決める', outside_agency: '居宅介護支援事業所', is_municipal: 0 },
      { step_order: 5, timing: 'later', task_name: 'ケアプランを作りサービス利用を開始する', outside_agency: '介護サービス事業所', is_municipal: 0 },
    ],
  },

  // 6. ごみを出したい -------------------------------------------------
  {
    slug: 'garbage',
    title: 'ごみを出したいとき',
    situation_label: 'ごみを出したい',
    summary: '地区の収集曜日と分別ルールを確認します。粗大ごみは予約が必要なことがあります。',
    first_action: 'まず自分の地区の収集曜日と分別を確認します。粗大ごみは予約が必要なことがあります。',
    target_person: '市民の方',
    priority: 'A',
    steps: [
      { step_order: 1, timing: 'today', task_name: '自分の地区の収集曜日を確認する', is_municipal: 1, note: '地区ごとに曜日が違います。' },
      { step_order: 2, timing: 'today', task_name: '分別ルールを確認する（燃える・燃えない・資源・プラ）', is_municipal: 1 },
      { step_order: 3, timing: 'this_week', task_name: '粗大ごみの出し方・予約方法を確認する', is_municipal: 1, note: '予約制・有料の場合があります。' },
      { step_order: 4, timing: 'later', task_name: '引っ越しの大量ごみ・家電は処分方法を確認する', outside_agency: '家電量販店（家電リサイクル）', is_municipal: 0 },
    ],
  },

  // 7. 台風・大雨が心配 -----------------------------------------------
  {
    slug: 'disaster',
    title: '台風・大雨が心配なとき',
    situation_label: '台風・大雨が心配',
    summary: 'ハザードマップで自宅の危険度を確認し、避難所と避難のタイミングを決めます。',
    first_action: 'まずハザードマップで自宅の危険度を確認します。次に避難所と避難のタイミングを決めます。',
    target_person: '市民の方',
    priority: 'A+',
    steps: [
      { step_order: 1, timing: 'today', task_name: 'ハザードマップで自宅の危険度を確認する', is_municipal: 1 },
      { step_order: 2, timing: 'today', task_name: '近くの避難所の場所と開設状況を確認する', is_municipal: 1 },
      { step_order: 3, timing: 'today', task_name: '非常持ち出し袋・水・食料・モバイルバッテリーを準備する', is_municipal: 0 },
      { step_order: 4, timing: 'this_week', task_name: '防災メール・アプリで緊急情報を受け取る設定をする', is_municipal: 1, note: '早めの避難が一番安全です。' },
    ],
  },

  // 8. 税金の通知が届いた ---------------------------------------------
  {
    slug: 'tax_notice',
    title: '税金の通知が届いたとき',
    situation_label: '税金の通知が届いた',
    summary: 'どの税かを確認し、納期限と支払方法を確認します。払えないときは早めに相談を。',
    first_action: 'まず何の税金か確認します。払えないときは放置せず、早めに納税相談をします。',
    target_person: '納税義務のある方',
    priority: 'A',
    steps: [
      { step_order: 1, timing: 'today', task_name: 'どの税か確認する（市県民税・固定資産税・国保税・軽自動車税）', is_municipal: 1 },
      { step_order: 2, timing: 'this_week', task_name: '納期限と支払方法を確認する（口座振替・スマホ決済など）', window_name: '収納課', is_municipal: 1 },
      { step_order: 3, timing: 'this_week', task_name: '払えないときは早めに納税相談をする', window_name: '収納課', is_municipal: 1, note: '放置すると延滞金や差押えにつながります。早めの相談が大切です。' },
      { step_order: 4, timing: 'later', task_name: '金額や内容に疑問があれば問い合わせる', window_name: '課税課', is_municipal: 1 },
    ],
  },

  // 9. 施設を借りたい -------------------------------------------------
  {
    slug: 'facility_booking',
    title: '施設を借りたいとき',
    situation_label: '施設を借りたい',
    summary: '借りたい施設と利用日を決め、予約方法・空き状況・料金を確認します。',
    first_action: 'まず借りたい施設と利用日を決めます。次に予約方法と空き状況を確認します。',
    target_person: '市民の方',
    priority: 'B',
    steps: [
      { step_order: 1, timing: 'today', task_name: '借りたい施設の種類を決める（公民館・体育館・文化施設など）', is_municipal: 1 },
      { step_order: 2, timing: 'this_week', task_name: '予約方法（窓口・電話・オンライン）と空き状況を確認する', is_municipal: 1 },
      { step_order: 3, timing: 'this_week', task_name: '利用料金・利用区分・必要書類を確認する', is_municipal: 1 },
      { step_order: 4, timing: 'later', task_name: '当日の鍵の受け渡し・利用後の片付けを確認する', is_municipal: 1 },
    ],
  },

  // 10. 親の家・空き家をどうするか分からない --------------------------
  {
    slug: 'vacant_house',
    title: '親の家・空き家をどうするか分からないとき',
    situation_label: '親の家・空き家をどうするか分からない',
    summary: '名義と相続登記の状況を確認し、税金・管理、活用・売却・解体の順に考えます。',
    first_action:
      'まず名義と相続登記の状況を確認します。次に税金と管理、最後に活用・売却・解体を考えます。',
    target_person: 'ご家族・所有者',
    priority: 'A',
    steps: [
      { step_order: 1, timing: 'today', task_name: '家の名義（所有者）が誰か確認する', is_municipal: 0 },
      { step_order: 2, timing: 'this_week', task_name: '相続登記が済んでいるか確認する', outside_agency: '法務局（静岡地方法務局 磐田支局）', is_municipal: 0, note: '相続登記は2024年から義務化されています。' },
      { step_order: 3, timing: 'this_week', task_name: '固定資産税と管理（草木・老朽化）の状況を確認する', window_name: '課税課', is_municipal: 1 },
      { step_order: 4, timing: 'later', task_name: '活用・売却・解体・賃貸の方向性を相談する', outside_agency: '空き家相談窓口・専門家', is_municipal: 0 },
      { step_order: 5, timing: 'later', task_name: '介護施設入居などで実家を整理する場合は早めに動く', is_municipal: 0 },
    ],
  },
];
