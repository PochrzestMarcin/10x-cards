# Integracja Astro z Chrome DevTools Workspaces

## Co to jest Chrome DevTools Workspaces?

Chrome DevTools Workspaces to funkcja eksperymentalna w Astro 5.13+, która umożliwia **bezpośrednią edycję plików źródłowych z poziomu Chrome DevTools**. Zmiany wprowadzone w DevTools są automatycznie zapisywane na dysku, eliminując potrzebę przełączania się między edytorem a przeglądarką.

## Konfiguracja

### 1. Włączenie w Astro

Funkcja została już włączona w pliku `astro.config.mjs`:

```javascript
export default defineConfig({
  // ... inne ustawienia
  experimental: {
    chromeDevtoolsWorkspace: true,
  },
});
```

### 2. Uruchomienie serwera deweloperskiego

Uruchom serwer deweloperski Astro:

```bash
npm run dev
```

### 3. Konfiguracja Chrome DevTools

1. **Otwórz Chrome DevTools** (F12 lub Ctrl+Shift+I / Cmd+Option+I)

2. **Przejdź do Sources (Źródła)**
   - Kliknij zakładkę "Sources" w DevTools

3. **Dodaj Workspace**
   - W lewym panelu znajdź zakładkę "Filesystem"
   - Kliknij "+ Add folder to workspace"
   - Wybierz główny katalog swojego projektu Astro: `C:\10xDevsProject\10xdevs-project`

4. **Udziel uprawnień**
   - Chrome poprosi o potwierdzenie dostępu do plików
   - Kliknij "Allow" (Zezwól)

5. **Mapowanie plików**
   - Chrome automatycznie zmapuje pliki źródłowe z serwera deweloperskiego do plików na dysku
   - Gdy Astro wykryje połączenie, pliki będą synchronizowane

## Jak używać

### Edycja plików w czasie rzeczywistym

1. W zakładce **Sources** → **Filesystem** zobaczysz strukturę projektu
2. Otwórz dowolny plik (np. `src/pages/index.astro`)
3. Wprowadź zmiany bezpośrednio w DevTools
4. **Zmiany zostaną automatycznie zapisane na dysku**
5. Astro automatycznie przeładuje stronę (Hot Module Replacement)

### Debugowanie ze zmianami na dysku

- Ustaw breakpointy w kodzie
- Wprowadź zmiany w DevTools
- Zmiany są trwałe i zapisane w plikach źródłowych
- Nie tracisz zmian po odświeżeniu strony

## Zalety

✅ **Szybszy workflow** - edytuj kod bezpośrednio w przeglądarce  
✅ **Natychmiastowy feedback** - widzisz zmiany w czasie rzeczywistym  
✅ **Debugowanie + edycja** - łącz debugowanie z modyfikacją kodu  
✅ **Trwałe zmiany** - wszystkie edycje są zapisywane na dysku  
✅ **HMR** - Hot Module Replacement działa normalnie

## Ograniczenia

⚠️ **Funkcja eksperymentalna** - może zawierać błędy  
⚠️ **Tylko Chrome/Edge** - działa tylko w przeglądarkach opartych na Chromium  
⚠️ **Wymaga uprawnień** - musisz udzielić Chrome dostępu do systemu plików

## Wskazówki

1. **Backup projektu** - przed rozpoczęciem pracy upewnij się, że masz backup (git)
2. **Sprawdź mapowanie** - upewnij się, że Chrome poprawnie zmapował pliki
3. **Formatowanie** - zmiany w DevTools mogą nie zachować formatowania kodu
4. **Użyj Prettier** - po edycji w DevTools uruchom Prettier, aby zachować spójne formatowanie

## Przykładowy workflow

1. Uruchom `npm run dev`
2. Otwórz `http://localhost:3000` w Chrome
3. Otwórz DevTools (F12)
4. Dodaj folder projektu do Workspace
5. Edytuj pliki w zakładce Sources
6. Zobacz zmiany natychmiast w przeglądarce
7. Kontynuuj pracę w swoim zwykłym edytorze - zmiany są zsynchronizowane!

## Rozwiązywanie problemów

### Pliki nie są mapowane automatycznie

- Upewnij się, że flaga `chromeDevtoolsWorkspace: true` jest włączona
- Zrestartuj serwer deweloperski
- Sprawdź, czy dodałeś właściwy katalog główny projektu

### Zmiany nie są zapisywane

- Sprawdź uprawnienia w Chrome (Settings → Privacy → File System)
- Upewnij się, że pliki nie są tylko do odczytu
- Sprawdź, czy Chrome ma dostęp do katalogu

### Workspace nie wyświetla się

- Odśwież DevTools (Ctrl+R w DevTools)
- Zamknij i otwórz ponownie DevTools
- Sprawdź konsolę Chrome pod kątem błędów

## Dodatkowe zasoby

- [Astro Docs - Experimental Flags](https://docs.astro.build/en/reference/experimental-flags/)
- [Chrome DevTools Workspaces](https://developer.chrome.com/docs/devtools/workspaces/)
- [Astro Dev Server Reference](https://docs.astro.build/en/reference/cli-reference/)

---

**Uwaga**: Ta funkcja jest eksperymentalna i może ulec zmianie w przyszłych wersjach Astro.
