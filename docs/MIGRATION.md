# Migrating from an inline resource

The project originated from an inline Lovelace module.

1. Back up the dashboard configuration and card settings. Save a copy of the original inline JavaScript.
2. Verify that the existing card uses `custom:dynamic-weather-background` and works.
3. Download the module through Marketplace, HACS, or the manual installation method. Both modules register the same custom element, so use a single version.
4. Switch the dashboard resource to the new JavaScript module once it is available and remove the old inline entry.
5. Hard-refresh the browser, open the card editor, and check the diagnostics and background in the same view.
6. Use the temporary preview to test different weather conditions and times of day.

**Rollback.** Replace the new dashboard resource with the original inline module, then reload the page. Keep your weather and sun entities.

Publishing files on GitHub leaves your existing Home Assistant installation unchanged.

---

# Migracja z inline resource do repozytorium

Ta instalacja została odtworzona z istniejącego modułu inline w zasobach Lovelace. Nie zmieniaj aktywnej konfiguracji bez kopii.

1. Zrób kopię konfiguracji dashboardu i ustawień karty. Zachowaj także kopię oryginalnego inline JavaScript.
2. Sprawdź, czy Twoja karta używa typu `custom:dynamic-weather-background` i działa poprawnie.
3. Zainstaluj repozytorium przez Marketplace/HACS albo ręcznie. **Nie uruchamiaj na stałe dwóch wersji modułu** — mogą rejestrować ten sam custom element.
4. Przełącz zasób dashboardu na nowy moduł JavaScript, usuwając stary wpis inline dopiero, gdy nowy plik jest już dostępny.
5. Odśwież przeglądarkę z pominięciem cache, otwórz edytor karty i sprawdź diagnostykę oraz tło w tym samym widoku.
6. Przetestuj zmianę pory dnia i warunków pogodowych przez tymczasowy podgląd.

**Powrót:** usuń nowy zasób, przywróć oryginalny inline i odśwież przeglądarkę. Nie trzeba zmieniać ani usuwać encji pogody i Słońca.

Repozytorium zawiera działający kod przeniesiony ze źródła inline, z numerem wersji zmienionym na 1.0.0. Samo dodanie plików na GitHub **nie zmienia nic** w istniejącym Home Assistant.
