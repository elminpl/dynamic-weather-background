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
