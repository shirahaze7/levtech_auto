const $ = window.jQuery;

$('table tbody tr').each(function() {
  const row = $(this);

  // 日付取得
  const dateText = row.find('td').first().text().trim();
  const match = dateText.match(/\d{2}\/\d{2}/);
  if (!match) return;

  const key = match[0];
  const d = data[key];
  if (!d) return;

  // 各入力欄
  const start = row.find('input[name$="[start_time]"]');
  const end = row.find('input[name$="[end_time]"]');
  const relax = row.find('input[name$="[relax_time]"]');
  //onst content = row.find('input[name$="[work_content]"]');

  // 値セット
  start.val(d.start);
  end.val(d.end);
  relax.val(d.break);
  //content.val(d.content);

  // ★これがレバテックのトリガー
  relax.trigger('focusout');
});