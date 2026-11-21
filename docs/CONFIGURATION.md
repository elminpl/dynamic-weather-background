# Configuration — Dynamic Weather Background

The tables list the defaults. You can also use the visual card editor in Home Assistant.

## Data sources and behavior

| Parameter | Default | Description |
|---|---|---|
| `entity` | `weather.forecast_dom` | A `weather.*` entity available in your installation |
| `sun_entity` | `sun.sun` | Sun entity |
| `hide_card` | `true` | Hide the card outside edit mode |

## Clouds and effects

| Parameter | Default | Allowed values |
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

`cloud_speed` and `cloud_speed_secondary` control how long the layers take to move across the view. Lower numbers make clouds move faster.

## Card appearance

| Parameter | Default | Values |
|---|---:|---|
| `card_effect` | `none` | `none`, `glass`, `frosted`, `soft` |
| `card_background_transparency` | `0` | 0–100% |
| `fade_card_content` | `false` | `true/false` |
| `card_content_transparency` | `0` | 0–100% |
| `glass_blur` | `10` | 0–24 px |
| `glass_shine` | `35` | 0–100% |
| `card_border` | `true` | `true/false` |
| `card_shadow` | `35` | 0–100% |

`card_effect: none` preserves the standard card appearance, including transparency and shadows.

## Animation, quality, and preview

| Parameter | Default | Values |
|---|---|---|
| `animation` | `auto` | `auto`, `reduced`, `off` |
| `performance` | `balanced` | `high`, `balanced`, `battery` |
| `preview_weather` | `off` | `off` or a weather condition listed below |
| `preview_time` | `auto` | `auto`, `day`, `night`, `dawn`, `dusk` |
| `preview_cloud_coverage` | `50` | 0–100% |

Supported conditions: `sunny`, `clear-night`, `partlycloudy`, `cloudy`, `rainy`, `pouring`, `snowy`, `snowy-rainy`, `fog`, `lightning`, `lightning-rainy`, `windy`, `windy-variant`, `hail`, `exceptional`.

For normal use, set `preview_weather: off` and `preview_time: auto`. The editor can preview scenes without changing entities.

## Diagnostics

Expand **Live diagnostics** in the card editor to see the data source, weather, scene, time of day, cloud cover, and sun position.

Configuration normalization removes the obsolete `target_path`, `target_paths`, and `glass_tint` options. The card applies to the view where you place it.

---

# Konfiguracja — Dynamic Weather Background

Poniżej opisano wartości domyślne. Kartę można skonfigurować również wizualnie w interfejsie Home Assistant.

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
