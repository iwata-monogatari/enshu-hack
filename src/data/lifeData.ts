// ============================================================
// 遠州ライフハック：13大項目・全中項目 定義データ
// ============================================================

export interface SeedTopic {
  slug: string;
  title: string;
  icon: string;
  summary: string;
  rank: string; // A++, A+, A, B, C
  who_needs_this: string;
  first_action: string;
  today_tasks?: string[];
  this_week_tasks?: string[];
  later_tasks?: string[];
  required_items?: string[];
  municipal_window?: string;
  outside_agencies?: string;
  caution?: string;
  official_sources?: string; // JSON String or Format: Title|URL
  consult_type?: string;
}

export interface SeedCategory {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  topics: SeedTopic[];
}

export const LIFE_DATA: SeedCategory[] = [
  {
    slug: 'living-soon',
    title: 'これから暮らす',
    subtitle: '移住の検討や学校区、交通の便など、磐田での暮らしを計画されている方に',
    icon: '🌱',
    topics: [
      {
        slug: 'want-to-live',
        title: '磐田市に住みたい',
        icon: '🏠',
        summary: '磐田市への移住・定住を支援するための情報、住まい探しのサポートをまとめました。',
        rank: 'A+',
        who_needs_this: '磐田市への移住を検討している方、サポート制度を探している方。',
        first_action: '移住促進パンフレットを確認し、相談窓口に問い合わせてみましょう。',
        today_tasks: ['移住相談窓口の連絡先を調べる', '磐田市の概要ページを読む'],
        this_week_tasks: ['移住支援金（UIJターン支援）の要件を確認する'],
        later_tasks: ['実際に磐田市を訪れ、生活環境を下見する'],
        required_items: ['身分証明書', '現在の世帯情報'],
        municipal_window: '企画部 企画政策課',
        official_sources: '磐田市移住促進サイト「いいわたし」|https://www.city.iwata.shizuoka.jp/shisei_jouhou/pr_katsudou/1009587.html'
      },
      {
        slug: 'moving-decided',
        title: '磐田市へ引っ越すことが決まった',
        icon: '🚚',
        summary: '引っ越しの準備、転出元の手続き、磐田市へ持参する書類等のステップです。',
        rank: 'A+',
        who_needs_this: '他市区町村から磐田市への引っ越しが決まり、準備を始める方。',
        first_action: '現在住んでいる自治体に「転出届」を提出して転出証明書を取得しましょう。',
        today_tasks: ['現在の自治体の転出届窓口・オンライン申請を調べる', '引っ越し業者の選定・手配'],
        this_week_tasks: ['転出証明書を受け取る', '電気・ガス・水道の解約および開始手続き'],
        later_tasks: ['磐田市に到着後14日以内に転入手続きを行う'],
        required_items: ['本人確認書類', '印鑑'],
        municipal_window: '市民課（または各支所市民生活課）',
        official_sources: '転入届について（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001391.html'
      },
      {
        slug: 'about-iwata',
        title: '磐田ってどんなまち？',
        icon: '🗺️',
        summary: '気候、特産物、主要産業、治安、子育て環境など、磐田市の概要を知るための情報です。',
        rank: 'C',
        who_needs_this: '磐田市の基本情報（特長、風土など）を知りたい方。',
        first_action: '市公式サイトで磐田市の基本紹介ページや広報誌を参照してください。',
        official_sources: '磐田市の紹介|https://www.city.iwata.shizuoka.jp/shisei_jouhou/city_promotion/index.html'
      },
      {
        slug: 'school-districts',
        title: '学校区を知りたい',
        icon: '🎒',
        summary: 'お住まいの住所、または予定地に対応する磐田市立小中学校の通学区域を調べられます。',
        rank: 'A+',
        who_needs_this: '学齢期のお子さんを持つ世帯で、引っ越し先の学校区を特定したい方。',
        first_action: '通学区域一覧表で対象の住所を検索しましょう。',
        today_tasks: ['候補地の住所を確認する', '学校教育課に問い合わせる'],
        this_week_tasks: ['通学区域一覧PDFをダウンロードして照合する'],
        required_items: ['住所情報（番地まで）'],
        municipal_window: '教育委員会 学校教育課',
        official_sources: '小中学校通学区域（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/kyouiku/1001608.html'
      },
      {
        slug: 'transportation',
        title: '交通の便を知りたい',
        icon: '🚌',
        summary: 'JR東海道線（磐田駅・豊田町駅・御厨駅）、遠鉄バス、デマンド型交通などの案内です。',
        rank: 'A',
        who_needs_this: '磐田市内の公共交通機関や通勤・通学の利便性を知りたい方。',
        first_action: '主要路線図とコミュニティバス「しっぺいバス」の時刻表を確認しましょう。',
        today_tasks: ['最寄り駅とバス停の位置を確認する'],
        this_week_tasks: ['自主運行バスのルートと運行曜日を確認する'],
        municipal_window: '都市整備部 道路河川課（公共交通対策室）',
        official_sources: '公共交通・バス（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/koutsuu_bouhan/index.html'
      },
      {
        slug: 'disaster-risk',
        title: '災害リスクを確認したい',
        icon: '⚠️',
        summary: '磐田市内の洪水、土砂災害、津波、地震の想定マップ（ハザードマップ）の案内です。',
        rank: 'A',
        who_needs_this: '居住エリアや職場周辺 of 災害リスクを知りたい方。',
        first_action: '「磐田市GIS（電子地図）」またはハザードマップ冊子を確認しましょう。',
        today_tasks: ['自宅周辺の海抜や浸水想定を確認する'],
        this_week_tasks: ['避難所マップをダウンロードしてルートを確認する'],
        municipal_window: '危機管理部 防災対策課',
        official_sources: 'ハザードマップ（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/bousai/1001222.html'
      }
    ]
  },
  {
    slug: 'start-living',
    title: '暮らし始めた',
    subtitle: '住民票の手続きやマイナンバー、ごみ出し、ライフラインなど引っ越し直後の手続き',
    icon: '🚚',
    topics: [
      {
        slug: 'moved-in',
        title: '磐田市へ引っ越してきた',
        icon: '🚚',
        summary: '磐田市に引っ越してきた方向けの、役所手続きチェックリストと全体フローです。',
        rank: 'A++',
        who_needs_this: '他市町村から磐田市に引っ越してきた世帯代表者および家族。',
        first_action: '引っ越し後14日以内に市民課で「転入届」を出しましょう。',
        today_tasks: ['前住所の「転出証明書」と「マイナンバーカード」を準備する', '市民課または支所へ行く'],
        this_week_tasks: ['住所変更に伴うマイナンバー等のカード更新を行う', '国保や児童手当の手続きを行う'],
        required_items: ['転出証明書', 'マイナンバーカード', '印鑑', '本人確認書類（運転免許証など）'],
        municipal_window: '市民課（または各支所）',
        official_sources: '転入手続き（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001391.html'
      },
      {
        slug: 'resident-registration',
        title: '住民票・転入手続き',
        icon: '📄',
        summary: '住民票の取得方法、転入・転居・世帯主変更等の手続きの詳細を案内します。',
        rank: 'A+',
        who_needs_this: '住所の変更や、新しく住民票謄本・抄本が必要になった方。',
        first_action: '申請に必要な書類と窓口の受付時間を確認しましょう。',
        today_tasks: ['請求に必要な本人確認書類（免許証など）を財布に入れる'],
        this_week_tasks: ['マイナンバーカードを使ったコンビニ交付も検討する'],
        required_items: ['本人確認書類', '手数料（300円/1通）'],
        municipal_window: '市民課（または各支所）',
        official_sources: '住民票の写し等の請求（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001402.html'
      },
      {
        slug: 'mynumber',
        title: 'マイナンバー',
        icon: '🪪',
        summary: 'マイナンバーカードの住所書き換え、新規申請、暗証番号再設定等の手続きです。',
        rank: 'A',
        who_needs_this: '引っ越しで住所が変わった方、またはカードを新規発行したい方。',
        first_action: '住所変更の際は、家族全員分のマイナンバーカードを窓口へ持参してください。',
        today_tasks: ['マイナンバーカードと暗証番号を確認する'],
        this_week_tasks: ['市民課または支所窓口で住所情報を書き換える'],
        required_items: ['マイナンバーカード', '署名用・利用者用暗証番号（数字4桁および英数字6〜16桁）'],
        municipal_window: '市民課（または各支所）',
        official_sources: 'マイナンバーカードの手続き（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001416.html'
      },
      {
        slug: 'how-to-garbage',
        title: 'ごみの出し方',
        icon: '🗑️',
        summary: '磐田市のごみ分別区分（燃やすごみ、プラスチック、資源ごみなど）や収集カレンダーの案内です。',
        rank: 'A++',
        who_needs_this: '磐田市にお住まいで、日常のごみ出しや粗大ごみの処分方法を知りたい方。',
        first_action: '自分の住むエリアの「家庭ごみ収集カレンダー」を入手しましょう。',
        today_tasks: ['お住まいの自治会・収集場所を確認する', '指定ごみ袋（市推奨袋）を購入する'],
        this_week_tasks: ['収集カレンダーで指定の分別曜日を冷蔵庫などに貼る'],
        required_items: ['磐田市指定ごみ袋'],
        municipal_window: '環境部 ごみ対策課',
        official_sources: '家庭ごみの分け方・出し方（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/gomi_recycle/1001446.html'
      },
      {
        slug: 'water-sewer',
        title: '水道・下水道',
        icon: '🚰',
        summary: '引っ越し時の水道の使用開始・停止の手続き、料金および故障時の連絡先です。',
        rank: 'A+',
        who_needs_this: '引っ越しで水道の開栓・閉栓が必要な方、または水漏れトラブル等の緊急時。',
        first_action: '引っ越し日の数日前までに、オンラインまたは電話で開始・中止を申請しましょう。',
        today_tasks: ['水道の開栓日または閉栓日を決める', '水道お客様センターへ連絡する'],
        this_week_tasks: ['料金の支払い方法（口座振替・クレジットカード等）を設定する'],
        municipal_window: '上下水道部 水道課（水道お客様センター）',
        official_sources: '水道の使用開始・中止（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/suidou_gesuidou/1001489.html'
      },
      {
        slug: 'dog-registration',
        title: '犬の手続き',
        icon: '🐕',
        summary: '犬を飼う際に必要な登録、登録情報の住所変更、および狂犬病予防注射の手続きです。',
        rank: 'A',
        who_needs_this: '犬を飼っている方で、磐田市に転入した、または新しく犬を飼い始めた方。',
        first_action: '環境課の窓口（または支所）で登録または登録情報の変更手続きを行いましょう。',
        today_tasks: ['前住所地で発行された「犬の鑑札」を探す'],
        this_week_tasks: ['鑑札を持参して環境課で変更届を出す'],
        required_items: ['犬の鑑札', '狂犬病予防注射済証'],
        municipal_window: '環境部 環境課',
        official_sources: '犬 of 登録と狂犬病予防注射（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/kankyou/1001511.html'
      },
      {
        slug: 'public-transit',
        title: '公共交通',
        icon: '🚌',
        summary: 'しっぺいバス（コミュニティバス）やデマンドタクシーの利用登録・予約方法です。',
        rank: 'A',
        who_needs_this: '磐田市内でマイカーを使わずに移動手段を確保したい方。',
        first_action: 'デマンド型乗合タクシー「お助け号」の利用登録を行いましょう。',
        today_tasks: ['お助け号の登録申込書を調べる'],
        this_week_tasks: ['申込書を郵送または持参し、登録を完了させる'],
        required_items: ['登録申請書（窓口またはウェブから入手）'],
        municipal_window: '道路河川課（公共交通対策室）',
        official_sources: 'デマンド型乗合タクシー「お助け号」（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/koutsuu_bouhan/1001550.html'
      },
      {
        slug: 'city-hall-branches',
        title: '市役所・支所',
        icon: '🏢',
        summary: '本庁舎、竜洋支所、福田支所、豊田支所、豊岡支所の開庁時間、取扱業務一覧です。',
        rank: 'A',
        who_needs_this: '各種証明書取得や手続きで、近くの役所窓口に行きたい方。',
        first_action: '最寄りの支所の住所と電話番号、受付時間（通常平日8:30〜17:15）を確認しましょう。',
        today_tasks: ['用事がある業務が支所で取り扱っているか電話で確認する'],
        official_sources: '庁舎案内・支所（磐田市）|https://www.city.iwata.shizuoka.jp/shisei_jouhou/shoukai/1001880.html'
      }
    ]
  },
  {
    slug: 'housing',
    title: '家・住まい',
    subtitle: '賃貸、市営住宅、新築・購入、耐震化や空き家、実家の整理に関する情報',
    icon: '🏠',
    topics: [
      {
        slug: 'rent-house',
        title: '家を借りたい',
        icon: '🔑',
        summary: '民間賃貸アパート・マンションの探し方や、家賃補助制度の有無についての情報です。',
        rank: 'A',
        who_needs_this: '磐田市内で賃貸住宅を探している方。',
        first_action: '地域の不動産ポータル、または運営会社「富士ヶ丘サービス」へお気軽にご相談ください。',
        official_sources: '磐田市内の住宅支援情報|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/index.html'
      },
      {
        slug: 'municipal-housing',
        title: '市営住宅を知りたい',
        icon: '🏢',
        summary: '市営住宅の入居条件、募集時期（通常年4回）、申込書類の書き方を案内します。',
        rank: 'A+',
        who_needs_this: '低所得で住宅に困窮しており、市営住宅への入居を希望している方。',
        first_action: '次回の募集月（5月、8月、11月、2月頃）と入居基準（収入上限等）を確認しましょう。',
        today_tasks: ['入居資格要件に当てはまるか収入基準を確認する'],
        this_week_tasks: ['都市整備課の窓口で申込書類一式を入手する'],
        required_items: ['住民票謄本', '所得証明書', '納税証明書'],
        municipal_window: '都市整備部 建築住宅課',
        official_sources: '市営住宅入居募集（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001570.html'
      },
      {
        slug: 'buy-house',
        title: '家を買いたい',
        icon: '💵',
        summary: '磐田市で一戸建てや分譲マンションを購入する際の、補助金制度や金利優遇措置の情報です。',
        rank: 'A',
        who_needs_this: '磐田市内でマイホームの購入を計画している方。',
        first_action: '若者世帯向けの住宅取得支援補助金（最大数十万円）の要件を確認しましょう。',
        today_tasks: ['「若者・子育て世代マイホーム取得支援補助金」の要件を満たすか確認する'],
        official_sources: 'マイホーム取得支援（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001579.html'
      },
      {
        slug: 'build-house',
        title: '家を建てたい',
        icon: '🏗️',
        summary: '注文住宅新築時の建築確認申請の流れや、ZEH（省エネ住宅）向けの各種補助金です。',
        rank: 'A',
        who_needs_this: '磐田市内で土地を購入し、新築を建てようとしている方。',
        first_action: '木造住宅支援や省エネ住宅向けの市の補助金制度を調べましょう。',
        official_sources: '住まいに関する補助金（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001582.html'
      },
      {
        slug: 'vacant-house',
        title: '空き家がある',
        icon: '🏚️',
        summary: '所有している空き家の適正管理、空き家バンクの登録、有効活用のご相談です。',
        rank: 'A++',
        who_needs_this: '磐田市内に空き家を所有している方、または相続により空き家を管理することになった方。',
        first_action: '空き家の防犯・防災リスクを確認し、空き家バンクへの登録を検討しましょう。',
        today_tasks: ['空き家の現況を確認（草木の繁茂や損壊の有無）', '所有名義人を確認する'],
        this_week_tasks: ['磐田市空き家相談窓口、または「富士ヶ丘サービス」へ管理・処分について相談する'],
        municipal_window: '建築住宅課 空き家対策係',
        official_sources: '空き家対策（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001588.html'
      },
      {
        slug: 'clean-parents-house',
        title: '実家を整理したい',
        icon: '🧹',
        summary: '親が施設に入る、または他界したために実家の整理や片付けを進める手順です。',
        rank: 'A++',
        who_needs_this: '実家の片付け・生前整理・遺品整理を考えている家族。',
        first_action: 'まず家族で方針（売却・賃貸・解体など）を話し合い、「富士ヶ丘サービス」に整理の進め方を相談しましょう。',
        today_tasks: ['貴重品（権利書、印鑑、通帳、契約書）を確保する'],
        this_week_tasks: ['家庭ごみとして処分できるものと、業者依頼するものの選別を行う'],
        municipal_window: 'ごみ対策課（大量ごみの持ち込み相談など）',
        official_sources: 'クリーンセンターへの持ち込み（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/gomi_recycle/1001463.html'
      },
      {
        slug: 'sell-house',
        title: '家を売りたい',
        icon: '🤝',
        summary: '不動産売却手続きの流れ、譲渡所得税、磐田市の地価動向や相談窓口です。',
        rank: 'A',
        who_needs_this: '磐田市内にある戸建てや土地の売却を計画している方。',
        first_action: '不動産査定を依頼し、売却時の税金要件（3000万円特別控除など）を確認しましょう。',
        official_sources: '市有地の売却情報等（磐田市）|https://www.city.iwata.shizuoka.jp/shisei_jouhou/toukei_nyuusatsu/index.html'
      },
      {
        slug: 'earthquake-demolition',
        title: '耐震・解体・ブロック塀',
        icon: '🧱',
        summary: '木造住宅の耐震診断・補強工事補助、老朽化空き家の解体補助、危険ブロック塀撤去補助です。',
        rank: 'A+',
        who_needs_this: '昭和56年5月以前に建てられた古い木造住宅にお住まい、または古い塀をお持ちの方。',
        first_action: '工事契約をする前に、まず無料の「耐震診断」を建築住宅課に申し込みましょう。',
        today_tasks: ['自宅の建築年月（昭和56年5月31日以前か）を確認する'],
        this_week_tasks: ['「TOUKAI-0」木造住宅耐震診断を申し込む'],
        municipal_window: '都市整備部 建築住宅課（耐震改修係）',
        official_sources: '住宅の耐震改修・ブロック塀等除却補助（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001594.html'
      }
    ]
  },
  {
    slug: 'family-grow',
    title: '家族が増える',
    subtitle: '結婚、妊娠、出産、子育て支援、各種手当や乳幼児健診などの手続き',
    icon: '👶',
    topics: [
      {
        slug: 'marriage',
        title: '結婚した',
        icon: '💍',
        summary: '婚姻届の提出、新生活支援補助金、氏名・住所変更に伴う手続き一覧です。',
        rank: 'A+',
        who_needs_this: '磐田市で婚姻届を提出する予定、または結婚に伴い新生活を始めるカップル。',
        first_action: '婚姻届に必要な書類（戸籍謄本など）と身分証を準備し、市民課へ提出しましょう。',
        today_tasks: ['婚姻届に証人2名の署名をもらう', '本籍地以外の提出の場合は戸籍謄本を用意する'],
        this_week_tasks: ['「結婚新生活支援事業補助金」の要件に合致するか調べる'],
        required_items: ['婚姻届書', '本人確認書類', '戸籍謄本（磐田市に本籍がない場合）'],
        municipal_window: '市民課（夜間・休日は宿直窓口）',
        official_sources: '婚姻届（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001394.html'
      },
      {
        slug: 'pregnancy',
        title: '妊娠した',
        icon: '🤰',
        summary: '妊娠届の提出、母子健康手帳の交付、妊婦健康診査受診票の受け取り方です。',
        rank: 'A++',
        who_needs_this: '薬局や医療機関で妊娠が確認され、母子手帳の交付を受ける方。',
        first_action: '医療機関から妊娠届出書を受け取ったら、健康増進課（iプラザ）へ行きましょう。',
        today_tasks: ['妊娠届出書を用意する', '交付窓口（iプラザ）の場所と受付時間を確認する'],
        this_week_tasks: ['母子健康手帳と妊婦健診受診票（助成券）の交付を受ける'],
        required_items: ['妊娠届出書', '個人番号がわかるもの', '本人確認書類'],
        municipal_window: '健康増進課（iプラザ3階）',
        official_sources: '妊娠届と母子健康手帳の交付（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/boshi_kenkou/1001640.html'
      },
      {
        slug: 'childbirth',
        title: '子どもが生まれた',
        icon: '🍼',
        summary: '出生届（14日以内）、児童手当、こども医療費助成、出産育児一時金の申請ステップです。',
        rank: 'A++',
        who_needs_this: 'お子さんが生まれた親、保護者。',
        first_action: '生まれた日を含めて14日以内に出生届を提出しましょう。',
        today_tasks: ['出生届（医師等の出生証明書付）と母子手帳を準備する'],
        this_week_tasks: ['出生届を提出し、そのまま児童手当と子ども医療費助成を申請する'],
        required_items: ['出生届書', '母子健康手帳', '届出人の本人確認書類', '健康保険証', '世帯主の口座番号'],
        municipal_window: '市民課（出生届）／こども未来課（児童手当・こども医療）',
        official_sources: '出生届（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001392.html'
      },
      {
        slug: 'parenting-support',
        title: '子育て支援',
        icon: '🤱',
        summary: '子育て支援センター（ぽっかぽか等）の場所、一時預かり、ファミリーサポート制度です。',
        rank: 'A+',
        who_needs_this: '未就学児を育てる家庭で、遊び場や子育て相談、預かり制度を利用したい方。',
        first_action: '最寄りの子育て支援センターや、地域子育て支援拠点事業の一覧を確認しましょう。',
        official_sources: '子育て支援センター等（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/shien/1001692.html'
      },
      {
        slug: 'infant-health-check',
        title: '乳幼児健診',
        icon: '🩺',
        summary: '4か月児、10か月児、1歳6か月児、3歳児等の乳幼児健康診断の日程・場所の案内です。',
        rank: 'A+',
        who_needs_this: '対象月齢の乳幼児を持つ保護者（個別に対象時期に案内が届きます）。',
        first_action: '案内ハガキ・問診票が届いたら、指定の日程と会場（iプラザ等）を確認しましょう。',
        today_tasks: ['案内問診票の中身を確認し、必要事項を記入する'],
        required_items: ['母子健康手帳', '問診票', '筆記用具', 'バスタオル（必要な場合）'],
        municipal_window: '健康増進課（母子保健グループ）',
        official_sources: '乳幼児の健康診査（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/boshi_kenkou/1001648.html'
      },
      {
        slug: 'child-vaccination',
        title: '予防接種（子）',
        icon: '💉',
        summary: '子どもの定期予防接種（ヒブ、小児肺炎球菌、四種混合、BCG、MRなど）のスケジュールです。',
        rank: 'A+',
        who_needs_this: '乳幼児から学齢期までの子どもの保護者。',
        first_action: '予診票綴りを確認し、指定の協力医療機関へ予約しましょう。',
        required_items: ['母子健康手帳', '予診票（事前に記入）', '保険証'],
        municipal_window: '健康増進課',
        official_sources: '子どもの予防接種（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/boshi_kenkou/1001651.html'
      },
      {
        slug: 'nursery-school',
        title: '保育園・幼稚園',
        icon: '🏫',
        summary: '認可保育所、認定こども園、幼稚園の入園要件、募集スケジュール（秋頃）、保育料です。',
        rank: 'A++',
        who_needs_this: '保育施設・幼児教育施設への入所を検討している保護者。',
        first_action: '一斉募集開始の前に、希望する園の見学を行っておきましょう。',
        today_tasks: ['希望する保育施設のリストを作り、見学予約を電話でする'],
        this_week_tasks: ['入所基準（就労状況等による点数算出）の仕組みを確認する'],
        municipal_window: 'こども未来課 保育・幼稚園グループ',
        official_sources: '保育園・幼稚園などの入園（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/hoiku_youchien/1001671.html'
      },
      {
        slug: 'child-allowance',
        title: '児童手当・助成',
        icon: '💵',
        summary: '児童手当の支給額、所得制限、こども医療費助成制度、ひとり親家庭等への助成金です。',
        rank: 'A+',
        who_needs_this: '高校生以下の子どもを養育している世帯。',
        first_action: '出生や転入の翌日から15日以内に申請書を提出しましょう。',
        today_tasks: ['振込先の口座情報（請求者本人名義）を準備する'],
        this_week_tasks: ['こども未来課で申請し、「こども医療費受給者証」の交付も同時に受ける'],
        required_items: ['振込口座がわかる通帳やカード', '年金加入証明（または健康保険証）', 'マイナンバー'],
        municipal_window: 'こども未来課',
        official_sources: '児童手当（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/teate_josei/1001683.html'
      }
    ]
  },
  {
    slug: 'play-out',
    title: '遊ぶ・使う・出かける',
    subtitle: '公園、図書館、スポーツ施設や文化施設、駐車場などの公共施設の利用案内',
    icon: '🌳',
    topics: [
      {
        slug: 'find-parks',
        title: '公園を探したい',
        icon: '🌳',
        summary: '竜洋海洋公園、かぶと塚公園、豊田香りの公園など、市内の主要な公園の案内です。',
        rank: 'A',
        who_needs_this: '広場や大型遊具がある市内の公園を探している家族や市民。',
        first_action: '市公式サイトの「公園一覧」から、目的に合った公園を検索してください。',
        official_sources: '磐田市内の公園紹介|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001597.html'
      },
      {
        slug: 'kids-playgrounds',
        title: '子どもを遊ばせたい',
        icon: '🛝',
        summary: '室内の遊び場（こども広場「にこっと」等）や、天候に関わらず遊べる場所の紹介です。',
        rank: 'A+',
        who_needs_this: '雨の日や暑い日に、乳幼児〜小学生の子どもを屋内で安全に遊ばせたい保護者。',
        first_action: 'こども広場「にこっと」などの利用方法や対象年齢を確認しましょう。',
        official_sources: 'こども広場「にこっと」（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/shien/1001704.html'
      },
      {
        slug: 'visit-library',
        title: '図書館へ行きたい',
        icon: '📚',
        summary: '磐田市立図書館の開館時間、利用カードの作り方です。',
        rank: 'A+',
        who_needs_this: '本を借りたい、学習スペースを利用したい市民。',
        first_action: '身分証明書を持って図書館に行きましょう。',
        today_tasks: ['最寄りの図書館の休館日を確認する'],
        required_items: ['本人確認書類（免許証、保険証など）'],
        municipal_window: '立中央図書館（または各分館）',
        official_sources: '磐田市立図書館の利用案内|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/tosho/index.html'
      },
      {
        slug: 'sports-facilities',
        title: '体育館・スポーツ施設',
        icon: '💪',
        summary: 'かぶと塚体育館、陸上競技場などの利用料金や個人・団体利用の方法です。',
        rank: 'B',
        who_needs_this: 'スポーツやフィットネス目的で市営の体育施設・運動場を利用したい方。',
        first_action: '施設管理システムで施設の空き状況を確認するか、指定管理者に問い合わせましょう。',
        official_sources: 'スポーツ施設利用（磐田市）|https://www.city.iwata.shizuoka.jp/sports_midokoro/sports/index.html'
      },
      {
        slug: 'swimming-pools',
        title: 'プール',
        icon: '🏊',
        summary: '温水プール（磐田市民温水プール、竜洋温水プール）の案内です。',
        rank: 'B',
        who_needs_this: '温水プールを利用したい市民、家族。',
        first_action: 'プール営業日（月曜定休が多い）と料金、水泳帽子等の持ち物ルールを確認しましょう。',
        official_sources: '温水プール案内（磐田市）|https://www.city.iwata.shizuoka.jp/sports_midokoro/sports/1005953.html'
      },
      {
        slug: 'cultural-facilities',
        title: '文化施設',
        icon: '🎭',
        summary: '豊田市民文化会館、香りの博物館などのイベント・施設案内です。',
        rank: 'B',
        who_needs_this: '美術鑑賞、コンサート、各種文化イベントに参加したい方。',
        first_action: '各施設の公式カレンダーや貸館スケジュールを閲覧しましょう。',
        official_sources: '文化・芸術（磐田市）|https://www.city.iwata.shizuoka.jp/sports_midokoro/bunka_geijutsu/index.html'
      },
      {
        slug: 'rent-public-facilities',
        title: '公共施設を借りたい',
        icon: '🔑',
        summary: '交流センター（公民館）、貸会議室の予約手順です。',
        rank: 'B',
        who_needs_this: 'サークル活動や会議のために市内の公共スペースを予約したい方。',
        first_action: '「磐田市公共施設予約システム」への登録・ログイン方法を確認しましょう。',
        required_items: ['団体登録申請（必要な場合）'],
        municipal_window: '各地区交流センター、または建築住宅課',
        official_sources: '公共施設予約システム（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001577.html'
      },
      {
        slug: 'parking-access',
        title: '駐車場・アクセス',
        icon: '🅿️',
        summary: '磐田駅周辺の市営駐車場、市役所駐車場の利用ルールです。',
        rank: 'B',
        who_needs_this: '市役所や駅周辺へ車で訪れる際の駐車場所や料金が気になる方。',
        first_action: '市役所本庁舎駐車場は、手続きに要した時間内は無料で利用できます。',
        official_sources: '駐車場案内|https://www.city.iwata.shizuoka.jp/shisei_jouhou/shoukai/1001880.html'
      }
    ]
  },
  {
    slug: 'education',
    title: '学ぶ・育つ',
    subtitle: '公立小中学校、給食、就学援助や相談、放課後児童クラブなどの教育関連情報',
    icon: '🎒',
    topics: [
      {
        slug: 'elementary-middle-school',
        title: '小学校・中学校',
        icon: '🎒',
        summary: '磐田市立小中学校への転入学手続き、年間カレンダー、教育課程の概要です。',
        rank: 'A+',
        who_needs_this: '転入・転出に伴う小中学校の転校手続きを行う保護者。',
        first_action: '在学証明書を取得し、市民課での転入手続きの後に学校教育課へ行きましょう。',
        today_tasks: ['転出元の学校から「在学証明書」「教科書給与証明書」を受け取る'],
        this_week_tasks: ['磐田市役所市民課で住所変更し、発行される「転入学通知書」を受け取る', '新しい学校に連絡の上、書類を持参する'],
        required_items: ['在学証明書', '教科書給与証明書', '転入学通知書'],
        municipal_window: '教育委員会 学校教育課',
        official_sources: '小中学校の転入・転出・転校（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/kyouiku/1001607.html'
      },
      {
        slug: 'school-zones',
        title: '通学区域',
        icon: '🗺️',
        summary: '住所から指定される通学区域（学区）および、特別な事情による指定校変更制度です。',
        rank: 'A+',
        who_needs_this: '引っ越し先での学区を知りたい、または学区外通学を希望する方。',
        first_action: '指定校変更には一定の基準があるため、まずは学校教育課へ相談してください。',
        municipal_window: '教育委員会 学校教育課',
        official_sources: '就学指定校の変更（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/kyouiku/1001609.html'
      },
      {
        slug: 'school-meals',
        title: '給食',
        icon: '🍱',
        summary: '学校給食費の額、支払方法（口座振替）、アレルギー対応に関する手続きです。',
        rank: 'A',
        who_needs_this: '小中学校での給食開始や、食物アレルギーによる配慮を希望する保護者。',
        first_action: 'アレルギー対応を希望する場合は、医師の診断書をもとに学校長へ相談を行いましょう。',
        required_items: ['学校給食食物アレルギー対応申請書', '医師の指示書'],
        municipal_window: '各学校、または学校給食課',
        official_sources: '学校給食（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/kyouiku/1001614.html'
      },
      {
        slug: 'school-attendance-support',
        title: '就学援助',
        icon: '💵',
        summary: '経済的理由により小中学校の学用品費や給食費の支払いが困難な家庭への援助制度です。',
        rank: 'A+',
        who_needs_this: '経済的に支援が必要な小中学生の家庭。',
        first_action: '申請書を学校へ提出しましょう。',
        required_items: ['就学援助費受給申請書', '前年の所得がわかる書類', '振込口座番号'],
        municipal_window: '各小中学校、または学校教育課',
        official_sources: '就学援助制度（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/kyouiku/1001612.html'
      },
      {
        slug: 'educational-consulting',
        title: '教育相談',
        icon: '🤝',
        summary: '不登校、発達への懸念、いじめなど、子どもや学校生活に関する相談窓口です。',
        rank: 'A',
        who_needs_this: '子どもの発達、不登校、友人関係などの悩みを抱える保護者または子ども本人。',
        first_action: '教育相談センターへ電話相談を行いましょう。',
        municipal_window: '教育委員会 教育相談センター',
        official_sources: '教育相談のご案内（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/kyouiku/1001625.html'
      },
      {
        slug: 'after-school-club',
        title: '放課後児童クラブ',
        icon: '🏢',
        summary: '放課後や夏休みに、就労のため保護者が家庭にいない小学生を預かる児童クラブの申請方法です。',
        rank: 'A++',
        who_needs_this: '就労中の保護者で、放課後にお子さんを預けたい方。',
        first_action: '一斉申込期間（通常11月頃）に必要書類を提出しましょう。',
        today_tasks: ['勤務先で「就労証明書」を作成してもらうよう依頼する'],
        this_week_tasks: ['こども未来課で申込要領と申請書を入手する'],
        required_items: ['放課後児童クラブ入会申請書', '就労証明書（保護者全員分）'],
        municipal_window: 'こども未来課 育成グループ',
        official_sources: '放課後児童クラブ（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/hoiku_youchien/1001676.html'
      },
      {
        slug: 'study-facilities',
        title: '図書館・学習施設',
        icon: '📝',
        summary: '学生や市民が自主学習で利用できる自習スペースの案内です。',
        rank: 'B',
        who_needs_this: '勉強や読書ができる、集中できるスペースを探している市民。',
        first_action: '各図書館の学習室の利用ルールを確認しましょう。',
        official_sources: '図書館の学習室利用|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/tosho/index.html'
      }
    ]
  },
  {
    slug: 'health-medical',
    title: '健康・医療',
    subtitle: '救急医療、健康診断、がん検診や予防接種、障害福祉に関する窓口と手続き',
    icon: '❤️',
    topics: [
      {
        slug: 'find-hospitals',
        title: '病院を探したい',
        icon: '🏥',
        summary: '磐田市立総合病院や市内の診療所の案内です。',
        rank: 'A',
        who_needs_this: '近隣の病院を探したい方。',
        first_action: '「静岡県救急医療情報システム」または磐田市医師会HPで検索しましょう。',
        official_sources: '救急医療・磐田市立総合病院|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/iryou_kenkou/index.html'
      },
      {
        slug: 'night-holiday-medical',
        title: '夜間・休日医療',
        icon: '🚨',
        summary: '夜間や土日祝日に急病になった場合の、夜間救急診療所や休日当番医の案内です。',
        rank: 'A++',
        who_needs_this: '夜間や休日に子どもや家族が急に熱を出したり、体調を崩したりした場合。',
        first_action: 'まず「磐田市夜間救急診療所」に電話をしてから受診しましょう。',
        today_tasks: ['夜間救急診療所の電話番号（0538-36-7099）を確認する', '受診の前に健康保険証、お薬手帳を用意する'],
        required_items: ['健康保険証', '子ども医療受給者証', 'お薬手帳', '現金'],
        municipal_window: '夜間救急診療所（磐田市国府台57-27）',
        official_sources: '夜間・休日の救急医療（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/iryou_kenkou/1001716.html'
      },
      {
        slug: 'adult-vaccination',
        title: '予防接種（大人）',
        icon: '💉',
        summary: '大人の定期予防接種と各種助成金制度です。',
        rank: 'A',
        who_needs_this: '対象年齢で、インフルエンザや肺炎球菌のワクチン接種を受けたい方。',
        first_action: '接種券・予診票を確認し、市内の指定医療機関に直接予約してください。',
        required_items: ['接種券・予診票', '健康保険証'],
        municipal_window: '健康増進課',
        official_sources: '大人の予防接種（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/iryou_kenkou/1001726.html'
      },
      {
        slug: 'health-checkups',
        title: '健康診断',
        icon: '🩺',
        summary: '特定健診、がん検診（胃・大腸・乳・子宮がん等）の受診券、料金です。',
        rank: 'A',
        who_needs_this: '特定健診やがん検診を受けたい方。',
        first_action: '例年5月頃に送付される「健康診査受診券（ハガキ）」を確認しましょう。',
        required_items: ['健康診査受診券', '健康保険証'],
        municipal_window: '健康増進課',
        official_sources: '各種健康診査・がん検診（磐ata市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/iryou_kenkou/1001736.html'
      },
      {
        slug: 'health-promotion',
        title: '健康づくり',
        icon: '🏃',
        summary: '健康相談や食生活指導など、健康増進プログラムです。',
        rank: 'B',
        who_needs_this: '生活習慣の改善指導を受けたい方。',
        first_action: '健康増進課が実施している相談会を予約しましょう。',
        municipal_window: '健康増進課',
        official_sources: '健康づくり相談（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/iryou_kenkou/1001732.html'
      },
      {
        slug: 'dental-care',
        title: '歯科・口腔ケア',
        icon: '🪥',
        summary: '節目歯科健診（成人）、妊婦歯科健診の案内です。',
        rank: 'B',
        who_needs_this: '成人歯科健診の対象者（指定年齢）や、妊婦の方。',
        first_action: '成人歯科健診受診券を利用し、指定歯科医院を予約してください。',
        official_sources: '成人歯科健康診査（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/iryou_kenkou/1001739.html'
      },
      {
        slug: 'mental-health-consulting',
        title: 'こころの相談',
        icon: '🧠',
        summary: '精神的悩みに関する相談窓口です。',
        rank: 'A',
        who_needs_this: '自身のこころの不調を感じている方、または家族の精神状態が心配な方。',
        first_action: '精神保健相談（予約制）や、電話相談窓口へまず連絡をしましょう。',
        municipal_window: '福祉課（または健康増進課）',
        official_sources: 'こころの健康相談（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/fukushi/1001764.html'
      },
      {
        slug: 'disability-welfare',
        title: '障害福祉',
        icon: '♿',
        summary: '障害者手帳の交付や手当、各種割引制度です。',
        rank: 'A+',
        who_needs_this: '障害者手帳を新しく申請したい方、または助成を受けたい方。',
        first_action: '手帳の申請には指定医師の「診断書・意見書」が必要となるため、まずは福祉課で相談しましょう。',
        today_tasks: ['福祉課に連絡し、対象の手続き用診断書用紙を確認する'],
        required_items: ['医師の診断書', '顔写真', 'マイナンバー'],
        municipal_window: '健康福祉部 福祉課 障害福祉グループ',
        official_sources: '障害者手帳（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/fukushi/1001755.html'
      }
    ]
  },
  {
    slug: 'work-life',
    title: '働く・暮らす',
    subtitle: '仕事探し、起業や農業支援、税金・保険料・年金や各種補助金の情報',
    icon: '💼',
    topics: [
      {
        slug: 'job-change',
        title: '就職・転職',
        icon: '👔',
        summary: 'ハローワーク磐田の案内、就労サポート、就職相談窓口です。',
        rank: 'A',
        who_needs_this: '磐田市内で仕事を探している方。',
        first_action: 'ハローワーク磐田（国府台）またはしごとプラザを訪れて相談登録をしましょう。',
        official_sources: '就労支援・ハローワーク|https://www.city.iwata.shizuoka.jp/sangyou_business/koyou_roudou/index.html'
      },
      {
        slug: 'start-business',
        title: '起業・創業',
        icon: '🚀',
        summary: '新規開業融資制度、店舗改装などの各種補助金および相談窓口です。',
        rank: 'B',
        who_needs_this: '磐田市内で新しく店舗や事業を開業しようと考えている方。',
        first_action: '産業政策課または磐田商工会議所の「創業相談窓口」を予約しましょう。',
        municipal_window: '産業部 産業政策課',
        official_sources: '起業・創業支援（磐田市）|https://www.city.iwata.shizuoka.jp/sangyou_business/sougyou_shien/1001844.html'
      },
      {
        slug: 'start-farming',
        title: '農業を始めたい',
        icon: '🚜',
        summary: '磐田市の就農支援制度、農地取得ルール、新規就農研修プログラムです。',
        rank: 'B',
        who_needs_this: '磐田で農業を始めたい方、または農地を手配したい方。',
        first_action: '農林水産課または農業委員会事務局へ相談しましょう。',
        municipal_window: '農林水産課／農業委員会事務局',
        official_sources: '新規就農支援・農地（磐田市）|https://www.city.iwata.shizuoka.jp/sangyou_business/nourinsuisan/1001859.html'
      },
      {
        slug: 'tax',
        title: '税金',
        icon: '💵',
        summary: '市民税、固定資産税、軽自動車税の決定や支払い方法です。',
        rank: 'A+',
        who_needs_this: '納税義務のある市民。',
        first_action: '市税の支払いはスマホ決済（PayPayなど）やクレジットカード払いも利用可能です。',
        required_items: ['納税通知書（納付書）'],
        municipal_window: '課税課（税の計算）／収納課（税の納付）',
        official_sources: '市税について・納税（磐田市）|https://www.city.iwata.shizuoka.jp/shisei_jouhou/shizei/index.html'
      },
      {
        slug: 'nhk-pension',
        title: '国民健康保険・年金',
        icon: '🩺',
        summary: '国保への加入・脱退、保険料の算定、年金の加入や減免申請です。',
        rank: 'A+',
        who_needs_this: '退職により職場の健康保険を抜けた方、または年金切り替えを行う方。',
        first_action: '退職日の翌日から14日以内に、国保加入の手続きをしましょう。',
        today_tasks: ['前職場が発行した「社会保険資格喪失証明書」を用意する'],
        this_week_tasks: ['国保年金課で国保加入の手続きを行う'],
        required_items: ['社会保険資格喪失証明書', '本人確認書類', 'マイナンバー'],
        municipal_window: '市民部 国保年金課',
        official_sources: '国民健康保険の手続き（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/kokuho_nenkin/1001476.html'
      },
      {
        slug: 'subsidies',
        title: '補助金',
        icon: '💰',
        summary: '住宅改修、生ごみ処理機購入など、市が実施する補助金一覧です。',
        rank: 'A',
        who_needs_this: '補助金の対象物品の購入や工事を予定している市民。',
        first_action: '必ず購入や工事の前に申請してください（事後申請は原則対象外です）。',
        official_sources: '補助金・助成制度（磐田市）|https://www.city.iwata.shizuoka.jp/shisei_jouhou/shoukai/1001880.html'
      },
      {
        slug: 'job-recruitment',
        title: '職員採用',
        icon: '🏢',
        summary: '磐田市役所職員、保育士、消防職などの採用試験日程です。',
        rank: 'B',
        who_needs_this: '磐田市役所職員の採用試験を受験したい方。',
        first_action: '「職員採用試験案内」が例年5月〜6月頃に公開されるため、要件を確認しましょう。',
        municipal_window: '総務部 職員課',
        official_sources: '職員採用情報（磐田市）|https://www.city.iwata.shizuoka.jp/shisei_jouhou/shokuin_saiyou/index.html'
      }
    ]
  },
  {
    slug: 'parents-care',
    title: '親のこと',
    subtitle: '親の介護が心配になったとき、地域包括支援センターへの相談や施設探し',
    icon: '🧓',
    topics: [
      {
        slug: 'check-parents',
        title: '親の様子が気になる',
        icon: '🏠',
        summary: '実家の親が最近忘れっぽくなった、体力が落ちて心配になったときの初期ステップです。',
        rank: 'A++',
        who_needs_this: '高齢の親の安全や生活習慣が不安な子ども世帯。',
        first_action: 'まず最寄りの地域包括支援センターに電話をして、相談しましょう。',
        today_tasks: ['親の居住地を担当する地域包括支援センターの連絡先を調べる'],
        this_week_tasks: ['実家を訪ね、本人の日常動作や物忘れの状況をメモする'],
        municipal_window: '高寿支援課（または「富士ヶ丘サービス」へお気軽にご相談ください）',
        official_sources: '高齢者に関する相談窓口（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/kaigohoken/1001815.html'
      },
      {
        slug: 'care-started',
        title: '介護が始まった',
        icon: '🧓',
        summary: '要介護認定の申請方法、認定調査の流れ、ケアプラン作成です。',
        rank: 'A++',
        who_needs_this: '親の日常生活に介護保険を使ったサービスを利用したい家族。',
        first_action: '高寿支援課（または各支所）に「要介護認定申請書」を提出しましょう。',
        today_tasks: ['介護保険被保険者証とマイナンバーを用意する'],
        this_week_tasks: ['申請書を提出し、訪問調査の日程調整を行う'],
        required_items: ['介護保険被保険者証', '要介護認定申請書'],
        municipal_window: '福祉部 高寿支援課（または各支所）',
        official_sources: '要介護認定の手続き（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/kaigohoken/1001802.html'
      },
      {
        slug: 'find-nursing-home',
        title: '介護施設を探したい',
        icon: '🏢',
        summary: '特別養護老人ホーム、グループホーム、デイサービスなどの選び方です。',
        rank: 'A++',
        who_needs_this: '在宅での介護が難しくなり、介護施設入居を検討している家族。',
        first_action: 'まずはケアマネジャーまたは包括支援センターに相談し、「富士ヶ丘サービス」の紹介を受けましょう。',
        today_tasks: ['希望するエリアや予算、医療面の条件を整理する'],
        official_sources: '介護サービス事業所一覧（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/kaigohoken/1001807.html'
      },
      {
        slug: 'community-support-center',
        title: '地域包括支援センター',
        icon: '☎️',
        summary: '市内9地区に設置された地域包括支援センターの管轄と電話番号です。',
        rank: 'A+',
        who_needs_this: '高齢者の総合相談、介護予防の相談窓口を探している方。',
        first_action: 'お住まいの小学校区に対応するセンター（向陽、福田、竜洋など）を確認しましょう。',
        today_tasks: ['担当のセンターの電話番号を登録する'],
        municipal_window: '高寿支援課（または直接包括へ）',
        official_sources: '地域包括支援センター一覧（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/kaigohoken/1001815.html'
      },
      {
        slug: 'dementia-consultation',
        title: '認知症相談',
        icon: '🤝',
        summary: '認知症初期集中支援チーム、もの忘れ外来、認知症カフェ等の紹介です。',
        rank: 'A+',
        who_needs_this: '物忘れがひどくなった高齢の親がいる方、または認知症家族を支える方。',
        first_action: '「認知症初期集中支援チーム」による無料の自宅訪問相談を申し込みましょう。',
        municipal_window: '高寿支援課 高齢者支援グループ',
        official_sources: '認知症に関する支援（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/kaigohoken/1001814.html'
      },
      {
        slug: 'elderly-transportation',
        title: '高齢者の移動支援',
        icon: '🚙',
        summary: '高齢者向けの福祉タクシー料金助成、自主返納支援情報です。',
        rank: 'A',
        who_needs_this: '移動手段がなくて困っている高齢者。',
        first_action: '免許自主返納者へのタクシー券やバス割引の要件を確認しましょう。',
        official_sources: '運転免許証自主返納支援（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/koutsuu_bouhan/1001556.html'
      },
      {
        slug: 'long-term-care-insurance',
        title: '介護保険料',
        icon: '💵',
        summary: '65歳以上の方が支払う介護保険料の段階区分と納付方法です。',
        rank: 'A',
        who_needs_this: '65歳に到達した方、または介護保険料通知が届いた方。',
        first_action: '介護保険料は年金天引きが原則ですが、加入初期は納付書での支払いが必要です。',
        municipal_window: '高寿支援課 介護保険運営グループ',
        official_sources: '介護保険料について（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/kaigohoken/1001816.html'
      }
    ]
  },
  {
    slug: 'emergency',
    title: 'もしもの時',
    subtitle: '台風、大雨、地震発生時などの災害避難情報や夜間・休日救急の案内',
    icon: '🚨',
    topics: [
      {
        slug: 'storm-heavy-rain',
        title: '台風・大雨',
        icon: '⛈️',
        summary: '接近時の土砂災害警戒、河川水位情報、避難情報の見方です。',
        rank: 'A+',
        who_needs_this: '台風や豪雨により、土砂崩れや河川氾濫の危険性が高まっている住民。',
        first_action: '「警戒レベル4 避難指示」が出たら、危険な場所から必ず避難してください。',
        today_tasks: ['磐田市の公式防災情報、または河川の水位・雨量情報を開いて確認する'],
        municipal_window: '危機管理課（災害警戒本部）',
        official_sources: '避難指示と警戒レベル（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/bousai/1001229.html'
      },
      {
        slug: 'earthquake',
        title: '地震',
        icon: '🫨',
        summary: '地震発生時の対応、事前の家具固定、備蓄のルールです。',
        rank: 'A+',
        who_needs_this: '地震発生直後、または今後の巨大地震への備えをしたい市民。',
        first_action: '地震が起きたら、まずテーブルの下に入るなどして「頭を守り」身の安全を確保してください。',
        today_tasks: ['非常用持ち出し袋の中身（水、懐中電灯、簡易トイレ、常備薬）を確認する'],
        official_sources: '地震への備え（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/bousai/1001221.html'
      },
      {
        slug: 'evacuation-centers',
        title: '避難所',
        icon: '🏫',
        summary: '緊急指定避難所（小中学校など）のマップと、開設状況の確認方法です。',
        rank: 'A+',
        who_needs_this: '避難指示が出ており、自宅から退避して避難所を探している方。',
        first_action: 'ハザードマップや市の緊急HPで、どの避難所が現在「開設」されているか確認しましょう。',
        required_items: ['非常食', '飲料水', '常備薬', 'マスク'],
        municipal_window: '防災対策課（または現地避難所）',
        official_sources: '指定避難所・福祉避難所（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/bousai/1001225.html'
      },
      {
        slug: 'hazard-maps',
        title: 'ハザードマップ',
        icon: '🗺️',
        summary: '洪水、土砂災害、津波などのマップダウンロードです。',
        rank: 'A+',
        who_needs_this: '自宅周辺の水害や土砂崩れの危険度を調べたい方。',
        first_action: '「磐田市ハザードマップ」で自宅周辺の浸水想定などを確認してください。',
        official_sources: 'ハザードマップ一覧（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/bousai/1001222.html'
      },
      {
        slug: 'emergency-medical',
        title: '夜間・休日医療',
        icon: '🚑',
        summary: '夜間急病時の診療体制（夜間救急診療所、当番医、こども救急電話「#8000」）です。',
        rank: 'A++',
        who_needs_this: '急な体調不良や怪我により、応急診療を受けたい市民。',
        first_action: '重症（呼吸困難、意識不明等）の場合は、ためらわずに「119」番で救急車を呼んでください。',
        today_tasks: ['夜間救急診療所（0538-36-7099）へ事前に電話して症状を伝える'],
        required_items: ['健康保険証', '福祉医療受給者証', '現金'],
        official_sources: '救急医療体制（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/iryou_kenkou/1001716.html'
      },
      {
        slug: 'fire-ambulance',
        title: '火災・救急',
        icon: '🚒',
        summary: '火災発生時の119番通報、AED設置場所、救急車を呼ぶ目安です。',
        rank: 'A',
        who_needs_this: '火事を目撃した方、または救急車が必要な方。',
        first_action: '119番にダイヤルし、「火事」か「救急」かをはっきりと伝えて住所を案内してください。',
        official_sources: '消防・救急・119番（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/shoubou_kyuukyuu/index.html'
      },
      {
        slug: 'pet-disaster-prevention',
        title: 'ペット防災',
        icon: '🐱',
        summary: '避難所におけるペットとの同行避難のルールです。',
        rank: 'A',
        who_needs_this: '犬、猫などのペットを飼っている方。',
        first_action: '避難所での同行避難は原則ケージ飼育となるため、ケージやフードを準備しておきましょう。',
        official_sources: '災害時のペット対策（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/bousai/1001247.html'
      },
      {
        slug: 'disaster-mail-line',
        title: '防災メール・LINE',
        icon: '📱',
        summary: '同報無線メールサービス、公式LINEでの緊急防災情報の登録方法です。',
        rank: 'A',
        who_needs_this: '気象警報、避難指示などの情報をいち早く受信したい市民。',
        first_action: '「磐田市同報無線メール」の登録、または「公式LINE」の友だち追加を行いましょう。',
        today_tasks: ['磐田市公式LINEアカウントを友だち追加する'],
        official_sources: '同報無線メール配信（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/bousai/1001235.html'
      },
      {
        slug: 'road-river-info',
        title: '道路・河川情報',
        icon: '🛣️',
        summary: '道路の通行止め状況、河川監視カメラの水位状況です。',
        rank: 'A',
        who_needs_this: '道路冠水や主要河川の水位状況を確認したい方。',
        first_action: '「しずおか河川ナビゲーション」や、市の監視カメラ配信ページにアクセスしましょう。',
        official_sources: '川の監視カメラ情報（磐田市）|https://www.city.iwata.shizuoka.jp/bousai_anzen/bousai/1001228.html'
      }
    ]
  },
  {
    slug: 'troubles-consult',
    title: '困った・相談したい',
    subtitle: '生活費の困窮、税金の未納、子ども・介護・障害や外国人向けの専門相談窓口',
    icon: '🧩',
    topics: [
      {
        slug: 'living-costs-trouble',
        title: '生活費に困っている',
        icon: '💵',
        summary: '失業などで生活が苦しい方の「自立相談支援窓口」や、福祉資金貸付の手続きです。',
        rank: 'A+',
        who_needs_this: '毎日の生活費に深刻に窮している方。',
        first_action: 'まず「くらしと仕事の相談支援室」に電話または直接行って相談しましょう。',
        today_tasks: ['相談支援室の連絡先を調べる'],
        this_week_tasks: ['福祉課で生活保護制度や福祉一時金の貸付を相談する'],
        municipal_window: '福祉部 福祉課（くらしと仕事の相談支援室）',
        official_sources: '生活にお困りの方の相談（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/fukushi/1001768.html'
      },
      {
        slug: 'cannot-pay-tax',
        title: '税金・保険料が払えない',
        icon: '💸',
        summary: '市民税や国保税、介護保険料を滞納・未納の場合の分割納付や免除相談です。',
        rank: 'A+',
        who_needs_this: '期限内に支払うのが困難な市民。',
        first_action: '放置すると延滞金や差押えになるため、速やかに「収納課」へ納税相談をしてください。',
        today_tasks: ['手元の納付書と家計状況がわかる書類を用意する'],
        this_week_tasks: ['収納課の窓口で分割納付の相談を行う'],
        municipal_window: '財務部 収納課（納税相談グループ）',
        official_sources: '納税相談（磐田市）|https://www.city.iwata.shizuoka.jp/shisei_jouhou/shizei/1001893.html'
      },
      {
        slug: 'child-consultation',
        title: '子どもの相談',
        icon: '👶',
        summary: '子育てのイライラ、不登校や発達障害などの専門相談です。',
        rank: 'A+',
        who_needs_this: '育児ストレスが限界に近い方、不登校などの懸念をお持ちの保護者。',
        first_action: '「こども家庭相談グループ」に連絡をして、保健師などに相談しましょう。',
        municipal_window: 'こども家庭部 こども未来課 こども家庭相談グループ',
        official_sources: '子どもと家庭の相談窓口（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/shien/1001700.html'
      },
      {
        slug: 'care-consultation',
        title: '介護の相談',
        icon: '🧓',
        summary: '介護疲れ、介護保険サービスの利用上のトラブル等の相談先です。',
        rank: 'A++',
        who_needs_this: '介護が負担になり、こころや体が限界を感じている家族。',
        first_action: 'まず担当ケアマネジャー、または最寄りの包括支援センターへ状況を相談しましょう。',
        municipal_window: '高寿支援課（またはお近くの地域包括支援センター）',
        official_sources: '介護の相談・地域包括支援センター（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/kaigohoken/1001815.html'
      },
      {
        slug: 'disability-consultation',
        title: '障害の相談',
        icon: '♿',
        summary: '障害を持つ方の就労、日常生活の支援窓口です。',
        rank: 'A+',
        who_needs_this: '障害者本人、または障害児を育てる家族。',
        first_action: '障害者基幹相談支援センター、または福祉課で相談しましょう。',
        municipal_window: '福祉課 障害福祉グループ',
        official_sources: '障害福祉の相談窓口（磐田市）|https://www.city.iwata.shizuoka.jp/kenkou_fukushi/fukushi/1001755.html'
      },
      {
        slug: 'vacant-house-consultation',
        title: '空き家の相談',
        icon: '🏚️',
        summary: '空き家があるが管理・処分・相続手続きをどうすればよいかのアドバイス窓口です。',
        rank: 'A++',
        who_needs_this: '空き家化した実家をお持ちで、管理や処分について相談したい家族。',
        first_action: 'まず磐田市の建築住宅課（空き家対策係）や、必要に応じて専門家へ相談しましょう。',
        municipal_window: '建築住宅課 空き家対策係',
        official_sources: '空き家相談会等（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001588.html'
      },
      {
        slug: 'animal-pet-consultation',
        title: '動物・ペットの相談',
        icon: '🐶',
        summary: '野良猫の去勢手術助成、迷い犬・猫の情報です。',
        rank: 'A',
        who_needs_this: '迷子になったペットを探している方、または近隣トラブルにお悩みの方。',
        first_action: '環境課へ連絡し、犬の登録番号や特徴を伝えて相談しましょう。',
        municipal_window: '環境課 環境衛生グループ',
        official_sources: 'ペットの飼育・迷い犬（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/kankyou/1001511.html'
      },
      {
        slug: 'foreign-resident-consultation',
        title: '外国人相談',
        icon: '🗣️',
        summary: '多言語による日常生活、行政手続きの相談窓口です。',
        rank: 'A+',
        who_needs_this: '多言語でのサポートを希望する外国人住民。',
        first_action: '市民相談センターの多言語相談窓口の通訳曜日を確認して訪問してください。',
        municipal_window: '市民活動課（外国人相談）',
        official_sources: '外国人向け相談窓口（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/shimin_soudan/1001563.html'
      }
    ]
  },
  {
    slug: 'end-of-life',
    title: '人生の終わり',
    subtitle: 'ご家族が亡くなられたとき、相続登記や未支給年金、おくやみ手続きの案内',
    icon: '🌸',
    topics: [
      {
        slug: 'bereavement',
        title: '家族が亡くなった',
        icon: '🌸',
        summary: 'ご家族が他界した際に行うべき役所手続きの優先度と、全体の流れです。',
        rank: 'A++',
        who_needs_this: '遺族代表者。',
        first_action: '亡くなってから7日以内に「死亡届」を市民課へ提出しましょう（通常は葬儀社が代行）。',
        today_tasks: ['死亡診断書を確認する', '葬儀社と死亡届の提出代行について確認する'],
        this_week_tasks: ['火葬許可証を受け取り、葬儀を行う', '「おくやみ窓口」の予約を入れる'],
        required_items: ['死亡診断書', '届出人の印鑑'],
        municipal_window: '市民課（おくやみ窓口）',
        official_sources: '家族が亡くなった時の手続き（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001392.html'
      },
      {
        slug: 'inheritance',
        title: '相続',
        icon: '📄',
        summary: '預貯金の名義変更、不動産の相続登記義務化への対応情報です。',
        rank: 'A++',
        who_needs_this: '亡くなった親の預貯金や土地・家を相続する親族。',
        first_action: '不動産の相続登記は義務化されています。法務局（磐田支局）や、最寄りの司法書士などの専門家へ相談しましょう。',
        today_tasks: ['亡くなった方の出生から死亡までのすべての戸籍謄本を収集する'],
        outside_agencies: '静岡地方法務局 磐田支局',
        official_sources: '相続登記の義務化について（法務省）|https://www.lfb.mof.go.jp/tokai/shizuoka/index.html',
        consult_type: 'real_estate'
      },
      {
        slug: 'pension-inheritance',
        title: '年金（相続）',
        icon: '💵',
        summary: '受給者の死亡に伴う年金停止、遺族年金・未支給年金の請求です。',
        rank: 'A++',
        who_needs_this: '亡くなった方が国民年金、または厚生年金の受給者であった場合。',
        first_action: '国民年金は14日以内、厚生年金は10日以内に年金停止の届け出をしましょう。',
        today_tasks: ['亡くなった方の年金手帳を探す'],
        this_week_tasks: ['国民年金の場合は市役所国保年金課、厚生年金の場合は年金事務所へ手続きに行く'],
        required_items: ['年金手帳', '戸籍謄本', '死亡を確認できる書類'],
        municipal_window: '国保年金課（国民年金）／磐田年金事務所（厚生年金）',
        official_sources: '遺族年金・未支給年金（日本年金機構）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/kokuho_nenkin/index.html'
      },
      {
        slug: 'inherited-house',
        title: '親の家をどうするか',
        icon: '🏚️',
        summary: '相続した実家の活用、売却、適正管理、解体などの選択肢です。',
        rank: 'A++',
        who_needs_this: '誰も住まなくなる磐田市内の実家を引き継ぐことになった方。',
        first_action: '実家の現状を確認し、磐田市の空き家等相談窓口や、必要に応じて地域の専門家に相談しましょう。',
        today_tasks: ['実家の戸締まりとライフラインの契約状況を確認する'],
        official_sources: '空き家等相談窓口（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001588.html',
        consult_type: 'real_estate'
      },
      {
        slug: 'house-became-vacant',
        title: '空き家になった（相続後）',
        icon: '🏚️',
        summary: '相続後に実家が空き家になった際の、保安・管理の注意点です。',
        rank: 'A++',
        who_needs_this: '実家が誰も住まない状態（空き家）になり、管理をしたい方。',
        first_action: '草木が近隣に侵入していないか、定期的に実家を訪問するか、近隣の方に現況確認をお願いしましょう。',
        official_sources: '空き家等の適切な管理（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/sumai_seikatsu/1001588.html',
        consult_type: 'real_estate'
      },
      {
        slug: 'property-tax-inheritance',
        title: '固定資産税（相続）',
        icon: '💵',
        summary: '相続が発生した年の固定資産税の支払い代表者指定です。',
        rank: 'A',
        who_needs_this: '亡くなった方が磐田市内に土地や家屋を所有していた場合のご遺族。',
        first_action: '「相続人代表者指定届」を課税課に提出し、納税通知書の受け取り人を決めましょう。',
        required_items: ['相続人代表者指定届出書'],
        municipal_window: '財務部 課税課',
        official_sources: '固定資産の所有者が亡くなったとき（磐田市）|https://www.city.iwata.shizuoka.jp/shisei_jouhou/shizei/1001925.html',
        consult_type: 'real_estate'
      },
      {
        slug: 'grave-memorial',
        title: 'お墓・供養',
        icon: '🪦',
        summary: '市営墓園の利用資格、改葬（お墓の引っ越し）の申請手順です。',
        rank: 'B',
        who_needs_this: '他の場所からお墓を移したい方。',
        first_action: '改葬（お墓の引っ越し）をする場合は、現在の墓地管理者が発行する証明書と、磐田市での「改葬許可申請」が必要です。',
        municipal_window: '環境部 環境課',
        official_sources: '改葬手続き（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/kankyou/1001519.html'
      },
      {
        slug: 'bereavement-procedures',
        title: 'おくやみ手続き',
        icon: '🏢',
        summary: '磐田市が設置する「おくやみ窓口」の予約方法と必要書類の確認です。',
        rank: 'A++',
        who_needs_this: '亡くなった家族に関する役所内の諸手続きを一括で行いたい方。',
        first_action: 'おくやみ窓口（電話：0538-37-4848）へ電話で予約を入れましょう。',
        today_tasks: ['おくやみ窓口への予約電話を入れる（完全予約制）'],
        this_week_tasks: ['故人の保険証や手帳を集める'],
        required_items: ['故人の健康保険証', '年金手帳', '印鑑'],
        municipal_window: '市民部 市民課（おくやみ窓口）',
        official_sources: 'おくやみ窓口のご案内（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1009890.html'
      }
    ]
  },
  {
    slug: 'moving-out',
    title: '新しい場所へ',
    subtitle: '磐田市から他市区町村への引っ越し手続き、各種ライフラインの中止など',
    icon: '👋',
    topics: [
      {
        slug: 'moving-away',
        title: '磐田市から引っ越す',
        icon: '👋',
        summary: '磐田市外への引っ越しが決まった際の手続き全体フローです。',
        rank: 'A++',
        who_needs_this: '磐田市から他の市区町村へ引っ越す世帯。',
        first_action: '引っ越しの前後14日以内に、市民課で「転出届」を提出しましょう。',
        today_tasks: ['マイナポータルからのオンライン転出を検討する'],
        this_week_tasks: ['本人確認書類を持って市民課または支所へ行く'],
        required_items: ['本人確認書類', '印鑑', 'マイナンバーカード'],
        municipal_window: '市民課（または各支所）',
        official_sources: '転出手続き（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001395.html'
      },
      {
        slug: 'move-out-notice',
        title: '転出届',
        icon: '📄',
        summary: '転出届の提出期間、オンライン申請の方法についてです。',
        rank: 'A+',
        who_needs_this: '他市区町村へ住所を移す予定の方。',
        first_action: 'マイナンバーカードをお持ちの方は、「マイナポータル」で転出届を提出できます。',
        official_sources: '転出届（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/todokede_shoumei/1001395.html'
      },
      {
        slug: 'stop-water',
        title: '水道を止める',
        icon: '🚰',
        summary: '引っ越しに伴う水道使用中止の手続きです。',
        rank: 'A+',
        who_needs_this: '転出により水道契約を閉栓したい方。',
        first_action: '引っ越し日の3〜4日前までに、水道お客様センターで使用中止を申請しましょう。',
        today_tasks: ['水道の使用中止日を決める'],
        this_week_tasks: ['水道お客様センターにネットまたは電話で連絡する'],
        municipal_window: '上下水道部 水道課（水道お客様センター）',
        official_sources: '水道の中止（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/suidou_gesuidou/1001489.html'
      },
      {
        slug: 'bulk-garbage-cleaning',
        title: '粗大ごみ・片付け（転出）',
        icon: '🗑️',
        summary: '引っ越しの際に出る多量のごみの処理方法です。',
        rank: 'A++',
        who_needs_this: '大量の不用品や大型家具を処分したい方。',
        first_action: '多量ごみは「クリーンセンターしんり」へ直接持ち込み（有料）が可能です。',
        today_tasks: ['持ち込める曜日と時間、料金を確認する'],
        this_week_tasks: ['分別をして車に積み込み、クリーンセンターに搬入する'],
        required_items: ['住所が確認できる免許証等（市民確認のため）'],
        municipal_window: '環境部 ごみ対策課',
        official_sources: 'ごみの自己搬入（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/gomi_recycle/1001463.html'
      },
      {
        slug: 'school-nursery-procedures',
        title: '学校・保育園の手続き（転出）',
        icon: '🏫',
        summary: '転出に伴う小中学校の転出証明書発行、および退園届です。',
        rank: 'A+',
        who_needs_this: '転出する小中学生、保育園児を持つ保護者。',
        first_action: 'まず通学中の学校・園に転出の日程を事前に申し出てください。',
        today_tasks: ['在学中の学校へ転出する旨を連絡する'],
        this_week_tasks: ['学校から「在学証明書」「教科書給与証明書」を受け取る', '保育園の場合は退園届を出す'],
        required_items: ['在学証明書等', '退園届'],
        municipal_window: '学校教育課（学校）／こども未来課（保育園）',
        official_sources: '小中学校の転出・転校（磐田市）|https://www.city.iwata.shizuoka.jp/kosodate_kyouiku/kyouiku/1001607.html'
      },
      {
        slug: 'dog-ownership-change',
        title: '犬の登録変更（転出）',
        icon: '🐕',
        summary: '犬と一緒に転出する場合の、転出先での鑑札交換等です。',
        rank: 'A',
        who_needs_this: '犬を飼っており、市外へ引っ越す方。',
        first_action: '新住所地の役所で登録変更を行ってください。磐田市での手続きは不要です。',
        required_items: ['犬 of 鑑札'],
        official_sources: '犬の登録と狂犬病（磐田市）|https://www.city.iwata.shizuoka.jp/kurashi_tetsuzuki/kankyou/1001511.html'
      }
    ]
  }
];
