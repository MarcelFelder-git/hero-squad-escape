# 🦸 Hero Squad – Escape from The Glitch

Escape-Room-Browserspiel für **Englisch Klasse 6** (Tag der offenen Tür).
1–3 Spieler*innen an einem Gerät · ca. 20 Minuten · 5 Räume · läuft komplett offline im Browser.

## Auf dem iPad spielen (am einfachsten)

1. Doppelklick auf **`iPad-Server-starten.bat`** (beim ersten Mal werden die Pakete installiert, ca. 1 Minute).
2. Fragt Windows nach der Firewall → **„Zugriff zulassen“**.
3. Im Fenster erscheint eine Zeile `Network: http://192.168.…:4173` → genau diese Adresse auf dem iPad in Safari eintippen.
   iPad und PC müssen im **selben WLAN** sein. Das Fenster offen lassen, solange gespielt wird.
4. Optional: Safari → Teilen → **„Zum Home-Bildschirm“** → Spiel startet im Vollbild.

Klappt es nicht? Häufigste Ursachen: Windows stuft das Netzwerk als „Öffentlich“ ein (dann blockt die Firewall –
in den Windows-Netzwerkeinstellungen auf „Privat“ stellen) oder das Schul-WLAN trennt Geräte voneinander
(dann einen Hotspot vom PC/Handy nutzen oder die `dist/`-Version auf einen Webserver legen).

## Starten (Entwicklung)

```bash
npm install
npm run dev        # Entwicklungsserver, auch im WLAN erreichbar (--host)
npm run build      # statische Version in dist/
npm run preview    # gebaute Version testen
```

Der Ordner `dist/` kann auf jeden beliebigen Webserver kopiert werden (Schulserver, GitHub Pages,
Netlify …). Es gibt **kein Backend**: Der Spielstand liegt im `localStorage` des Geräts.

**iPad-Tipp:** Seite in Safari öffnen → Teilen → „Zum Home-Bildschirm“ → läuft dann im Vollbild.

## Ablauf

| Raum | Thema | Rätsel |
|---|---|---|
| 1 · The ID Lab | Wortschatz *friends & heroes* | Kabel verbinden (EN ↔ DE) · Spion per Personenbeschreibung finden (*tall, curly, glasses, braces …*) |
| 2 · The Power Generator | Simple present | *Spot the grammar bug* (*doesn't goes*, *Do Lina …*) · Sätze/Fragen aus Wortblöcken bauen (mit Fallen-Block) |
| 3 · The Time Vault | Simple past | Tresor-Räder mit unregelmäßigen Verben · Lückentext im Tagebuch (*didn't see*, *Did … hear?*) |
| 4 · The Radio Room | Question words | Fragewörter zu Zeugenaussagen · Lese-Rätsel → Funkfrequenz-Code |
| 5 · The Main Gate | alles gemischt | Endkampf gegen The Glitch (Spieler kommen reihum dran) · Passwort **TEAM** aus Vokabel-Lücken |

- **Hints:** pro Rätsel 2 Stufen (kleiner Tipp / fast die Lösung), kosten ein paar Punkte.
- **📖 Hero Field Glossary:** komplette Vokabelliste (Unit 2, Topic 1+2, unregelmäßige Verben, Grammatik-Spickzettel), durchsuchbar, mit Vorlesefunktion.
- **🔊 Vorlesen:** Sätze werden mit der Systemstimme (en-GB) vorgelesen.
- **Superkräfte:** Speedster (−1 min Endzeit), Mind-Hacker (1. Tipp pro Raum gratis), Time-Bender (1. Fehler pro Raum zählt nicht), Shield-Guardian (Fehler im Endkampf gratis), Gadget-Genius (+20 Punkte pro Raum).
- **Kein Game Over:** Nach ca. 20 Minuten wird der Timer nur orange. Am Ende gibt es Zeit, Punkte, 1–3 Sterne und einen Rang.

## Für Lehrkräfte / Betreuer

- **Lehrkräfte-Menü:** 5× schnell auf das **HS-Logo** oben links tippen (iPad) oder `Strg`+`Shift`+`L`.
  Dort: Aufgabe/Raum überspringen, direkt zu einem Raum springen, Mission beenden, alles zurücksetzen.
  Außerdem wird die Lösungshilfe des aktuellen Rätsels angezeigt.
- **Nächste Gruppe:** Button **↻** oben rechts (mit Sicherheitsabfrage) oder „Neue Mission“ auf dem Abschluss-Screen.
- **Versehentlich neu geladen?** Kein Problem: Der Spielstand (Helden, Raum, Punkte, Zeit) wird automatisch gespeichert.
  Nur das gerade offene Rätsel beginnt von vorn.

## Inhalte anpassen

Alle Texte liegen getrennt vom Code:

- `src/data/puzzles.ts` – alle Rätselinhalte (bei Auswahl-Optionen ist immer die **erste** die richtige; sie werden im Spiel gemischt)
- `src/data/rooms.ts` – Story-Texte, Hints, Team-Rollen pro Rätsel
- `src/data/vocab.ts` – Glossar / Vokabelliste
- `src/data/heroOptions.ts` – Superkräfte, Farben, Namensgenerator

## Technik

React 19 · TypeScript · Vite · reines CSS · SVG-Grafiken im Code · Sounds per Web Audio API (keine Audiodateien) · keine externen Schriften oder Server.

```
src/
  game/        Zustand (Reducer), Speicherung, Punkte & Superkräfte
  data/        Inhalte (Räume, Rätsel, Vokabeln, Helden-Optionen)
  audio/       Sound-Synth & Vorlesen
  components/  Topbar, Glossar, Lehrkräfte-Menü, SVG-Art (Helden, Glitch, Szenen)
  screens/     Start, Spielerwahl, Helden-Creator, Briefing, Raum, Abschluss
  puzzles/     die 10 Rätsel-Komponenten
```
