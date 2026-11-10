# michellepalinkas.github.io

Michelle Palinkas portfolio. Static site on GitHub Pages: plain HTML, one stylesheet, one script, no build step.

## What lives where
- `index.html`: all copy and sections (hero, awards and film, about, numbers, selected work, timeline, portfolio, toolkit, contact).
- `assets/site.css`: all styles. Colours and fonts are set at the top in `:root`.
- `assets/site.js`: entrance and scroll animations, count ups, the sticky work panels, the timeline, the film player, the gallery filters and the lightbox.
- `assets/img/`: portrait on white (`michelle-white.jpg`, used in the hero split; `michelle.png` is the cutout, not used right now), share image for link previews (`share.jpg`, 1200x630), tab icon (`favicon.svg`).
- `assets/work/`: portfolio images. Each piece has `name.jpg` (full size, lightbox) and `name-sm.jpg` (gallery thumbnail).
- `Michelle_Palinkas_Resume.pdf`: public résumé, no phone number.
- `.nojekyll`: tells GitHub to serve the files as they are. `.gitignore`: files never published.

## Common edits
- Official award artwork: save the Gold ADDY art as `assets/img/award-addy.png` and the Silver Telly art as `assets/img/award-telly.png` (transparent PNG, about 400 px tall). They replace the gold and silver words in the awards section automatically; without them the words show.
- Add a portfolio piece: save `name.jpg` (2000 px long edge, metadata stripped) and `name-sm.jpg` (900 px) in `assets/work/`, then copy one `<button class="tile" ...>` line in the Portfolio section of `index.html` and change `data-src`, `data-t` (title), `data-s` (one line caption) and `data-c` (3d, tv, viz or art).
- Change the film: edit `data-yt` on the `#film` button (the YouTube ID).
- After changing site.css or site.js, change the `?v=` number on their links in `index.html` so browsers fetch the new version.

## Rules
- Only public facing Corning work (released campaigns, anything on the Optical Communications YouTube channel). Internal metrics and process details stay in the résumé.
- Every number must hold up in an interview.
- Nothing private in this folder: masters, PSDs, the full résumé with phone and notes live one level up.
