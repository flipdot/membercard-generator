export const useFileDownload =
  () =>
  ({ href, fileName }: { href: string; fileName: string }) => {
    const link = document.createElement('a')
    link.href = href
    link.download = fileName
    link.click()
  }
