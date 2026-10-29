# Dienstplanung

Ein webbasiertes Dienstplanungssystem zur automatisierten Erstellung und Optimierung von Mitarbeitereinsatzplänen.

Das Projekt verwendet **Spring Boot** als Backend und **Timefold Solver**, um Mitarbeiter automatisch passenden Diensten und Stationen 
zuzuordnen. Dabei werden sowohl zwingende Anforderungen (**Hard Constraints**) als auch persönliche bzw. organisatorische Präferenzen 
(**Soft Constraints**) berücksichtigt.

Die Datenbank (**PostgreSQL**) ist die einzige Quelle der Wahrheit: Mitarbeiter, Stationen, Timeslots und Assignments werden dort 
gespeichert, der Solver liest sie von dort und schreibt das Ergebnis wieder zurück.

Das System verfügt über ein **React (TypeScript) Frontend**, das eine interaktive Planung, Live-Solver-Updates, Drag & Drop mit
Echtzeit-Validierung und vollständiges CRUD ermöglicht.

---
## Screenshots
|            Login            | Dashboard (Admin-Planner)-View  |
|:---------------------------:|:-------------------------------:|
| [Login](docs/LoginPage.png) | [Dashboard](docs/dashboard.png) |

|              Planungsansicht (Employee)               |             Planungsansicht (Stationen)             |
|:-----------------------------------------------------:|:---------------------------------------------------:|
| [Planung Employee View](docs/planungEmployeeView.png) | [Planung Station View](docs/planungStationView.png) |

|    Monatsplaner & PDF Export    |             Dashboard (Viewer)-View              |
|:-------------------------------:|:------------------------------------------------:|
| [Monatplan](docs/monatplan.pdf) | [Dashboard Viewer](docs/dashboardViewerView.png) |


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

| Bereich       | Technologie                                                                  |
|---------------|------------------------------------------------------------------------------|
| **Backend**   | Java 21, Spring Boot, Spring Security,Timefold Solver, Hibernate/JPA         |
| **Frontend**  | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, dnd-kit |
| **Datenbank** | PostgreSQL, Flyway (Migrationen)                                             |
| **Testing**   | JUnit, Timefold ConstraintVerifier, Vitest (Frontend)                        |
| **DevOps**    | Docker, Docker Compose, GitHub Actions (CI/CD), GHCR                         |


Voraussetzung ist **Java > 21** (siehe `pom.xml` → `<java.version>`). Spring Boot 3.x und Timefold 2.x unterstützen beide Versionen. Noch
dazu **Node.js > 20**.

---

## 3. Architektur

Das Projekt ist strikt in **Backend** und **Frontend** getrennt:

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
    
 └── dienstplan-frontend/ (React App)
    ├── src/api/         # Axios Clients (mit JWT Interceptor)
    ├── src/hooks/       # TanStack Query Hooks
    ├── src/pages/       # Seiten (Dashboard, Plan, Monat, CRUD, Login)
    └── src/features/    # Feature-Komponenten (Grid, DnD, Forms)
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

## 6. REST API
Das Backend stellt eine REST API zur Verfügung. Die Datenbank ist die
einzige Quelle der Wahrheit; der Client sendet **keine** Planungsdaten
mehr im Request-Body.

| **Methode** | **Endpunkt**                              | **Beschreibung**                              | **Role**               |
|-------------|-------------------------------------------|-----------------------------------------------|------------------------|
| `POST`      | `/dientsplan/auth/login`                  | JWT Login                                     | Public                 |
| `POST`      | `/dienstplan/solve`                       | Startet den Timefold Solver                   | ADMIN, PLANNER         |
| `GET`       | `/dienstplan/solve{jobId}`                | Ruft den Solver-Status ab                     | ADMIN, PLANNER, VIEWER |
| `POST`      | `/dienstplan/assignment/validate-move`    | Prüft Drag & Drop auf Constraints             | ADMIN, PLANNER         |
| `POST`      | `/dienstplan/assignment/{id}/move-to-day` | Verschiebt eine Schicht auf einen anderen Tag | ADMIN, PLANNER         |
| `GET`       | `/dienstplan/employees`                   | Alle Mitarbeiter abrufen                      | Alle Auht              |
| `POST`      | `/dienstplan/solve/{jobId}/stop/`         | Beendet den Solver-Job                        | ADMIN, PLANNER         |


---

## 7. Datenbank & Sicherheit

Das Projekt verwendet **PostgreSQL** als Datenbank.

Die Datenbankstruktur wird mit **Flyway** verwaltet.

### 7.1 Schema (übersicht)
| **Tabelle**    | **Spalten**                                                                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `app_user`     | `id`, `username`, `password_hash`, `role`, `enabled`                                                                                                          |
| ``employee``   | ``id (PK, String)``,``name``,``qualification``,``wochen_stunden``,``wunsch_schicht VARCHAR []``,``bevorzugte_mitarbeiter TEXT[]``,``wunsch_frei_tage TEXT[]`` |
| ``station``    | ``id (PK, String)``,``name``,``anzahl_benoetigte_mitarbaiter``,``benoetigte_qualification``                                                                   |
| ``timeslot``   | ``id (PK, String)``, ``name``, ``day_of_week``, ``start_time``,``end_time``,``type``                                                                          |
| ``assignment`` | ``id (PK, String)``, ``station_id (FK)``,``timeslot_id (FK)``,``employee_id (FK, nullable)``                                                                  |
Die konkreten Spaltentypen und Constraints sind in den Flyway-Migrationen dokumentiert.

### 7.2 Lösch-Verhalten
* **Station & Timeslot**: ``ON DELETE CASCADE``. Wenn eine Station gelöscht wird, werden alle zugehörigen Assignments gelöscht.
* **Employee**: ``ON DELETE RESTRICT``: Ein Mitarbeiter kann nicht gelöscht werden, solange er noch Dienste hat.

---
### 7.3 Sicherheit (JWT & RBAC)
Die API ist stateless. Nach dem Login erhält der Client ein JWT, das im ``Authorization: Bearer`` header mitgesendet wird. Es gibt drei Rollen
: ``ADMIN``(Vollzugriff), `PLANNER`(Planen/Solver starten, keine Stammdaten ändern) und `VIEWER`(Nur Lesen).

---
## 8. CI/CD Pipeline
Das Projekt nutzt **GitHub Actions** für Continuous Integration und Continuous Deployment
(`.github/workflows/ci-cd.yml`).

1. **Backend-Test**: Startet eine PostgreSQL-Datenbank, führt Flyway-Migrationen aus und
testet den Solver und API mit JUnit.
2. **Frontend-Test**: Führt ``npm run lint`` und Vitest-Tests aus.
3. **Build & Push**: Wenn beide Tests grün sind, werden die Docker-Images (Frontend & Backend)
gebaut und die **GitHub Container Registry (GHCR)** gepusht.

---

## 9. Lokale Installation & Start
**Voraussetzungen**: Docker & Docker Compose installiert.
Das gesamte System (Datenbank, Backend, Frontend) ist vollständig dockerisiert.
Du musst nichts manuell kompilieren.

1. Repository klonen
```bash
git clone <repository-url>
cd dienstplanung
```
2. Alles starten

```bash
docker compose up -d --build
```
3. Öffne den browser: ``http://localhost`` (Nginx serviert das Frontend auf Port 80 
und proxied die API an das Backend)

**Login (Dev)**: username: ``admin`` or `planner` or `viewer`,  
Password:`admin` für `admin`, `planner` für `planner`, und `viewer` für `viewer`.
---

## 10. Dokumentation

Weitere technische Informationen befinden sich in den folgenden Dokumenten:

### Domain Model

[`domain-modell.md`](docs)

### Planning Model

[`planning-modell.md`](docs)

### Constraints

[`constraints.md`](docs)

Beschreibung der Hard- und Soft-Constraints und ihrer Bedeutung für die Optimierung.

---

## 11. Projektstatus

**Aktueller Stand (V3.0)**

* [x] Domain Model & Planning Model
* [x] Hard & Soft Constraints
* [x] Datenbankintegration (Lesen und Schreiben)
* [x] REST Controller (CRUD & Solver)
* [x] Frontend UI (Dashboard, Grid-Ansichten, CRUD-Formulare)
* [x] Live-Solver Polling & Echtzeit-Score
* [x] JWT Authentication & Role-Based Access Control (RBAC)
* [x] Drag & Drop mit Echtzeit-Validierung (Ruhezeit)
* [x] Multi-Shift Präferenzen (Listen statt Enum)
* [x] Monatsplaner & PDF Export (A4)
* [x] Schichten über Mitternacht
* [x] CI/CD Pipeline (GitHub Actions)
* [x] Docker Compose Deployment (Frontend + Backend + DB)
* [x] Backend & Frontend Tests
* [ ] Deployment (VPS / Cloud)
* [ ] User Management UI (Admin Panel)
* [ ] 

---
