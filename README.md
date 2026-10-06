# Dienstplanung

Ein webbasiertes Dienstplanungssystem zur automatisierten Erstellung und Optimierung von Mitarbeitereinsatzplänen.

Das Projekt verwendet **Spring Boot** als Backend und **Timefold Solver**, um Mitarbeiter automatisch passenden Diensten und Stationen 
zuzuordnen. Dabei werden sowohl zwingende Anforderungen (**Hard Constraints**) als auch persönliche bzw. organisatorische Präferenzen 
(**Soft Constraints**) berücksichtigt.

Die Datenbank (**PostgreSQL**) ist die einzige Quelle der Wahrheit: Mitarbeiter, Stationen, Timeslots und Assignments werden dort 
gespeichert, der Solver liest sie von dort und schreibt das Ergebnis wieder zurück.

---

## 1. Ziel des Projekts

Ziel des Projekts ist es, einen Dienstplan für einen definierten Planungszeitraum automatisch zu erstellen.

Dabei soll der Solver beispielsweise berücksichtigen:

* Welche Mitarbeiter verfügbar sind
* Welche Qualifikation für eine Station erforderlich ist
* Wie viele Mitarbeiter pro Station benötigt werden
* Welche Schichten zu welchen Zeiten stattfinden
* Ob sich Arbeitszeiten überschneiden
* Wie viele Stunden ein Mitarbeiter arbeiten darf
* Welche Schichten ein Mitarbeiter bevorzugt
* Welche Tage ein Mitarbeiter möglichst frei haben möchte
* Welche Mitarbeiter bevorzugt zusammenarbeiten
* Anforderungen an Ruhezeiten und Wochenenddienste

Das System versucht zunächst, alle **Hard Constraints** einzuhalten und anschließend die Qualität der Planung anhand der 
**Soft Constraints** zu verbessern.

---

## 2. Technologien

| Technologie     | Verwendung                      |
| --------------- | ------------------------------- |
| Java            | Programmiersprache              |
| Spring Boot     | Backend / REST API              |
| Timefold Solver | Optimierung der Dienstplanung   |
| PostgreSQL      | Persistenz                      |
| Flyway          | Datenbankmigrationen            |
| Maven           | Dependency Management und Build |
| JUnit           | Tests                           |
| Mockito         | Unit Tests                      |

Voraussetzung ist **Java > 21** (siehe `pom.xml` → `<java.version>`). Spring Boot 3.x und Timefold 2.x unterstützen beide Versionen.

---

## 3. Architektur

Das Projekt ist in mehrere Bereiche aufgeteilt:

```text
src/main/java/dev/ach/dienstplanung
│
├── controller/
│   └── REST API
│
├── service/
│   └── Geschäftslogik
│
├── dto/
│   └── Domain-Objekte für den Solver
│
├── entity/
│   └── JPA-Entities (Persistenz)
│
├── mapper/
│   └── Entity ↔ DTO Konvertierung
│
├── repository/
│   └── Spring Data JPA Repositories
│
├── planning/
│   └── Solver-Konfiguration und Planungsmodell (Schedule)
│
|--
└── constraint/
    └── Constraints
```
**Wichtig**: ``Entity`` und ``DTO`` sind bewusst getrennte Klassen.
* **Entities** (``entity``) sind JPA-Klassen mit ``@Entity``, ``@Id`` und Beziehungen.
Sie werden nur für die Persistenz verwendet.
* **DTOs**(``dto``) sind die Domain-Objekte, die der Solver kennt.
* Sie tragen die Timefold-Annotation (``@PlanningEntity``, ``@PlanningVariable``, ``PlanningId``,
``@ProblemFactCollectionProperty``, ``@ValueRangeProvider``).
* **Mapper** (``mapper``)`konvertieren zwischen beiden Welten.

Diese Trennung verhindert, dass JPA-Annotationen und Solver-Annotationen
sich gegenseitig stören.

Die genaue Beschreibung des Domain- und Planungsmodells befindet sich
in den separaten Dokumentationen:
* [``domain-modell.md``](docs)
* [``planning-modell.md``](docs)
* [``constraints.md``](docs)

----
## 4. Planungsmodell

Das zentrale Planungsmodell besteht aus:
```text
Schedule
│
├── Employees
├── Stations
├── Timeslots
└── Assignments
      │
      ├── Employee  ← Planning Variable
      ├── Station
      └── Timeslot
```
`Employee`, `Station` und `Timeslot` sind feste Bestandteile der Planung.

Die `Assignment`-Objekte werden vom Timefold Solver verändert. Insbesondere wird die Zuordnung eines Mitarbeiters zu einem Assignment optimiert.

Damit bildet `Assignment` die Verbindung zwischen den festen Planungsdaten und der eigentlichen Optimierung.

### 4.1 Identität der Objekte
Eine zentrale Regel des Planungsmodells:

Die ``EmployeeDto``-, ``StationDto``- und ``TimeslotDto``-Instanzen,
die in ``Schedule.employee``, ``Schedule.stations`` und 
``Schedule.timeslots`` liegen, **müssen dieselben Objekte** sein,
die von den ``AssignmentDto``-Instanzen referenziert werden.

Warum das wichtig ist:
* Timefold vergleicht Problem Facts (Mitarbeiter, Stationen, Timeslots)
über **Objektidentität**, nicht über ``equals()``.
* Würde der Loader für jedes Assignment eine **neue** ``StationDto``-Instanz
erzeugen, würde der Solver mehrere unterschiedliche Fakten sehen, die deiselbe
Station repräsentieren.
* Soft-Constraints, die Mitarbeiter, Stationen oder Timeslots über
* ``==`` vergleichen, würden dann **still** fehlschlagen - ohne
Fehlermeldung, nur mit falschem Score.

Aus diesem Grund:
* Baut ``ScheduleServiceImpl.load()`` **einmal** die Listen
``employees``, ``stations``, ``timeslots``.
* Baut daraus ``Map<String, StationDto>`` und ``Map<String, TimeslotDto>``.
* Übergibt diese Maps an ``AssignmentMapper.mapToAssignmentDto(...)``,
der **ausschließlich** aus den Maps liest und **keine neuen Instanzen erzeugt**.
### 4.2 Planungs-IDs
Die IDs der Domain-Objekte sind **vom Client vorgegeben Strings**
(Z.B. ``"emp-1"``, ``"st-1"``, ``"ts-1"``, ``"assign-1"``). Sie
dienen gleichzeitig als:
* Primärschlüssel in der Datenbank (``@Id``).
* ``@planningId`` in Timefold.

Das ist eine bewusste Vereinfachung. Sollte später eine vom 
backend generierte ID benötigt werden, müsste man:
* Eine generierte ``Long``-Spalte in der Entity einführen.
* Den Solver-identifier daraus ableiten(Z.B. ``"assign_" + entity.getId()``).
* Eine Zuordnung zwischen beiden IDs im Mapper pflegen.

Eine ausführliche Beschreibung befindet sich in [``domain-model.md``](docs) und
[``planning-modell.md``](docs).

---
## 5. Constraints

Die Qualität einer Planung wird durch Constraints bestimmt.

### Hard Constraints

Hard Constraints müssen erfüllt sein. Eine Verletzung führt zu 
einer Verschlechterung des Hard Scores.

Beispiele:

* Mitarbeiter darf nur auf Stationen eingesetzt werden, für die er qualifiziert ist.
* Ein Mitarbeiter darf nicht gleichzeitig zwei Dienste übernehmen.
* Die benötigte Anzahl von Mitarbeitern pro Station muss erfüllt werden.
* Die maximale tägliche Arbeitszeit darf nicht überschritten werden.
* Die erforderliche Ruhezeit zwischen Diensten muss eingehalten werden.

### Soft Constraints

Soft Constraints beschreiben Wünsche und Optimierungsziele.

Beispiele:

* Bevorzugte Schicht berücksichtigen
* Wunschfreie Tage berücksichtigen
* Bevorzugte Mitarbeiter gemeinsam einsetzen
* Nachtarbeit möglichst gleichmäßig verteilen
* Wochenenddienste fair verteilen
* Aufeinanderfolgende Nachtdienste begrenzen

Eine vollständige Beschreibung befindet sich in [`constraints.md`](docs).
**Wichtig für Constraint-Implementierungen**: alle Listen-Getter
(``getWunschFreitage()``, ``getBevorzugtMitarbeiter()``, ...)
können theoretisch ``null`` zurückgeben. Constraints müssen daher
**null-sicher** formuliert sein, z.B.:

```text
List<DayOfWeek> freitage = employee.getWunschFreitag();
if(freitage == null || !freitage.contains(day)) return;
```
Zusätzlich sorgt der Mapper dafür, dass ``null``-Werte aus der 
Datenbank als leere Listen (``List.of()``) im DTO landen.

Eine vollständige Beschreibung befindet sich in [``constraints.md``](docs)

----

## 6. REST API
Das Backend stellt eine REST API zur Verfügung. Die Datenbank ist die
einzige Quelle der Wahrheit; der Client sendet **keine** Planungsdaten
mehr im Request-Body.

### Dienstplan starten
```http request
POST http://localhost:8080/dienstplan/solve
```
Kein Request-Body. Der Server lädt alle Mitarbeiter, stationen,
Timeslots und Assignments aus der Datenbank, startet den Solver
und gibt eine ``jobId`` von type ``UUID`` zurück.

### Planung abrufen
```http request
GET http://localhost:8080/dienstplan/solve/{jobId}
```
gekürzt Antwort
```json
{
  "jobId": "3e4c1f8a-9b2d-4e7f-8a1b-2c3d4e5f6a7b",
  "schedule": {
    "assigmentList": [
      {
        "id": "assign-1",
        "employee": { "id": "emp-1", "name": "Alice Smith", "...": "..." },
        "station":  { "id": "st-1",  "name": "Station A" },
        "timeslot": { "id": "ts-1",  "dayOfWeek": "MONDAY" }
      }
    ],
    "employees": [ "..." ],
    "stations":  [ "..." ],
    "timeslots": [ "..." ],
    "score": "0hard/-4soft"
  },
  "score": "0hard/-4soft",
  "isSolving": false
}

```
### Planung abbrechen
```http request
POST http://localhost:8080/dienstplan/solve/{jobId}/stop/
```
Beendet den Solver-job vorzeitig.

## 7. Ablauf der Planung
```
                          ┌──────────────────────┐
                          │     PostgreSQL       │
                          │  employees           │
                          │  stations            │
                          │  timeslots           │
                          │  assignments         │
                          └──────────┬───────────┘
                                     │
                            (1) ScheduleService.load()
                                     │
                                     ▼
Client ──POST /api/solve──▶  DienstPlanningsService
                                     │
                                     ▼
                            Schedule (Problem)
                                     │
                                     ▼
                            Timefold Solver
                                     │
                          ┌──────────┴───────────┐
                          ▼                      ▼
                 (2) best solution     (3) ScheduleWriterService
                     aktualisieren          .writeBack()
                          │                      │
                          │                      ▼
                          │             UPDATE assignment
                          │             SET employee_id = ...
                          │                      │
                          └──────────┬───────────┘
                                     │
                                     ▼
                            Schedule (Lösung)
                                     │
                                     ▼
Client ◀──GET /api/solve/{jobId}──── ScheduleResponse
```
1. Der Client ruft ``POST /dienstplan/solve`` ohne Body auf.
2. ``ScheduleService.load()`` liest alle Fakten und Assignment aus der
Datenbank und baut ein ``Schedule``-Objekt.
3. Der Solver läuft im Hintergrund. Bei jeder neuen besten Lösung:
*wird die aktuelle Lösung im Speicher(``scheduleMap``) aktualisiert,
* wird ``ScheduleWriterService.writeBack(...)`` aufgerufen, um die
Mitarbeiterzuordnung in der Tabelle ``assignment`` zu speichern.
4. Der Client pollt ``GET /dienstplan/solve/{jobId}``, bis ``isSolving == false``.
5. Das Endergebnis ist sowohl in der Antwort als in der Datenbank verfügbar.

---

## 8. Score

Die Qualität einer Planung wird mit einem `HardSoftScore` bewertet.

```text
Hard Score / Soft Score
```

Dabei gilt grundsätzlich:

1. Hard Constraints haben Priorität.
2. Erst wenn die Hard Constraints erfüllt sind, wird die Qualität anhand der Soft Constraints optimiert.

Eine mögliche Lösung sieht beispielsweise so aus:

```text
0hard/0soft
```

Das bedeutet, dass keine Hard- oder Soft-Constraint-Verletzungen vorliegen.

---

## 9. Datenbank

Das Projekt verwendet **PostgreSQL** als Datenbank.

Die Datenbankstruktur wird mit **Flyway** verwaltet.

Migrationen befinden sich unter:

```text
src/main/resources/db/migration/
```

Flyway führt die vorhandenen Migrationen beim Start der Anwendung aus.

### 9.1 Schema (übersicht)
| **Tabelle**    | **Spalten**                                                                                                                                        |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| ``employee``   | ``id (PK, String)``,``name``,``qualification``,``wochen_stunden``,``wunsch_schicht``,``bevorzugte_mitarbeiter TEXT[]``,``wunsch_frei_tage TEXT[]`` |
| ``station``    | ``id (PK, String)``,``name``,``anzahl_benoetigte_mitarbaiter``,``benoetigte_qualification``                                                        |
| ``timeslot``   | ``id (PK, String)``, ``name``, ``day_of_week``, ``start_time``,``end_time``,``type``                                                               |
| ``assignment`` | ``id (PK, String)``, ``station_id (FK)``,``timeslot_id (FK)``,``employee_id (FK, nullable)``                                                       |
Die konkreten Spaltentypen und Constraints sind in den Flyway-Migrationen dokumentiert.

### 9.2 Schreib-Semantik

Der Solver schreibt bei **jedem neuen besten Zwischenergebnis**
in die Datenbank. Das bedeutet:
* Zwischenstände werden überschrieben.
* Nur der letzte Schreibvorgang zählt.
* ``assignment.employee_id`` enthält nach Abschluss den final zugewiesenen Mitarbeiter.
Falls ein Assignment vom Solver **keinem** Mitarbeiter zugewiesen
* werden konnte, wird ``employee_id`` auf ``NULL`` gesetzt. Das
* macht den Endzustand eindeutig: eine ``NULL``-Zuordnung
bedeutet "nicht zugewiesen".

---

## 10. Tests

Das Projekt enthält Tests für die verschiedenen Komponenten.

Insbesondere werden getestet:

* REST API
* Services
* Constraints
* Solver
* Erstellung und Verarbeitung eines Dienstplans

Die Tests können beispielsweise mit Maven ausgeführt werden:

```bash
./mvnw test
```

Unter Windows:

```bash
mvnw.cmd test
```

---

## 11. Voraussetzungen
Für die lokal Entwicklung werden benötigt:
* Java 21 oder mehr (siehe ``pom.xml``)
* Maven (oder Maven Wrapper ``mvnw``/``mvnw.cmd``)
* PostgreSQL (oder Docker mir Docker Compose)
* Git
----
## 12. Anwendung starten
```bash
git clone <repository-url>
cd dienstplanung
```
### 12.1 Datenbank starten (Docker)

Falls eine ``compose.yml`` im Repository vorhanden ist:
```bash
docker compose up -d
```
### 12.2 Konfiguration
Die Verbindungsdaten werden in ``src/main/resources/application.properties``
konfiguriert.

---

## 13. Dokumentation

Weitere technische Informationen befinden sich in den folgenden Dokumenten:

### Domain Model

[`domain-modell.md`](docs)

Beschreibung der zentralen Domänenklassen:

* Employee
* Station
* Timeslot
* Assignment
* Schedule

### Planning Model

[`planning-modell.md`](docs)

Beschreibung der Timefold-Struktur und der Rolle von:

* `@PlanningSolution`
* `@PlanningEntity`
* `@PlanningVariable`
* Problem Facts
* Value Ranges

### Constraints

[`constraints.md`](docs)

Beschreibung der Hard- und Soft-Constraints und ihrer Bedeutung für die Optimierung.

---

## 14. Projektstatus

**Aktueller Stand**

* [x] Domain Model
* [x] Planning Model
* [x] Hard Constraints
* [x] Soft Constraints
* [x] DTOs
* [x] Services
* [x] REST Controller
* [x] Solver-Integration
* [x] Datenbankintegration (Lesen und Schreiben)
* [x] Tests
* [ ] Erweiterung der REST API
* [ ] Verbesserung der Solver-Performance
* [ ] Frontend
* [ ] Deployment

---

## 15. Ziel

Das Projekt soll schrittweise zu einer vollständigen Anwendung für die automatisierte und optimierte Dienstplanung erweitert werden.

Der Schwerpunkt liegt dabei auf einer klaren Trennung zwischen:

```text
Domain Model
      ↓
Planning Model
      ↓
Constraints
      ↓
Solver
      ↓
REST API
      ↓
Client
```

Dadurch bleibt das System erweiterbar und neue Planungsregeln können hinzugefügt werden, ohne die grundlegende Architektur verändern zu müssen.
