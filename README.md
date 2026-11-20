# Dynamic Weather Background

Dynamiczne, animowane tło widoku **Home Assistant Lovelace**, reagujące na aktualną pogodę, zachmurzenie i położenie Słońca.

**Wersja źródłowa:** 1.0.1 · **Język edytora:** polski · **Licencja:** MIT · **Zależności:** brak.

> Wersja 1.0.0 to punkt wyjścia projektu, odtworzony z działającego zasobu Lovelace Home Assistant.

## Możliwości

- Tło przypisane do konkretnego widoku, w którym umieszczono kartę; bez globalnego wpływu na wszystkie pulpity.
- Sceny dnia, nocy, świtu i zmierzchu na podstawie `sun.sun`.
- Reakcja na encję `weather.*`: chmury, deszcz, śnieg, grad, mgła, wiatr i burze.
- Dwuwarstwowe animowane chmury i regulacja ich szybkości oraz widoczności.
- Efekty wyglądu innych kart: **none, glass, frosted, soft**.
- Ustawienia jakości (**high / balanced / battery**) i animacji (**auto / reduced / off**).
- Interaktywny edytor wizualny, symulacja pogody i panel diagnostyczny.
- Domyślnie ukryta karta sterująca (`hide_card: true`), widoczna podczas edycji.

## Instalacja przez Marketplace / HACS

1. Dodaj adres `https://github.com/elminpl/dynamic-weather-background` jako **własne repozytorium Dashboard/Plugin** w Marketplace lub HACS. Repozytorium musi być dostępne dla Twojej instalacji; publikacja publiczna ułatwia instalację innym.
2. Zainstaluj wtyczkę. W razie potrzeby przeładuj stronę przeglądarki.
3. Dodaj nową kartę do wybranego widoku i wybierz **Dynamic Weather Background**, lub użyj edytora YAML.
4. Wskaż istniejącą encję `weather.*` i `sun.sun`.

Nie dodawaj jednocześnie dwóch instancji tej karty w tym samym widoku. Jeżeli w HA masz już starszy zasób inline, zapoznaj się z [instrukcją migracji](docs/MIGRATION.md) **przed** instalacją kolejnej kopii.

### Ręczna instalacja

Skopiuj [`dist/dynamic-weather-background.js`](dist/dynamic-weather-background.js) do `/config/www/dynamic-weather-background.js`. W zasobach dashboardu dodaj moduł JavaScript o URL `/local/dynamic-weather-background.js` i odśwież stronę. **Nie dodawaj podwójnego wpisu zasobu**, jeżeli instalację obsługuje HACS/Marketplace.

### Minimalna karta

```yaml
type: custom:dynamic-weather-background
entity: weather.twoja_pogoda
sun_entity: sun.sun
hide_card: true
```

Zamień `weather.twoja_pogoda` na rzeczywiste `entity_id` z Home Assistant. Pozostałe opcje mają wartości domyślne.

## Dokumentacja

- [Wszystkie parametry](docs/CONFIGURATION.md)
- [Migracja z zasobu inline](docs/MIGRATION.md)
- [Przykład konfiguracji](examples/lovelace.yaml)
- [Historia zmian](CHANGELOG.md)

## Zasady działania

Wtyczka odczytuje istniejące encje Home Assistant — **nie odpytuje zewnętrznego serwisu pogody**. Częstotliwość aktualizacji informacji pogodowych zależy od zainstalowanej integracji pogodowej. Animacja działa lokalnie w przeglądarce; preferencja systemowa ograniczenia ruchu jest respektowana.

## Rozwój i zgłoszenia

Zgłoszenia błędów: [GitHub Issues](https://github.com/elminpl/dynamic-weather-background/issues). Przy zgłoszeniu podaj wersję Home Assistant, wersję wtyczki, przeglądarkę, ustawienia `animation` i `performance` oraz opis problemu. Nie dołączaj tokenów ani prywatnych danych instancji.

## Wydania

Zmiany trafiają do sekcji **Niewydane** w [historii zmian](CHANGELOG.md). Wydanie przygotowujemy po zebraniu i sprawdzeniu zmian. Na GitHubie workflow **Wydanie wtyczki** uruchamia się ręcznie z gałęzi `main`. Wybierz `patch` dla poprawek, `minor` dla zgodnych wstecz nowych funkcji albo `major` dla zmian niezgodnych wstecz. Workflow zwiększa numer w module i README, przenosi wpisy do nowej sekcji w changelogu oraz publikuje tag i wydanie z plikiem JavaScript.

## Licencja

MIT — zobacz [LICENSE](LICENSE).
