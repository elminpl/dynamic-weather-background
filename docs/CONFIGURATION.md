# Konfiguracja — Dynamic Weather Background 1.0.0

Wartości poniżej odpowiadają oryginalnemu kodowi v1.0.0. Kartę można skonfigurować również wizualnie w interfejsie Home Assistant.

## Źródła danych i zachowanie

| Parametr | Domyślnie | Opis |
|---|---|---|
| `entity` | `weather.forecast_dom` | Encja pogody `weather.*`; ustaw na encję dostępną w swojej instalacji |
| `sun_entity` | `sun.sun` | Encja Słońca |
| `hide_card` | `true` | Ukryj panel karty poza edytorem |

## Chmury i efekty

| Parametr | Domyślnie | Dopuszczalne wartości |
|---|---:|---|
| `clouds` | `true` | `true/false` |
| `cloud_speed` | `42` | 10–240 s |
| `cloud_speed_secondary` | `68` | 10–240 s |
| `cloud_opacity` | `80` | 0–100% |
| `effects_opacity` | `65` | 0–100% |
| `rain` | `true` | `true/false` |
| `snow` | `true` | `true/false` |
| `fog` | `true` | `true/false` |
| `hail` | `true` | `true/false` |
| `lightning` | `false` | `true/false` |
| `precipitation_intensity` | `100` | 0–200% |
| `precipitation_speed` | `100` | 10–200% |
| `lightning_strength` | `65` | 0–100% |
| `lightning_interval` | `14` | 6–60 s |

`cloud_speed` i `cloud_speed_secondary` to czasy przesunięcia warstw, a nie mnożniki prędkości: niższa liczba oznacza szybsze przesuwanie.

## Wygląd kart

| Parametr | Domyślnie | Wartości |
|---|---:|---|
| `card_effect` | `none` | `none`, `glass`, `frosted`, `soft` |
| `card_background_transparency` | `0` | 0–100% |
| `fade_card_content` | `false` | `true/false` |
| `card_content_transparency` | `0` | 0–100% |
| `glass_blur` | `10` | 0–24 px |
| `glass_shine` | `35` | 0–100% |
| `card_border` | `true` | `true/false` |
| `card_shadow` | `35` | 0–100% |

**Uwaga:** `card_effect: none` wymusza standardowy wygląd kart, bez modyfikacji przezroczystości i cieni, niezależnie od pozostałych parametrów.

## Animacja, jakość i podgląd

| Parametr | Domyślnie | Wartości |
|---|---|---|
| `animation` | `auto` | `auto`, `reduced`, `off` |
| `performance` | `balanced` | `high`, `balanced`, `battery` |
| `preview_weather` | `off` | `off` lub kod pogody z listy poniżej |
| `preview_time` | `auto` | `auto`, `day`, `night`, `dawn`, `dusk` |
| `preview_cloud_coverage` | `50` | 0–100% |

Rozpoznawane stany: `sunny`, `clear-night`, `partlycloudy`, `cloudy`, `rainy`, `pouring`, `snowy`, `snowy-rainy`, `fog`, `lightning`, `lightning-rainy`, `windy`, `windy-variant`, `hail`, `exceptional`.

Do zwykłej pracy użyj `preview_weather: off` i `preview_time: auto`. Edytor udostępnia tymczasowy podgląd scen, bez potrzeby zmieniania encji.

## Diagnostyka

W edytorze karty rozwiń **Diagnostyka na żywo**. Wyświetlane są m.in. źródło danych, pogoda, scena, pora dnia, zachmurzenie i położenie Słońca.

Nie używaj przestarzałych pól `target_path`, `target_paths` ani `glass_tint`: v1.0.0 usuwa je podczas normalizacji konfiguracji. Wtyczka działa na widok, w którym jest umieszczona.
