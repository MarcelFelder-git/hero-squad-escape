# 🦸 Hero Squad – Escape from The Glitch (v2)

Escape-Room-Browserspiel für **Englisch Klasse 6** (Tag der offenen Tür).
1–3 Spieler*innen an einem Gerät · ca. 20–25 Minuten · 8 Level · vom normalen Kind zum Superhelden.

**Live:** https://hero-squad-escape.vercel.app

## Ablauf am Tag der offenen Tür

| Schritt | Was | Seite |
|---|---|---|
| 1. Intro | Comic-Story auf dem Beamer (iPad spiegeln), mit Publikumsfragen und Countdown | `/presenter` (PIN **4242**) |
| 2. Arbeitsblatt | Geschichte lesen, A/B/C ankreuzen, Codes im QR-Raster schwarz malen → mit dem iPad scannen | `/worksheet` (drucken) |
| 3. iPads | Der QR-Code öffnet das Spiel mit „ACCESS GRANTED“. 8 Level, nach jedem Level bringt eine Rakete Ausrüstung | `/` |
| 4. Finale | Jedes fertige Team erscheint live auf dem Beamer, am Ende Button **🎉 Finale** | `/hall` |

Die Links zu allen Seiten stehen auch im Lehrkräfte-Menü.

### Story und Überraschungen im Presenter

Ablauf: Titel → Hero City (die Helden stellen sich vor) → der Glitch klaut die Superkräfte → Publikumsfrage →
**Überraschung 1** → Star Girls Idee → Helden-Schwur → Mission → Publikumsfrage → **Überraschung 2** → Countdown.
Keine der Überraschungen kommt im Spiel vor (Hack und Anruf bleiben fürs iPad geheim).

- **Überraschung 1 – Scanner-Drohne:** Eine Glitch-Drohne fliegt herein („Who is there?“) und scannt den Raum mit einem Laser:
  **„FREEZE!“** – alle müssen 6 Sekunden still stehen. Ergebnis: „Kids: LOTS – Heroes: 0. Kids can't stop me!“ → Echo: „He is wrong!“
  Läuft automatisch (ca. 20 s), danach **Next**.
- **Helden-Schwur:** Alle stehen auf, linke Hand hoch, sprechen Echo 3 Sätze nach (je ein Klick). Die Hero-Power füllt sich → „HERO RECRUITS!“
- **Überraschung 2 – Passwort-Schloss:** Ein Vorhängeschloss fällt auf den Bildschirm: „Four letters – it's what you want to be!“
  Die Klasse rät und buchstabiert auf Englisch **H-E-R-O** (pro Klick ein Buchstabe) → Schloss springt auf → Countdown.

## Die 8 Level

| Level | Thema | Aufgaben | Belohnung |
|---|---|---|---|
| 1 · The ID Lab | Wortschatz | Kabel verbinden · Spion finden · **Vocab Blitz** EN→DE mit Combo | 🎭 Maske |
| 2 · Power Generator | Simple past | Grammar bugs · Sätze bauen | 🦸 Anzug |
| 3 · Hero Radio 101.5 | Simple past: Fragen & Kurzantworten | **Überraschung: Tablet gehackt!** Bugs zerdrücken · **Stumme Radio-Show** (der Glitch hat den Ton geklaut): pro Anrufer die richtige Antwort im Chat wählen, dann true / false / not in the text – ganz ohne Ton, damit 15 iPads nicht durcheinander reden | 🧤 Handschuhe |
| 4 · Time Vault | Simple past | Tresor · Tagebuch · **Fragemaschine** (Fragen aus Stichwörtern) | 🥾 Stiefel |
| 5 · Lights Out! | Reading | **Überraschung: Videoanruf vom Glitch → Stromausfall.** Lesen mit Finger-Taschenlampe, pro Lückensatz das richtige Wort aus 3 wählen – gefundene Wörter leuchten im Dunkeln, jede richtige Antwort macht ein Licht an | 🔋 Gürtel |
| 6 · Radio Room | Question words | Fragewörter · Funkfrequenz | 🧣 Cape |
| 7 · Vocab Academy | Wortschatz | **Vocab Blitz** DE→EN · **Spelling Lab** · **Brief-Lückentext** mit Wortkasten | ⚡ Superkraft |
| 8 · The Final Showdown | alles | Endkampf · **Wendung: Glitch wird Freund** · **Helden-Steckbrief** (he/she/they, has/have, is/are) · offizieller Endscreen | 🚀 Fliegen |

Die neuen Aufgaben üben die **Formate** der Klassenarbeit Unit 2 (true/false/not in the text, Lesen mit Lücken,
Simple-past-Fragen aus Stichwörtern, Personenbeschreibung) – mit komplett neuen Inhalten.
Nur Vokabeln aus der Vokabelliste.

Abschluss: Heldenkarten mit Steckbrief, Sterne, Zeit → automatisch in die **Hall of Heroes**. Bonus: **Hero Run**
(Jump'n'Run mit dem eigenen Helden).

## Hall of Heroes live schalten (Supabase, kostenlos)

Ohne Supabase funktioniert alles – die Hall zeigt dann aber nur Teams **vom selben Gerät** („OFFLINE“).
Für die Live-Anzeige von allen iPads:

1. Auf https://supabase.com ein kostenloses Projekt anlegen (Region **Frankfurt / eu-central-1**).
2. **SQL Editor → New query** → Inhalt von `supabase/hall.sql` einfügen → **Run**.
3. **Project Settings → API**: `Project URL` und den `anon public` Key kopieren.
4. In Vercel → Projekt → **Settings → Environment Variables** eintragen und neu deployen:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = anon key
5. Für lokale Tests dieselben zwei Zeilen in eine Datei `.env.local` schreiben.

Gespeichert werden nur Fantasie-Heldennamen, Avatar-Farben, Steckbrief-Sätze, Punkte und Zeit – keine Fotos, keine echten Namen.
Nach dem Tag: in Supabase `delete from public.hall;` ausführen (oder das Projekt löschen).
In der Hall: 🧹 blendet alle bisherigen Teams aus (z. B. nach dem Testen).

## QR-Arbeitsblatt

- `/worksheet` im Browser öffnen → **Drucken** (A4, Seite 1+2 für die Kinder, Seite 3 = Lösung für Lehrkräfte).
- Lösung: **1A 2B 3C 4A 5A 6B 7C 8A**. Ein einzelner Fehler wird von der QR-Fehlerkorrektur noch verziehen,
  bei mehreren Fehlern funktioniert der Code nicht. Ein unausgemaltes Blatt lässt sich nicht scannen.
- Das Raster wird mit `node scripts/make-qr-layout.mjs` erzeugt und dabei automatisch geprüft
  (gelöst = lesbar, leer = nicht lesbar, ein Fehler = noch lesbar).

## Auf dem iPad spielen ohne Internet

1. Doppelklick auf **`iPad-Server-starten.bat`**.
2. Windows-Firewall → **„Zugriff zulassen“** (Netzwerk muss in Windows auf „Privat“ stehen).
3. Die angezeigte Adresse `http://192.168.…:4173` auf dem iPad in Safari öffnen (gleiches WLAN).

## Für Lehrkräfte / Betreuer

- **Lehrkräfte-Menü:** 5× schnell auf das **HS-Logo** oben links tippen oder `Strg`+`Shift`+`L`.
  Aufgabe/Level überspringen, zu Level springen, Mission beenden, zurücksetzen, Links zu Presenter / Hall / Arbeitsblatt.
- **Nächste Gruppe:** **↻** oben rechts oder „Neue Mission“ am Ende.
- Spielstand wird automatisch gespeichert (Neuladen ist kein Problem).
- **Aufgaben-Sets A/B:** Gleiche Aufgabentypen, andere Sätze und Wörter (nur Wörter aus der Vokabelliste). Die Sets wechseln
  automatisch pro Gruppe und Gerät ab; im Lehrkräfte-Menü unter „Aufgaben-Set“ umstellbar.
- **„Lock him up!“** beim Glitch: Ein Käfig fällt, der Glitch weint, Echo fragt „Is that what real heroes do?“ – kein Punktabzug,
  die Gruppe muss sich für Freundschaft entscheiden.
- **Bonus: Hero Run** (nach Level 8): ◀ ▶ laufen, **JUMP** springen (länger halten = höher). Auf Bugs springen, ⚡ sammeln,
  lila Boxen von unten anstoßen, 5 Herzen, 2 Checkpoints, Ziel = Hero HQ.

## Entwicklung

```bash
npm install
npm run dev        # Entwicklungsserver
npm run build      # Typecheck + statische Version in dist/
```

Inhalte: `src/data/levels.ts` (Level, Hints, Rollen), `src/data/puzzles.ts` (v1-Aufgaben), `src/data/puzzles2.ts` (neue Aufgaben,
Arbeitsblatt-Geschichte), `src/data/vocab.ts` (Glossar). Bei Auswahl-Optionen ist immer die **erste** richtig (wird gemischt).

React 19 · TypeScript · Vite · reines CSS · SVG-Grafiken · Web-Audio-Sounds · Sprachausgabe des Geräts · optional Supabase.
