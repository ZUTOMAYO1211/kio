/* Customer-facing translations. Original store/config data stays untouched. */
(function (global) {
  'use strict';
  var languages = ['ko', 'en', 'ja', 'zh'];
  // Each source maps to [English, Japanese, Simplified Chinese].
  var dictionary = {
  "주문 시작하기": [
    "Start order",
    "注文する",
    "开始点餐"
  ],
  "큰 글씨 모드": [
    "Large text",
    "大きな文字",
    "大字模式"
  ],
  "언어 선택": [
    "Language",
    "言語",
    "语言"
  ],
  "홈": [
    "Home",
    "ホーム",
    "首页"
  ],
  "매장 로고": [
    "Store logo",
    "店舗ロゴ",
    "店铺标志"
  ],
  "주문 유형 선택": [
    "Order type",
    "注文方法",
    "用餐方式"
  ],
  "뒤로": [
    "Back",
    "戻る",
    "返回"
  ],
  "어디에서 드시나요?": [
    "Where will you eat?",
    "どちらで召し上がりますか？",
    "您在哪里用餐？"
  ],
  "포장은 일부 메뉴 구성이 달라질 수 있습니다.": [
    "Some items may differ for takeaway.",
    "お持ち帰りは一部メニューが異なる場合があります。",
    "外带的部分菜单可能有所不同。"
  ],
  "매장에서 식사": [
    "Dine in",
    "店内で食べる",
    "堂食"
  ],
  "매장 식사": [
    "Dine in",
    "店内",
    "堂食"
  ],
  "매장에서 드시고 가세요": [
    "Enjoy your meal here",
    "店内でお召し上がりください",
    "请在店内享用"
  ],
  "포장": [
    "Takeaway",
    "お持ち帰り",
    "外带"
  ],
  "가지고 나가세요": [
    "Take your order with you",
    "お持ち帰りいただけます",
    "打包带走"
  ],
  "결제 전에 한 번 더 확인해 드려요.": [
    "We check this again before payment.",
    "お支払い前にもう一度確認します。",
    "结账前会再次确认。"
  ],
  "주문 방식이 맞나요?": [
    "Is this the right order type?",
    "この注文方法でよろしいですか？",
    "用餐方式正确吗？"
  ],
  "결제 후에는 바꿀 수 없습니다.": [
    "It cannot be changed after payment.",
    "お支払い後は変更できません。",
    "支付后无法更改。"
  ],
  "이대로 결제": [
    "Pay with this",
    "このまま支払う",
    "确认并支付"
  ],
  "메뉴": [
    "Menu",
    "メニュー",
    "菜单"
  ],
  "처음으로": [
    "Home",
    "ホームへ",
    "返回首页"
  ],
  "카테고리": [
    "Categories",
    "カテゴリー",
    "分类"
  ],
  "상품 선택": [
    "Choose an item",
    "商品を選ぶ",
    "选择商品"
  ],
  "주문 내역": [
    "Your order",
    "注文内容",
    "订单详情"
  ],
  "결제": [
    "Payment",
    "お支払い",
    "付款"
  ],
  "주문 완료": [
    "Order complete",
    "注文完了",
    "下单成功"
  ],
  "세로로 돌리면 더 크게 보입니다": [
    "Rotate your device vertically for a larger view",
    "縦向きにすると大きく表示されます",
    "竖屏查看效果更佳"
  ],
  "보여 드릴 카테고리가 없습니다": [
    "No categories available",
    "カテゴリーがありません",
    "暂无分类"
  ],
  "편집 모드 > 카테고리에서 추가하거나 표시를 켜 주세요.": [
    "Add or enable categories in Edit mode.",
    "編集モードでカテゴリーを追加・表示してください。",
    "请在编辑模式中添加或启用分类。"
  ],
  "이 카테고리에 메뉴가 없습니다": [
    "No items in this category",
    "このカテゴリーには商品がありません",
    "此分类暂无商品"
  ],
  "편집 모드 > 메뉴에서 추가할 수 있습니다.": [
    "Add items in Edit mode.",
    "編集モードで商品を追加できます。",
    "可在编辑模式中添加商品。"
  ],
  "이전 페이지": [
    "Previous page",
    "前のページ",
    "上一页"
  ],
  "다음 페이지": [
    "Next page",
    "次のページ",
    "下一页"
  ],
  "품절": [
    "Sold out",
    "売り切れ",
    "售罄"
  ],
  "대표": [
    "Popular",
    "おすすめ",
    "推荐"
  ],
  "담은 메뉴": [
    "Your items",
    "選んだ商品",
    "已选商品"
  ],
  "메뉴를 선택해 주세요": [
    "Choose your items",
    "商品を選んでください",
    "请选择商品"
  ],
  "결제하기": [
    "Checkout",
    "お会計",
    "去结算"
  ],
  "1개 필수": [
    "Choose one",
    "1つ必須",
    "必选一项"
  ],
  "1개 선택": [
    "Choose up to one",
    "1つまで選択",
    "最多选一项"
  ],
  "여러 개 선택": [
    "Choose any",
    "複数選択可",
    "可多选"
  ],
  "무료": [
    "Free",
    "無料",
    "免费"
  ],
  "메뉴 선택": [
    "Choose options",
    "商品を選ぶ",
    "选择商品"
  ],
  "수량 줄이기": [
    "Decrease quantity",
    "数量を減らす",
    "减少数量"
  ],
  "수량 늘리기": [
    "Increase quantity",
    "数量を増やす",
    "增加数量"
  ],
  "수량": [
    "Quantity",
    "数量",
    "数量"
  ],
  "합계": [
    "Total",
    "合計",
    "合计"
  ],
  "취소": [
    "Cancel",
    "キャンセル",
    "取消"
  ],
  "확인": [
    "OK",
    "確認",
    "确认"
  ],
  "담기": [
    "Add",
    "追加",
    "加入订单"
  ],
  "담은 메뉴가 없습니다": [
    "Your order is empty",
    "商品が入っていません",
    "尚未选择商品"
  ],
  "메뉴로 돌아가 원하는 메뉴를 골라 주세요.": [
    "Go back to the menu to choose your items.",
    "メニューに戻って商品を選んでください。",
    "请返回菜单选择商品。"
  ],
  "메뉴 보러 가기": [
    "Browse menu",
    "メニューを見る",
    "查看菜单"
  ],
  "주문 방식": [
    "Order type",
    "注文方法",
    "用餐方式"
  ],
  "총 수량": [
    "Total quantity",
    "合計数量",
    "总数量"
  ],
  "결제 금액": [
    "Amount due",
    "お支払い金額",
    "应付金额"
  ],
  "전체 취소": [
    "Clear order",
    "すべて取消",
    "清空订单"
  ],
  "메뉴 더 담기": [
    "Add more",
    "追加注文",
    "继续点餐"
  ],
  "삭제": [
    "Remove",
    "削除",
    "删除"
  ],
  "신용 · 체크카드": [
    "Credit / debit card",
    "クレジット・デビットカード",
    "信用卡／借记卡"
  ],
  "카드를 리더기에 넣어 주세요": [
    "Insert your card into the reader",
    "カードをリーダーに入れてください",
    "请将卡插入读卡器"
  ],
  "간편결제": [
    "Mobile payment",
    "スマホ決済",
    "移动支付"
  ],
  "휴대폰 QR을 리더기에 대 주세요": [
    "Hold your QR code up to the reader",
    "QRコードをリーダーにかざしてください",
    "请将手机二维码对准读卡器"
  ],
  "현금": [
    "Cash",
    "現金",
    "现金"
  ],
  "직원에게 말씀해 주세요": [
    "Please ask a staff member",
    "スタッフにお声がけください",
    "请联系店员"
  ],
  "어떻게 결제하시겠어요?": [
    "How would you like to pay?",
    "お支払い方法を選んでください",
    "请选择付款方式"
  ],
  "이 화면은 시뮬레이터입니다.": [
    "This is a simulator.",
    "これはシミュレーターです。",
    "这是模拟器。"
  ],
  "실제로 결제되지 않으며 카드 정보를 입력받지 않습니다.": [
    "No real payment is made. No card details are collected.",
    "実際の決済やカード情報の入力はありません。",
    "不会实际扣款，也不会收集银行卡信息。"
  ],
  "직원을 호출했습니다": [
    "Staff notified",
    "スタッフを呼び出しました",
    "已呼叫店员"
  ],
  "카운터에서 현금을 받은 뒤 확인해 드립니다.": [
    "Staff will confirm your cash payment at the counter.",
    "カウンターで現金を受け取り確認します。",
    "店员将在柜台收款后确认。"
  ],
  "금액 확인 중": [
    "Checking amount",
    "金額を確認中",
    "正在确认金额"
  ],
  "잠시만 기다려 주세요.": [
    "Please wait a moment.",
    "少々お待ちください。",
    "请稍候。"
  ],
  "결제 완료": [
    "Payment complete",
    "お支払い完了",
    "付款完成"
  ],
  "카드를 넣어 주세요": [
    "Insert your card",
    "カードを入れてください",
    "请插入银行卡"
  ],
  "QR을 대 주세요": [
    "Scan your QR code",
    "QRコードをかざしてください",
    "请出示二维码"
  ],
  "리더기에서 손을 떼지 마세요.": [
    "Keep your card or phone at the reader.",
    "カードやスマートフォンをそのままにしてください。",
    "请保持银行卡或手机靠近读卡器。"
  ],
  "승인 요청 중": [
    "Requesting approval",
    "承認を確認中",
    "正在请求授权"
  ],
  "통신 중입니다. 잠시만 기다려 주세요.": [
    "Connecting. Please wait.",
    "通信中です。少々お待ちください。",
    "正在连接，请稍候。"
  ],
  "승인 완료": [
    "Approved",
    "承認完了",
    "授权成功"
  ],
  "기타": [
    "Other",
    "その他",
    "其他"
  ],
  "번호가 불리면 카운터에서 받아 가세요.": [
    "Collect your order when your number is called.",
    "番号が呼ばれたらカウンターでお受け取りください。",
    "叫到号码后，请到柜台取餐。"
  ],
  "처음 화면으로": [
    "Back to home",
    "ホームに戻る",
    "返回首页"
  ],
  "초 후 자동으로 돌아갑니다": [
    "seconds until returning home",
    "秒後にホームに戻ります",
    "秒后自动返回首页"
  ],
  "을(를) 담았습니다": [
    " added to your order",
    "を追加しました",
    "已加入订单"
  ],
  "개를 담았습니다": [
    " item(s) added",
    "点を追加しました",
    "件已加入订单"
  ],
  "개": [
    " items",
    "点",
    "件"
  ],
  "큰 글씨 모드를 켰습니다": [
    "Large text is on",
    "大きな文字をオンにしました",
    "已开启大字模式"
  ],
  "큰 글씨 모드를 껐습니다": [
    "Large text is off",
    "大きな文字をオフにしました",
    "已关闭大字模式"
  ],
  "아직 계신가요?": [
    "Still there?",
    "操作を続けますか？",
    "您还在吗？"
  ],
  "초 후 처음 화면으로 돌아갑니다.": [
    " seconds until returning home.",
    "秒後にホームに戻ります。",
    "秒后返回首页。"
  ],
  "담아 두신 메뉴는 그대로 두고 계속하실 수 있어요.": [
    "Continue to keep the items in your order.",
    "選んだ商品を残して続けられます。",
    "可保留已选商品并继续点餐。"
  ],
  "계속하기": [
    "Continue",
    "続ける",
    "继续"
  ],
  "주문을 취소할까요?": [
    "Cancel your order?",
    "注文を取り消しますか？",
    "要取消订单吗？"
  ],
  "담아 두신 메뉴가 모두 사라집니다.": [
    "All items will be removed.",
    "選んだ商品がすべて削除されます。",
    "将移除所有已选商品。"
  ],
  "먼저 메뉴를 담아 주세요": [
    "Please add an item first",
    "先に商品を追加してください",
    "请先选择商品"
  ],
  "전체 취소할까요?": [
    "Clear your order?",
    "すべて取り消しますか？",
    "要清空订单吗？"
  ],
  "담은 메뉴를 모두 비웁니다.": [
    "All items will be removed.",
    "商品をすべて削除します。",
    "将清空所有已选商品。"
  ],
  "주문 내역을 비웠습니다": [
    "Order cleared",
    "注文内容を空にしました",
    "已清空订单"
  ],
  "천천히 고르세요.": [
    "Take your time.",
    "ゆっくりお選びください。",
    "慢慢挑选。"
  ],
  "기다려 드릴게요.": [
    "We can wait.",
    "お待ちしています。",
    "我们等您。"
  ],
  "오늘 볶은 원두로 한 잔씩 내립니다. 품절 메뉴도 숨기지 않고 보여 드려요.": [
    "Freshly roasted coffee, brewed to order. Sold-out items stay visible.",
    "焙煎したての豆で一杯ずつ。売り切れ商品も表示します。",
    "新鲜烘焙，逐杯现做。售罄商品也会保留显示。"
  ],
  "갓 구운 패티,": [
    "Fresh off the grill,",
    "焼きたてのパティを、",
    "现烤肉饼，"
  ],
  "지금 나갑니다.": [
    "made for you.",
    "今お届けします。",
    "即刻呈上。"
  ],
  "세트 구성과 추가 옵션을 한 화면에서 고르실 수 있어요.": [
    "Choose your meal and extras in one place.",
    "セットと追加オプションを一画面で選べます。",
    "可在同一页面选择套餐和加料。"
  ],
  "오늘도 그 맛,": [
    "The same great taste,",
    "今日も変わらない、",
    "熟悉的味道，"
  ],
  "그대로입니다.": [
    "day after day.",
    "いつもの味。",
    "一如既往。"
  ],
  "맵기와 사리는 원하시는 대로 골라 담으세요.": [
    "Choose your spice level and extras.",
    "辛さやトッピングをお選びください。",
    "自由选择辣度和加料。"
  ],
  "필요한 건": [
    "Everything you need,",
    "必要なものは、",
    "所需好物，"
  ],
  "여기 다 있어요.": [
    "right here.",
    "ここにあります。",
    "尽在这里。"
  ],
  "데우기 여부와 봉투는 담으면서 바로 고르실 수 있습니다.": [
    "Choose heating and a bag when adding items.",
    "商品の追加時に温めや袋を選べます。",
    "加入商品时可选择加热和购物袋。"
  ],
  "주문을": [
    "Ready",
    "注文を",
    "准备好"
  ],
  "시작해 볼까요?": [
    "to order?",
    "始めましょうか？",
    "开始点餐了吗？"
  ],
  "주문을 시작해 볼까요?": [
    "Ready to order?",
    "注文を始めましょうか？",
    "准备好点餐了吗？"
  ],
  "로고를 다섯 번 눌러 편집 모드로 들어가면 메뉴를 추가할 수 있습니다.": [
    "Tap the logo five times to edit and add items.",
    "ロゴを5回押すと編集モードで商品を追加できます。",
    "点击标志五次进入编辑模式即可添加商品。"
  ],
  "커피": [
    "Coffee",
    "コーヒー",
    "咖啡"
  ],
  "논커피 · 티": [
    "Tea & more",
    "ティー・その他",
    "茶与其他饮品"
  ],
  "디저트": [
    "Desserts",
    "デザート",
    "甜点"
  ],
  "버거": [
    "Burgers",
    "バーガー",
    "汉堡"
  ],
  "사이드": [
    "Sides",
    "サイド",
    "小食"
  ],
  "음료": [
    "Drinks",
    "ドリンク",
    "饮品"
  ],
  "분식": [
    "Street food",
    "韓国軽食",
    "韩式小吃"
  ],
  "밥 · 면": [
    "Rice & noodles",
    "ご飯・麺",
    "饭与面"
  ],
  "간편식": [
    "Ready meals",
    "軽食",
    "便当速食"
  ],
  "스낵": [
    "Snacks",
    "お菓子",
    "零食"
  ],
  "생활용품": [
    "Essentials",
    "日用品",
    "生活用品"
  ],
  "기본": [
    "General",
    "基本",
    "默认"
  ],
  "오늘의 드립": [
    "Daily drip coffee",
    "本日のドリップ",
    "每日手冲咖啡"
  ],
  "아메리카노": [
    "Americano",
    "アメリカーノ",
    "美式咖啡"
  ],
  "카페 라떼": [
    "Café latte",
    "カフェラテ",
    "拿铁咖啡"
  ],
  "바닐라 라떼": [
    "Vanilla latte",
    "バニララテ",
    "香草拿铁"
  ],
  "플랫 화이트": [
    "Flat white",
    "フラットホワイト",
    "馥芮白"
  ],
  "흑임자 라떼": [
    "Black sesame latte",
    "黒ごまラテ",
    "黑芝麻拿铁"
  ],
  "자몽 에이드": [
    "Grapefruit ade",
    "グレープフルーツエード",
    "西柚气泡饮"
  ],
  "얼그레이 티": [
    "Earl Grey tea",
    "アールグレイ",
    "伯爵红茶"
  ],
  "제주 말차 라떼": [
    "Jeju matcha latte",
    "済州抹茶ラテ",
    "济州抹茶拿铁"
  ],
  "바스크 치즈케이크": [
    "Basque cheesecake",
    "バスクチーズケーキ",
    "巴斯克芝士蛋糕"
  ],
  "버터 크루아상": [
    "Butter croissant",
    "バタークロワッサン",
    "黄油可颂"
  ],
  "레몬 파운드": [
    "Lemon pound cake",
    "レモンパウンドケーキ",
    "柠檬磅蛋糕"
  ],
  "더블패티 클래식": [
    "Classic double burger",
    "クラシックダブルバーガー",
    "经典双层汉堡"
  ],
  "치즈버거": [
    "Cheeseburger",
    "チーズバーガー",
    "芝士汉堡"
  ],
  "불고기버거": [
    "Bulgogi burger",
    "プルコギバーガー",
    "韩式烤肉汉堡"
  ],
  "스파이시 치킨": [
    "Spicy chicken burger",
    "スパイシーチキンバーガー",
    "香辣鸡腿汉堡"
  ],
  "새우버거": [
    "Shrimp burger",
    "えびバーガー",
    "鲜虾汉堡"
  ],
  "감자튀김": [
    "French fries",
    "フライドポテト",
    "薯条"
  ],
  "치즈스틱 3조각": [
    "Cheese sticks (3)",
    "チーズスティック3本",
    "芝士条（3根）"
  ],
  "어니언링": [
    "Onion rings",
    "オニオンリング",
    "洋葱圈"
  ],
  "콜라": [
    "Cola",
    "コーラ",
    "可乐"
  ],
  "제로 콜라": [
    "Zero cola",
    "ゼロコーラ",
    "零糖可乐"
  ],
  "옛날 떡볶이": [
    "Classic tteokbokki",
    "昔ながらのトッポッキ",
    "经典辣炒年糕"
  ],
  "로제 떡볶이": [
    "Rosé tteokbokki",
    "ロゼトッポッキ",
    "奶油辣炒年糕"
  ],
  "모둠 튀김": [
    "Assorted fritters",
    "揚げ物盛り合わせ",
    "什锦炸物"
  ],
  "순대 한 접시": [
    "Sundae sausage plate",
    "スンデ盛り合わせ",
    "韩式血肠拼盘"
  ],
  "치즈 김말이": [
    "Cheese seaweed rolls",
    "チーズキムマリ",
    "芝士炸紫菜卷"
  ],
  "김치볶음밥": [
    "Kimchi fried rice",
    "キムチチャーハン",
    "泡菜炒饭"
  ],
  "잔치국수": [
    "Noodles in anchovy broth",
    "韓国にゅうめん",
    "韩式清汤面"
  ],
  "비빔국수": [
    "Spicy mixed noodles",
    "ビビングクス",
    "韩式辣拌面"
  ],
  "라면": [
    "Ramyeon",
    "ラーメン",
    "韩式拉面"
  ],
  "김밥 한 줄": [
    "Gimbap roll",
    "キンパ1本",
    "紫菜包饭"
  ],
  "계란말이": [
    "Rolled omelette",
    "卵焼き",
    "韩式鸡蛋卷"
  ],
  "불고기 도시락": [
    "Bulgogi lunchbox",
    "プルコギ弁当",
    "韩式烤肉便当"
  ],
  "참치마요 삼각김밥": [
    "Tuna mayo rice ball",
    "ツナマヨおにぎり",
    "金枪鱼蛋黄酱饭团"
  ],
  "치즈 핫도그": [
    "Cheese corn dog",
    "チーズハットグ",
    "芝士热狗棒"
  ],
  "컵라면": [
    "Cup noodles",
    "カップ麺",
    "杯面"
  ],
  "아이스 아메리카노": [
    "Iced Americano",
    "アイスアメリカーノ",
    "冰美式咖啡"
  ],
  "생수 500ml": [
    "Water 500 ml",
    "ミネラルウォーター500ml",
    "矿泉水500毫升"
  ],
  "이온음료": [
    "Sports drink",
    "スポーツドリンク",
    "运动饮料"
  ],
  "딸기 우유": [
    "Strawberry milk",
    "いちごミルク",
    "草莓牛奶"
  ],
  "감자칩 오리지널": [
    "Original potato chips",
    "ポテトチップス",
    "原味薯片"
  ],
  "초코 쿠키": [
    "Chocolate cookies",
    "チョコクッキー",
    "巧克力曲奇"
  ],
  "종량제 봉투 20L": [
    "Waste bag 20 L",
    "指定ごみ袋20L",
    "计量垃圾袋20升"
  ],
  "우산": [
    "Umbrella",
    "傘",
    "雨伞"
  ],
  "사이즈": [
    "Size",
    "サイズ",
    "杯型"
  ],
  "레귤러": [
    "Regular",
    "レギュラー",
    "中杯"
  ],
  "라지": [
    "Large",
    "ラージ",
    "大杯"
  ],
  "온도": [
    "Temperature",
    "温度",
    "温度"
  ],
  "추가 옵션": [
    "Extras",
    "追加オプション",
    "加料"
  ],
  "샷 추가": [
    "Extra espresso shot",
    "ショット追加",
    "加浓缩咖啡"
  ],
  "연하게": [
    "Mild coffee",
    "薄め",
    "淡咖啡"
  ],
  "휘핑크림": [
    "Whipped cream",
    "ホイップクリーム",
    "鲜奶油"
  ],
  "바닐라 시럽": [
    "Vanilla syrup",
    "バニラシロップ",
    "香草糖浆"
  ],
  "우유 변경": [
    "Milk choice",
    "ミルク変更",
    "选择奶类"
  ],
  "일반 우유": [
    "Dairy milk",
    "牛乳",
    "普通牛奶"
  ],
  "오트 우유": [
    "Oat milk",
    "オーツミルク",
    "燕麦奶"
  ],
  "두유": [
    "Soy milk",
    "豆乳",
    "豆奶"
  ],
  "세트 선택": [
    "Meal option",
    "セット選択",
    "选择套餐"
  ],
  "단품": [
    "Item only",
    "単品",
    "单点"
  ],
  "세트 (감자튀김 + 음료)": [
    "Meal (fries + drink)",
    "セット（ポテト＋ドリンク）",
    "套餐（薯条＋饮料）"
  ],
  "라지 세트": [
    "Large meal",
    "ラージセット",
    "加大套餐"
  ],
  "음료 선택": [
    "Choose a drink",
    "ドリンク選択",
    "选择饮料"
  ],
  "추가 / 제외": [
    "Add / remove",
    "追加・抜き",
    "添加／去除"
  ],
  "패티 추가": [
    "Extra patty",
    "パティ追加",
    "加肉饼"
  ],
  "치즈 추가": [
    "Extra cheese",
    "チーズ追加",
    "加芝士"
  ],
  "양파 빼기": [
    "No onions",
    "玉ねぎ抜き",
    "不要洋葱"
  ],
  "피클 빼기": [
    "No pickles",
    "ピクルス抜き",
    "不要酸黄瓜"
  ],
  "맵기": [
    "Spice level",
    "辛さ",
    "辣度"
  ],
  "순한맛": [
    "Mild",
    "控えめ",
    "微辣"
  ],
  "보통": [
    "Medium",
    "普通",
    "中辣"
  ],
  "매운맛": [
    "Hot",
    "辛口",
    "重辣"
  ],
  "사리 추가": [
    "Add toppings",
    "トッピング追加",
    "加配料"
  ],
  "라면 사리": [
    "Extra noodles",
    "ラーメン追加",
    "加拉面"
  ],
  "치즈 사리": [
    "Cheese topping",
    "チーズ",
    "加芝士"
  ],
  "만두 사리": [
    "Dumplings",
    "餃子",
    "加饺子"
  ],
  "공기밥": [
    "Steamed rice",
    "ご飯",
    "米饭"
  ],
  "데우기": [
    "Heating",
    "温め",
    "加热"
  ],
  "그대로 주세요": [
    "No heating",
    "そのまま",
    "无需加热"
  ],
  "데워 주세요": [
    "Heat it up",
    "温めてください",
    "请加热"
  ],
  "봉투": [
    "Bag",
    "袋",
    "购物袋"
  ],
  "필요 없어요": [
    "No bag",
    "不要",
    "不需要"
  ],
  "종량제 봉투 (20L)": [
    "Waste bag (20 L)",
    "指定ごみ袋（20L）",
    "计量垃圾袋（20升）"
  ],
  "매일 바뀌는 싱글 오리진 한 잔. 오늘은 에티오피아 구지.": [
    "Daily single-origin coffee. Today: Ethiopia Guji.",
    "日替わりのシングルオリジン。本日はエチオピア・グジ。",
    "每日精选单一产地咖啡。今日：埃塞俄比亚古吉。"
  ],
  "깊고 진한 기본 블렌드": [
    "Our rich signature blend",
    "深く濃厚な定番ブレンド",
    "浓郁经典拼配"
  ],
  "부드러운 우유와 에스프레소": [
    "Smooth milk and espresso",
    "なめらかなミルクとエスプレッソ",
    "柔滑牛奶与浓缩咖啡"
  ],
  "바닐라 빈 시럽을 더한 라떼": [
    "Latte with vanilla bean syrup",
    "バニラビーンズシロップ入りラテ",
    "添加香草籽糖浆的拿铁"
  ],
  "진한 리스트레토 두 샷": [
    "Two rich ristretto shots",
    "濃厚なリストレット2ショット",
    "双份浓郁精萃咖啡"
  ],
  "고소하게 볶은 흑임자를 갈아 넣었습니다": [
    "Made with ground roasted black sesame",
    "香ばしい煎り黒ごま入り",
    "加入香浓烘烤黑芝麻"
  ],
  "생자몽 과육이 들어간 상큼한 에이드": [
    "Refreshing ade with fresh grapefruit pulp",
    "生グレープフルーツ果肉入りエード",
    "加入新鲜西柚果肉的气泡饮"
  ],
  "베르가못 향이 진한 홍차": [
    "Black tea with fragrant bergamot",
    "ベルガモットが香る紅茶",
    "佛手柑香气浓郁的红茶"
  ],
  "제주산 말차를 곱게 체 쳐서": [
    "Finely sifted Jeju matcha",
    "丁寧にふるった済州産抹茶",
    "细筛济州抹茶"
  ],
  "겉은 진하게 태우고 속은 촉촉하게": [
    "Caramelized outside, creamy inside",
    "香ばしい表面としっとりした中身",
    "焦香外皮，绵密内心"
  ],
  "매일 아침 구워 냅니다": [
    "Freshly baked every morning",
    "毎朝焼き上げます",
    "每天清晨新鲜烘焙"
  ],
  "레몬 제스트를 넣은 묵직한 파운드": [
    "Rich pound cake with lemon zest",
    "レモンの皮が香るパウンドケーキ",
    "加入柠檬皮屑的醇厚磅蛋糕"
  ],
  "100% 순쇠고기 패티 두 장, 체다 치즈, 특제 소스": [
    "Two all-beef patties, cheddar and special sauce",
    "牛肉100％のパティ2枚、チェダー、特製ソース",
    "双层纯牛肉饼、切达芝士和特制酱汁"
  ],
  "녹진한 체다 치즈 한 장": [
    "With a slice of melted cheddar",
    "とろけるチェダーチーズ1枚",
    "一片浓郁切达芝士"
  ],
  "달큰한 불고기 소스": [
    "Sweet and savory bulgogi sauce",
    "甘辛いプルコギソース",
    "香甜韩式烤肉酱"
  ],
  "통닭다리살에 매콤한 시즈닝": [
    "Whole chicken thigh with spicy seasoning",
    "鶏もも肉にスパイシーな味付け",
    "整块鸡腿肉配香辣调味"
  ],
  "통새우살을 뭉쳐 튀겼습니다": [
    "Crispy fried shrimp patty",
    "ぷりぷりのえびを揚げたパティ",
    "整虾肉制成的香脆虾饼"
  ],
  "겉은 바삭, 속은 포슬포슬": [
    "Crispy outside, fluffy inside",
    "外はカリッと、中はホクホク",
    "外脆内软"
  ],
  "쭉 늘어나는 모짜렐라": [
    "Stretchy melted mozzarella",
    "のびるモッツァレラ",
    "拉丝马苏里拉芝士"
  ],
  "두툼하게 썬 양파링": [
    "Thick-cut onion rings",
    "厚切りオニオンリング",
    "厚切洋葱圈"
  ],
  "30년째 같은 고추장 배합. 밀떡으로 나갑니다.": [
    "Our 30-year gochujang recipe with wheat rice cakes.",
    "30年変わらないコチュジャン配合。小麦のトッポッキです。",
    "沿用30年的辣酱配方，采用小麦年糕。"
  ],
  "크림과 고추장을 반반": [
    "Cream and gochujang in perfect balance",
    "クリームとコチュジャンを半分ずつ",
    "奶油与韩式辣酱各半"
  ],
  "오징어 · 김말이 · 고구마 · 만두": [
    "Squid, seaweed rolls, sweet potato and dumplings",
    "イカ・キムマリ・さつまいも・餃子",
    "鱿鱼、紫菜卷、红薯和饺子"
  ],
  "찰순대에 간을 곁들여": [
    "Korean blood sausage with liver",
    "もちもちスンデとレバー",
    "糯米血肠配猪肝"
  ],
  "묵은지를 들기름에 볶아 냅니다": [
    "Aged kimchi stir-fried in perilla oil",
    "熟成キムチをえごま油で炒めます",
    "陈年泡菜用紫苏籽油炒制"
  ],
  "멸치 육수를 하루 우려서": [
    "Slow-simmered anchovy broth",
    "一日かけて煮出したいりこだし",
    "慢熬鳀鱼高汤"
  ],
  "새콤달콤 매콤하게": [
    "Tangy, sweet and spicy",
    "甘酸っぱくピリ辛に",
    "酸甜香辣"
  ],
  "계란 하나 풀어서": [
    "Served with an egg",
    "卵を1つ加えて",
    "加入一颗鸡蛋"
  ],
  "밥 · 불고기 · 반찬 세 가지": [
    "Rice, bulgogi and three side dishes",
    "ご飯・プルコギ・おかず3品",
    "米饭、韩式烤肉和三道小菜"
  ],
  "뜨거운 물은 옆에 있습니다": [
    "Hot water is available nearby",
    "お湯は横にあります",
    "热水在旁边"
  ],
  "갑자기 비가 올 때": [
    "For unexpected rain",
    "急な雨に",
    "应对突如其来的雨"
  ]
};
  var staticText = [], staticLabels = [];
  function locale() {
    var value = global.KIO_STORE.prefs.language;
    return languages.indexOf(value) >= 0 ? value : 'ko';
  }
  function text(value) {
    var source = String(value == null ? '' : value);
    var index = languages.indexOf(locale()) - 1;
    if (index < 0) return source;
    if (Object.prototype.hasOwnProperty.call(dictionary, source)) return dictionary[source][index];
    return source.split('\n').map(function (line) {
      return Object.prototype.hasOwnProperty.call(dictionary, line) ? dictionary[line][index] : line;
    }).join('\n');
  }
  /* Only trusted, fixed UI markup uses this function; user content uses text() then esc(). */
  var keys = Object.keys(dictionary).sort(function (a, b) { return b.length - a.length; });
  var pattern = new RegExp(keys.map(function (key) {
    return key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('|'), 'g');
  function html(markup) {
    if (locale() === 'ko') return markup;
    return markup.replace(pattern, function (key) { return text(key); });
  }
  function apply() {
    document.documentElement.lang = locale() === 'zh' ? 'zh-CN' : locale();
    staticText.forEach(function (entry) { entry.node.nodeValue = entry.source.replace(entry.source.trim(), text(entry.source.trim())); });
    staticLabels.forEach(function (entry) { entry.node.setAttribute('aria-label', text(entry.source)); });
    document.querySelectorAll('[data-language]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.language === locale()));
    });
  }
  function init() {
    document.querySelectorAll('.screen:not(.admin):not(.pin), .rotate-hint').forEach(function (root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), node;
      while ((node = walker.nextNode())) {
        if (Object.prototype.hasOwnProperty.call(dictionary, node.nodeValue.trim())) {
          staticText.push({ node: node, source: node.nodeValue });
        }
      }
      [root].concat(Array.from(root.querySelectorAll('[aria-label]'))).forEach(function (element) {
        var source = element.getAttribute('aria-label');
        if (source) staticLabels.push({ node: element, source: source });
      });
    });
    document.querySelector('.home__languages').addEventListener('click', function (event) {
      var button = event.target.closest('[data-language]');
      if (button) global.KIO_STORE.setPrefs({ language: button.dataset.language });
    });
    apply();
  }
  global.KIO_I18N = { text: text, html: html, init: init, apply: apply, locale: locale };
})(window);
