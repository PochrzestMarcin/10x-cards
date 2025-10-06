# Dokument wymagań produktu (PRD) - FlashGen

## 1. Przegląd produktu

FlashGen to aplikacja webowa umożliwiająca tworzenie fiszek edukacyjnych z wykorzystaniem sztucznej inteligencji. Produkt rozwiązuje problem czasochłonności manualnego tworzenia wysokiej jakości materiałów do nauki metodą spaced repetition.

### 1.1 Nazwa produktu
FlashGen - Generator Fiszek Edukacyjnych

### 1.2 Grupa docelowa
- Studenci potrzebujący efektywnych narzędzi do nauki
- Pracownicy biurowi uczący się nowych umiejętności lub materiałów zawodowych

### 1.3 Cel produktu
Umożliwienie użytkownikom szybkiego i efektywnego tworzenia fiszek edukacyjnych poprzez automatyczne generowanie ich z tekstu źródłowego z wykorzystaniem AI, przy zachowaniu możliwości manualnej edycji i zarządzania.

### 1.4 Technologia
- Frontend: Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui
- Backend: Supabase z PostgreSQL
- AI: Model GPT-5 z niską temperaturą
- Hosting: Platforma webowa (bez aplikacji mobilnych w MVP)

### 1.5 Czas realizacji
2-3 tygodnie kalendarzowe (projekt poboczny)

## 2. Problem użytkownika

### 2.1 Opis problemu
Manualne tworzenie wysokiej jakości fiszek edukacyjnych jest procesem bardzo czasochłonnym. Użytkownicy muszą:
- Przeczytać i przeanalizować materiał źródłowy
- Wyodrębnić kluczowe informacje
- Sformułować pytania i odpowiedzi w zwięzły sposób
- Ręcznie wprowadzić każdą fiszkę do systemu

Ten proces zniechęca do korzystania z efektywnej metody nauki jaką jest spaced repetition, mimo udowodnionej skuteczności tej techniki.

### 2.2 Konsekwencje problemu
- Zmarnowany czas, który mógłby być poświęcony na samą naukę
- Zniechęcenie do tworzenia kompleksowych zestawów fiszek
- Rezygnacja z metody spaced repetition na rzecz mniej efektywnych form nauki
- Nieoptymalne wykorzystanie czasu na naukę

### 2.3 Rozwiązanie
FlashGen automatyzuje proces tworzenia fiszek poprzez:
- Generowanie fiszek z tekstu źródłowego za pomocą AI
- Możliwość szybkiej recenzji i edycji wygenerowanych propozycji
- Zachowanie opcji manualnego tworzenia i edycji fiszek
- Integrację z algorytmem powtórek dla efektywnej nauki

## 3. Wymagania funkcjonalne

### 3.1 System kont użytkowników (US-001 do US-004)
- Rejestracja nowego użytkownika z emailem i hasłem
- Logowanie do systemu
- Zmiana hasła użytkownika
- Usuwanie konta użytkownika i powiązanych fiszek
- Autentykacja i autoryzacja użytkowników
- Row Level Security (RLS) w bazie danych

### 3.2 Manualne zarządzanie fiszkami (US-005 do US-009)
- Tworzenie fiszek z polem "przód" i "tył" (tylko tekst)
- Edycja istniejących fiszek poprzez modal
- Usuwanie fiszek
- Wyświetlanie listy fiszek użytkownika z paginacją ("Moje fiszki")
- Wyszukiwanie fiszek po treści

### 3.3 Generowanie fiszek przez AI (US-010 do US-014)
- Wklejanie tekstu źródłowego o długości 1000-10000 znaków
- Walidacja długości tekstu przed wysłaniem do API
- Automatyczne generowanie maksymalnie 20 propozycji fiszek
- Synchroniczny proces generowania (< 10 sekund dla 1000 słów)
- Wyświetlanie propozycji fiszek do recenzji

### 3.4 System recenzji wygenerowanych fiszek (US-015 do US-017)
- Przeglądanie każdej propozycji fiszki osobno
- Akceptacja fiszki bez zmian
- Edycja fiszki przed akceptacją
- Odrzucenie niepotrzebnej fiszki
- Zbiorcze zapisywanie zaakceptowanych fiszek

### 3.5 System powtórek (US-018 do US-019)
- Integracja fiszek z gotowym algorytmem powtórek
- Sesja nauki z wykorzystaniem algorytmu spaced repetition

### 3.6 Infrastruktura i monitoring (US-021 do US-022)
- Przechowywanie logów generowania w dedykowanej tabeli
- Rejestrowanie czasu generowania, liczby fiszek wygenerowanych i liczby zaakceptowanych
- Walidacja danych wejściowych

### 3.7 Wymagania prawne i ograniczenia:
- Dane osobowe użytkowników i fiszek przechowywane zgodnie z RODO
- Prawo do wglądu i usunięcia danych (konto wraz z fiszkami na wniosek użytkownika)

## 4. Granice produktu

### 4.1 Co NIE wchodzi w zakres MVP

4.1.1 Zaawansowane algorytmy
- Własny, zaawansowany algorytm powtórek (jak SuperMemo, Anki)
- Adaptacyjne algorytmy uczenia się
- Gamifikacja i system punktów

4.1.2 Import i eksport
- Import wielu formatów (PDF, DOCX, itp.)
- Eksport fiszek do innych formatów
- Synchronizacja z innymi aplikacjami

4.1.3 Funkcje społecznościowe
- Współdzielenie zestawów fiszek między użytkownikami
- Publiczne biblioteki fiszek
- System komentarzy i ocen

4.1.4 Platformy mobilne
- Aplikacje mobilne (iOS, Android)
- Progressive Web App (PWA)
- Tryb offline

4.1.5 Zaawansowane zarządzanie treścią
- Kategoryzacja fiszek
- Zaawansowane filtrowanie
- Tagi i etykiety
- Fiszki multimedialne (obrazy, audio, wideo)

4.1.6 Integracje zewnętrzne
- Integracje z platformami edukacyjnymi
- API publiczne
- Wtyczki do przeglądarek

### 4.2 Ograniczenia techniczne MVP

4.2.1 Limity systemu
- Tekst wejściowy: minimum 1000, maksimum 10000 znaków
- Maksymalna liczba generowanych fiszek: 20 na sesję
- Tylko tekstowe fiszki (przód i tył)
- Jedna sesja generowania na raz (synchroniczna)

4.2.2 Uproszczenia
- Podstawowa obsługa błędów API (ogólny komunikat)
- Prosta wyszukiwarka i paginacja (bez zaawansowanych filtrów)
- Standardowe praktyki bezpieczeństwa (bez zaawansowanych mechanizmów)

## 5. Historyjki użytkowników

### 5.1 Zarządzanie kontem

#### US-001: Rejestracja użytkownika
- ID: US-001
- Tytuł: Rejestracja nowego użytkownika
- Opis: Jako nowy użytkownik, chcę móc zarejestrować konto używając adresu email i hasła, aby móc korzystać z aplikacji.
- Kryteria akceptacji:
  - Formularz rejestracji wymaga podania emaila i hasła
  - Email musi być w poprawnym formacie
  - Hasło musi mieć minimum 8 znaków
  - System waliduje unikalność adresu email
  - Po pomyślnej rejestracji użytkownik jest automatycznie zalogowany
  - W przypadku błędu wyświetlany jest odpowiedni komunikat

#### US-002: Logowanie użytkownika
- ID: US-002
- Tytuł: Logowanie do systemu
- Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do systemu używając emaila i hasła, aby uzyskać dostęp do moich fiszek.
- Kryteria akceptacji:
  - Formularz logowania wymaga podania emaila i hasła
  - System weryfikuje poprawność danych logowania
  - Po pomyślnym logowaniu użytkownik jest przekierowany do głównego widoku aplikacji
  - W przypadku błędnych danych wyświetlany jest komunikat o błędzie
  - Sesja użytkownika jest bezpiecznie zarządzana

#### US-003: Zmiana hasła
- ID: US-003
- Tytuł: Zmiana hasła użytkownika
- Opis: Jako zalogowany użytkownik, chcę móc zmienić swoje hasło, aby zapewnić bezpieczeństwo mojego konta.
- Kryteria akceptacji:
  - Użytkownik ma dostęp do formularza zmiany hasła w ustawieniach konta
  - Formularz wymaga podania obecnego hasła oraz nowego hasła (dwukrotnie)
  - Nowe hasło musi spełniać wymagania (minimum 8 znaków)
  - System weryfikuje poprawność obecnego hasła
  - Po pomyślnej zmianie wyświetlany jest komunikat potwierdzający
  - W przypadku błędu wyświetlany jest odpowiedni komunikat

#### US-004: Usunięcie konta
- ID: US-004
- Tytuł: Usunięcie konta użytkownika
- Opis: Jako zalogowany użytkownik, chcę móc usunąć swoje konto wraz ze wszystkimi danymi, aby mieć kontrolę nad swoimi informacjami.
- Kryteria akceptacji:
  - Użytkownik ma dostęp do opcji usunięcia konta w ustawieniach
  - System wymaga potwierdzenia akcji (np. ponowne podanie hasła)
  - Po potwierdzeniu usuwane są wszystkie dane użytkownika (konto, fiszki, logi)
  - Użytkownik jest wylogowany i przekierowany do strony głównej
  - Wyświetlany jest komunikat potwierdzający usunięcie konta

### 5.2 Manualne zarządzanie fiszkami

#### US-005: Tworzenie fiszki manualnie
- ID: US-005
- Tytuł: Manualne tworzenie nowej fiszki
- Opis: Jako zalogowany użytkownik, chcę móc ręcznie utworzyć fiszkę, wprowadzając treść dla przodu i tyłu, aby dodać własne materiały do nauki.
- Kryteria akceptacji:
  - Dostępny jest formularz tworzenia fiszki z polami "przód" i "tył"
  - Oba pola akceptują tylko tekst (bez multimediów)
  - Oba pola są wymagane (nie mogą być puste)
  - Po wypełnieniu formularza użytkownik może zapisać fiszkę
  - Nowa fiszka pojawia się na liście fiszek użytkownika
  - Wyświetlany jest komunikat potwierdzający utworzenie fiszki

#### US-006: Edycja istniejącej fiszki
- ID: US-006
- Tytuł: Edycja fiszki
- Opis: Jako zalogowany użytkownik, chcę móc edytować treść moich fiszek, aby móc poprawić lub zaktualizować informacje.
- Kryteria akceptacji:
  - Z poziomu listy fiszek użytkownik może otworzyć modal edycji
  - Modal wyświetla obecną treść przodu i tyłu fiszki
  - Użytkownik może modyfikować treść obu pól
  - Oba pola pozostają wymagane
  - Po zapisaniu zmiany są natychmiast widoczne na liście
  - Wyświetlany jest komunikat potwierdzający aktualizację

#### US-007: Usuwanie fiszki
- ID: US-007
- Tytuł: Usunięcie fiszki
- Opis: Jako zalogowany użytkownik, chcę móc usunąć niepotrzebne fiszki, aby utrzymać porządek w moich materiałach.
- Kryteria akceptacji:
  - Z poziomu listy fiszek dostępna jest opcja usunięcia
  - System wymaga potwierdzenia akcji usunięcia
  - Po potwierdzeniu fiszka jest trwale usuwana z bazy danych
  - Fiszka znika z listy użytkownika
  - Wyświetlany jest komunikat potwierdzający usunięcie

#### US-008: Przeglądanie listy fiszek
- ID: US-008
- Tytuł: Wyświetlanie listy fiszek z paginacją
- Opis: Jako zalogowany użytkownik, chcę móc przeglądać listę wszystkich moich fiszek z paginacją, aby łatwo nawigować po dużej liczbie materiałów.
- Kryteria akceptacji:
  - Lista wyświetla wszystkie fiszki należące do zalogowanego użytkownika zarówno te dodane manualnie jak i wygenerowane przez AI
  - Każda fiszka pokazuje treść przodu i tyłu
  - Lista jest podzielona na strony (paginacja)
  - Użytkownik może nawigować między stronami
  - Liczba fiszek na stronie jest zdefiniowana (np. 20)
  - Wyświetlana jest informacja o łącznej liczbie fiszek

#### US-009: Wyszukiwanie fiszek
- ID: US-009
- Tytuł: Wyszukiwanie fiszek po treści
- Opis: Jako zalogowany użytkownik, chcę móc wyszukiwać fiszki po treści, aby szybko znaleźć konkretne materiały.
- Kryteria akceptacji:
  - Dostępne jest pole wyszukiwania na liście fiszek
  - Wyszukiwanie działa po treści przodu i tyłu fiszki
  - Wyniki są wyświetlane dynamicznie podczas wpisywania
  - Pusta fraza wyszukiwania wyświetla wszystkie fiszki
  - Wyszukiwanie nie jest case-sensitive
  - Wyniki wyszukiwania również obsługują paginację

### 5.3 Generowanie fiszek przez AI

#### US-010: Wklejanie tekstu źródłowego
- ID: US-010
- Tytuł: Wprowadzanie tekstu do generowania fiszek
- Opis: Jako zalogowany użytkownik, chcę móc wkleić tekst źródłowy, aby wygenerować z niego fiszki automatycznie.
- Kryteria akceptacji:
  - Dostępne jest dedykowane pole tekstowe do wklejania materiału
  - Pole przyjmuje tekst o długości 1000-10000 znaków
  - System wyświetla licznik znaków w czasie rzeczywistym
  - Walidacja długości tekstu następuje przed wysłaniem do API
  - Jeśli tekst jest za krótki lub za długi, wyświetlany jest odpowiedni komunikat
  - Przycisk generowania jest aktywny tylko dla poprawnej długości tekstu

#### US-011: Generowanie propozycji fiszek
- ID: US-011
- Tytuł: Automatyczne generowanie fiszek przez AI
- Opis: Jako zalogowany użytkownik, chcę aby system automatycznie wygenerował propozycje fiszek z mojego tekstu, aby zaoszczędzić czas.
- Kryteria akceptacji:
  - w widoku generowania fiszek znajduje się pole tekstowe, w którym użytkownik może wkleić swój tekst.
  - Po kliknięciu przycisku "Generuj" wysyłane jest zapytanie do API modelu LLM
  - Model pracuje z niską temperaturą dla precyzyjnych wyników
  - System generuje maksymalnie 20 fiszek na sesję
  - Proces generowania trwa krócej niż 10 sekund dla tekstu o długości 1000 słów
  - Wygenerowane fiszki bazują wyłącznie na dostarczonym tekście (bez halucynacji)
  - w Przypadku problemów z API lub braku odpowiedzi modelu użytkownik zobaczy stosowny komunikat o błędzie

#### US-012: Przegląd i zatwierdzenie propozycji fiszek
- ID: US-012
- Tytuł: Prezentacja wygenerowanych fiszek
- Opis: Jako zalogowany użytkownik, chcę zobaczyć wszystkie wygenerowane propozycje fiszek, aby móc je przejrzeć i zdecydować o ich akceptacji.
- Kryteria akceptacji:
  - Po zakończeniu generowania wyświetlana jest lista propozycji pod formularzem generowania
  - Każda propozycja pokazuje treść przodu i tyłu fiszki
  - Przy każdej fiszce znajduje się przycisk pozwalający na zatwierdzenie, edycję lub odrzucenie
  - Użytkownik widzi liczbę wygenerowanych propozycji
  - Po zatwierdzeniu wybranych fiszek użytkownik może kliknąć przycisk zapisu i dodać je do bazy danych.

#### US-013: Obsługa błędów generowania
- ID: US-013
- Tytuł: Informowanie o błędach API
- Opis: Jako zalogowany użytkownik, chcę być informowany o problemach z generowaniem, aby wiedzieć co się dzieje w przypadku błędu.
- Kryteria akceptacji:
  - W przypadku błędu API wyświetlany jest ogólny komunikat o błędzie
  - Komunikat jest zrozumiały i przyjazny dla użytkownika
  - Użytkownik może spróbować ponownie wygenerować fiszki
  - Błędy są logowane w systemie dla celów diagnostycznych
  - Interfejs wraca do stanu początknego gotowego na kolejną próbę

#### US-014: Logowanie procesu generowania
- ID: US-014
- Tytuł: Rejestrowanie danych o generowaniu
- Opis: Jako właściciel produktu, chcę zbierać dane o procesie generowania fiszek, aby analizować wydajność i skuteczność AI.
- Kryteria akceptacji:
  - Każde generowanie jest zapisywane w dedykowanej tabeli logów
  - Log zawiera: ID użytkownika, czas generowania, długość tekstu, liczbę wygenerowanych fiszek
  - Log zawiera informacje o decyzjach użytkownika (akceptacja/odrzucenie/edycja)
  - Dane są zapisywane automatycznie bez interakcji użytkownika
  - Logi są dostępne do późniejszej analizy

### 5.4 Recenzja wygenerowanych fiszek

#### US-015: Akceptacja fiszki
- ID: US-015
- Tytuł: Akceptacja wygenerowanej fiszki
- Opis: Jako zalogowany użytkownik, chcę móc zaakceptować wygenerowaną fiszkę bez zmian, aby szybko dodać ją do mojej kolekcji.
- Kryteria akceptacji:
  - Przy każdej propozycji fiszki dostępny jest przycisk "Akceptuj"
  - Po kliknięciu fiszka jest oznaczana jako zaakceptowana
  - Zaakceptowana fiszka jest wizualnie wyróżniona
  - Użytkownik może zmienić decyzję przed finalnym zapisem
  - Licznik zaakceptowanych fiszek jest aktualizowany na bieżąco

#### US-016: Edycja fiszki przed akceptacją
- ID: US-016
- Tytuł: Modyfikacja wygenerowanej fiszki
- Opis: Jako zalogowany użytkownik, chcę móc edytować treść wygenerowanej fiszki przed jej zaakceptowaniem, aby dostosować ją do swoich potrzeb.
- Kryteria akceptacji:
  - Przy każdej propozycji dostępny jest przycisk "Edytuj"
  - Po kliknięciu otwiera się modal z możliwością edycji przodu i tyłu
  - Użytkownik może modyfikować treść obu pól
  - Po zapisaniu zmian fiszka jest automatycznie akceptowana
  - Zmodyfikowana fiszka jest wizualnie oznaczona jako edytowana

#### US-017: Odrzucenie fiszki
- ID: US-017
- Tytuł: Odrzucenie niepotrzebnej fiszki
- Opis: Jako zalogowany użytkownik, chcę móc odrzucić wygenerowaną fiszkę, której nie chcę dodać do swojej kolekcji.
- Kryteria akceptacji:
  - Przy każdej propozycji dostępny jest przycisk "Odrzuć"
  - Po kliknięciu fiszka jest oznaczana jako odrzucona
  - Odrzucona fiszka jest wizualnie wyróżniona (np. przygaszona)
  - Użytkownik może zmienić decyzję przed finalnym zapisem

#### US-018: Zbiorcze zapisywanie fiszek
- ID: US-018
- Tytuł: Finalizacja recenzji i zapis fiszek
- Opis: Jako zalogowany użytkownik, chcę móc zapisać wszystkie zaakceptowane fiszki jednocześnie po zakończeniu recenzji, aby efektywnie dodać je do bazy.
- Kryteria akceptacji:
  - Po przejrzeniu wszystkich propozycji dostępny jest przycisk "Zapisz zaakceptowane"
  - Kliknięcie zapisuje wszystkie zaakceptowane (i edytowane) fiszki do bazy danych
  - Odrzucone fiszki nie są zapisywane
  - Po zapisie użytkownik jest przekierowany do listy swoich fiszek
  - Wyświetlany jest komunikat z liczbą zapisanych fiszek
  - Proces recenzji kończy się i można rozpocząć nowy

### 5.5 System powtórek

#### US-019: Sesja nauki z algorytmem powtórek
- ID: US-019
- Tytuł: Wykorzystanie fiszek w systemie powtórek
- Opis: Jako zalogowany użytkownik, chcę móc uczyć się z moich fiszek używając algorytmu spaced repetition, aby efektywnie zapamiętać materiał.
- Kryteria akceptacji:
  - W widoku "Sesja nauki" algorytm przygotowuje dla mnie sesję nauki fiszek
  - Na start wyświetlany jest przód fiszki, poprzez interakcję użytkownik wyświetla jej tył.
  - Użytkownik ocenia zgodnie z oczekiwaniami algorytmu na ile przyswoił fiszkę
  - Następnie algorytm pokazuje kolejną fiszę w ramach sesji nauki

### 5.6 Bezpieczeństwo i autoryzacja

#### US-021: Kontrola dostępu do fiszek
- ID: US-021
- Tytuł: Zabezpieczenie dostępu do danych użytkownika
- Opis: Jako zalogowany użytkownik, chcę mieć pewność, że tylko ja mam dostęp do moich fiszek, aby chronić prywatność moich danych.
- Kryteria akceptacji:
  - Każda fiszka jest powiązana z kontem użytkownika
  - Row Level Security (RLS) w bazie danych ogranicza dostęp do własnych danych
  - Użytkownik widzi tylko swoje fiszki na liście
  - Użytkownik może edytować i usuwać tylko swoje fiszki
  - Próba dostępu do cudzych danych jest blokowana
  - Sesja użytkownika jest bezpiecznie zarządzana

#### US-022: Walidacja danych wejściowych
- ID: US-022
- Tytuł: Ochrona przed nieprawidłowymi danymi
- Opis: Jako właściciel produktu, chcę aby system walidował wszystkie dane wejściowe, aby zapobiec błędom i atakom.
- Kryteria akceptacji:
  - Wszystkie formularze walidują dane po stronie klienta i serwera
  - Walidacja sprawdza typ, długość i format danych
  - Nieprawidłowe dane są odrzucane z odpowiednim komunikatem
  - System jest zabezpieczony przed SQL injection i XSS
  - Hasła są bezpiecznie hashowane przed zapisem
  - Limity znaków są egzekwowane (1000-10000 dla tekstu AI, max 20 fiszek)

### 5.7 Przypadki brzegowe

#### US-023: Obsługa pustej listy fiszek
- ID: US-023
- Tytuł: Wyświetlanie komunikatu przy braku fiszek
- Opis: Jako nowy użytkownik bez fiszek, chcę zobaczyć pomocny komunikat, aby wiedzieć co dalej zrobić.
- Kryteria akceptacji:
  - Jeśli użytkownik nie ma żadnych fiszek, wyświetlany jest przyjazny komunikat
  - Komunikat zawiera sugestię utworzenia pierwszej fiszki
  - Dostępne są linki/przyciski do tworzenia fiszki manualnie lub przez AI
  - Interfejs jest przejrzysty i zachęcający do akcji

#### US-024: Obsługa długiego tekstu w fiszkach
- ID: US-024
- Tytuł: Wyświetlanie długich treści fiszek
- Opis: Jako użytkownik z długimi treściami fiszek, chcę aby były one czytelnie wyświetlane, aby móc je przeczytać bez problemów.
- Kryteria akceptacji:
  - Długie treści są odpowiednio formatowane w interfejsie
  - Tekst nie wykracza poza granice kontenera
  - Dostępne jest przewijanie dla bardzo długich treści
  - Treść pozostaje czytelna na różnych rozmiarach ekranu

#### US-025: Równoczesne sesje użytkownika
- ID: US-025
- Tytuł: Zarządzanie wieloma sesjami
- Opis: Jako użytkownik korzystający z wielu urządzeń, chcę aby moje dane były spójne, niezależnie od miejsca logowania.
- Kryteria akceptacji:
  - Użytkownik może być zalogowany na wielu urządzeniach jednocześnie
  - Zmiany w fiszkach są synchronizowane w czasie rzeczywistym lub po odświeżeniu
  - Nie występują konflikty danych między sesjami
  - Sesje są niezależnie zarządzane i bezpieczne

## 6. Metryki sukcesu

6.1 Skuteczność AI
- 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkownika (bez lub z edycją)
- Mniej niż 25% wygenerowanych fiszek jest odrzucanych

6.1 Wydajność systemu
- Czas generowania fiszek < 10 sekund dla tekstu o długości 1000 słów
- Czas generowania < 30 sekund dla maksymalnego tekstu (10000 znaków)
- Poprawne działanie operacji CRUD dla fiszek w 99.9% przypadków

