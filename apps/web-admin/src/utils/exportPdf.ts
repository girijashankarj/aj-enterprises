export function downloadPdfViaPrint(title: string) {
  const oldTitle = document.title;
  document.title = `${title} - Export`;
  window.print();
  document.title = oldTitle;
}
