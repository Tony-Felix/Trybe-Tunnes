#!/bin/bash

### GIT FILTER-REPO ###

## NÃO EXECUTE ESSE SCRIPT DIRETAMENTE
## Esse script foi feito para uso do
## script 'trybe-publisher' fornecido
## pela Trybe.

[[ $# == 1 ]] && \
[[ $1 == "trybe-security-parameter" ]] && \
git filter-repo \
  --path .trybe \
  --path .github \
  --path trybe.yml \
  --path trybe-filter-repo.sh \
  --path only-image.png \
  --path skip-image.png \
  --path images \
  --path .npmrc \
  --path src/tests/01.LoginPage.test.ts \
  --path src/tests/02.SearchPage.test.ts \
  --path src/tests/03.AlbumPage.test.ts \
  --path src/tests/04.HeaderComponent.test.tsx \
  --path src/tests/05.FavoriteCheckbox.test.ts \
  --path src/tests/06.AddOrRemoveFavorites.test.ts \
  --path src/tests/07.GetFavoriteSongs.test.ts \
  --path src/tests/08.FavoriteSongsPage.test.ts \
  --path src/tests/09.ProfilePage.test.ts \
  --path src/tests/10.EditProfilePage.test.ts \
  --path src/tests/helpers \
  --path src/tests/mocks \
  --path README.md \
  --invert-paths --force --quiet
