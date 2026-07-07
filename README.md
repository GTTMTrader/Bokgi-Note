# 복기노트 iOS PWA - 현재 기준본

업로드한 `복기노트-iOS(2).html`을 기준으로 `index.html` 이름에 맞춰 정리하고,
빨초빨초 아이콘과 PWA 보조파일을 포함한 GitHub Pages 업로드용 패키지입니다.

GitHub에 올릴 파일:
- index.html
- manifest.webmanifest
- service-worker.js
- apple-touch-icon.png
- icon-192.png
- icon-512.png
- README.md

업로드 방법:
1. ZIP 압축 풀기
2. GitHub `bokgi-note` 저장소로 이동
3. `Add file` → `Upload files`
4. 압축 푼 폴더 안의 파일 전부 업로드
5. 같은 이름 파일은 덮어쓰기
6. `Commit changes`
7. 1-5분 대기
8. Safari에서 `https://gttmtrader.github.io/bokgi-note/?v=6` 접속
9. 기존 홈화면 아이콘 삭제 후 다시 `홈 화면에 추가`

주의:
- ZIP 자체를 GitHub에 올리면 안 됩니다.
- 압축 푼 내부 파일들을 올려야 합니다.
- 앱 안의 기존 데이터는 Safari/localStorage에 있으므로, 큰 로직 수정 전에는 앱 내보내기/백업부터 하세요.
