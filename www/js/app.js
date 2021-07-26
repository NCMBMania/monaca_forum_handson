// NCMBを初期化します
const applicationKey = 'YOUR_APPLICATION_KEY';    // 自分のアプリケーションキーと書き換えてください
const clientKey = 'YOUR_CLIENT_KEY';              // 自分のクライアントキーと書き換えてください
const ncmb = new NCMB(applicationKey, clientKey); // 初期化

// Monacaアプリの準備が完了すると呼ばれるメソッド
ons.ready(async () => {
  // 現在ログインしているユーザを取得（最初は null）
  let user = ncmb.User.getCurrentUser();
  // ログイン判定
  if (user) {
    // ログインしている場合
    try {
      // セッションの有効性確認
      await ncmb.DataStore('Test').fetch();
    } catch (e) {
      // エラーの場合は空にする
      user = null;
    }
  }
  // ログインしていない場合は匿名認証実行
  if (!user) {
    user = await ncmb.User.loginAsAnonymous();
  }
  // 管理者グループのロールを取得 
  const role = await ncmb.Role
    .equalTo('roleName', 'admin')
    .fetch();
  // 管理者グループに所属するユーザを取得
  const users = await role.fetchUser();
  // 自分が所属しているかどうかで管理者フラグを立てる
  window.admin = users.map(u => u.objectId)
    .indexOf(user.objectId) > -1;
});

// 画像を読み込む関数
async function loadImage(name, className) {
  // 指定されたクラスがなければ終了
  if (!this.querySelector(className)) return;
  // NCMBから画像をダウンロード（バイナリなので2つ目の引数に blob を指定）
  const blob = await ncmb.File.download(name, 'blob');
  // FileReaderを用意
  const fileReader = new FileReader();
  fileReader.onload = () => {
    // 写真を読み込んだら、指定されたDOMに適用
    this.querySelector(className).src = fileReader.result;
  };
  // Blobを読み込む
  fileReader.readAsDataURL(blob);
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
