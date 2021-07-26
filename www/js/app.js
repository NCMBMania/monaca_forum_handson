// NCMBを初期化します
const applicationKey = 'YOUR_APPLICATION_KEY';    // 自分のアプリケーションキーと書き換えてください
const clientKey = 'YOUR_CLIENT_KEY';              // 自分のクライアントキーと書き換えてください
const ncmb = new NCMB(applicationKey, clientKey); // 初期化

// Monacaアプリの準備が完了すると呼ばれるメソッド
ons.ready(async () => {
});

// 画像を読み込む関数
async function loadImage(name, className) {
}

// 削除可能か判定する関数
function deletable(obj) {
  let bol = false;
  // 管理者であれば常に削除可能
  if (window.admin) {
    bol = true;
  } else {
    // 管理者でない場合は自分に削除権限があるかチェック
    const user = ncmb.User.getCurrentUser();
    bol = user && obj.acl[user.objectId] && obj.acl[user.objectId].write;
  }
  // 削除可能な場合はゴミ箱アイコンを表示
  return bol ? `<ons-icon data-object-id="${obj.objectId}" class="delete" icon="fa-trash"></ons-icon>` : '';
}
