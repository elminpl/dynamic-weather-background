# Migrating from an inline resource

**Documented version:** 1.1.0

The project originated from an inline Lovelace module.

1. Back up the dashboard configuration and card settings. Save a copy of the original inline JavaScript.
2. Verify that the existing card uses `custom:dynamic-weather-background` and works.
3. Follow the [installation guide](../README.md#install-through-marketplace-or-hacs) to obtain the module.
4. Once the new file is available, switch to the new resource and remove the old inline entry. If Marketplace or HACS has already registered the new resource, use that entry. Keep one active resource for the card.
5. Hard-refresh the browser, open the card editor, and check the diagnostics and background in the same view.
6. Use the temporary preview to test different weather conditions and times of day.

**Rollback.** Replace the new dashboard resource with the original inline module, then reload the page. Keep your weather and sun entities.

Publishing files on GitHub leaves your existing Home Assistant installation unchanged.

---

# Migracja z modułu inline

**Wersja opisana w dokumencie:** 1.1.0

Projekt powstał na podstawie modułu inline w zasobach Lovelace.

1. Zrób kopię konfiguracji dashboardu i ustawień karty. Zachowaj także kopię oryginalnego inline JavaScript.
2. Sprawdź, czy Twoja karta używa typu `custom:dynamic-weather-background` i działa poprawnie.
3. Pobierz moduł zgodnie z [instrukcją instalacji](../README.md#instalacja-przez-marketplace--hacs).
4. Gdy nowy plik będzie dostępny, przełącz zasób pulpitu i usuń stary wpis inline. Jeśli Marketplace lub HACS zarejestrował już nowy zasób, użyj tego wpisu. Zachowaj jeden aktywny zasób karty.
5. Odśwież przeglądarkę z pominięciem cache, otwórz edytor karty i sprawdź diagnostykę oraz tło w tym samym widoku.
6. Przetestuj zmianę pory dnia i warunków pogodowych przez tymczasowy podgląd.

**Powrót do poprzedniej wersji.** Zastąp nowy zasób oryginalnym modułem inline i odśwież przeglądarkę. Zachowaj encje pogody i Słońca.

Publikacja plików na GitHubie nie aktualizuje istniejącej instalacji Home Assistant.
