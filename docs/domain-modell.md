# Domain Model
## 1. Employee
Diese Klasse repräsentiert einen Mitarbeiter, der in Rahmen der Dienstplanung für verschiedene
Schichten eingeplant werden kann.
Diese Klasse enthält verschiedene Attributen nämlich:
#### Attribute
| **Variablen**            | **Typ**             | **Beschreibung**                                                                                                               |
|--------------------------|---------------------|--------------------------------------------------------------------------------------------------------------------------------|
| ``name``                 | ``String``          | Name des Mitarbeiters                                                                                                          |
| ``qualifikation``        | ``String``          | Wird verwendet, um zu prüfen, ob der Mitarbeiter für eine bestimmte Station eingesetzt werden darf.                            |
| ``wochenStunden``        | ``Long``            | Vertraglich bzw. organisatorisch vorgesehene Wochenarbeitszeit des Mitarbeiters.                                               |
| ``wunschSchicht``        | ``String``          | Bevorzugte Schichtart des Mitarbeiters. Die Angabe wird bei der Berücksichtigung der individuellen Schichtpräferenz verwendet. |
| ``bevorzugtMitarbeiter`` | ``List<Employee>``  | Liste von Mitarbeitern, mit denen der Mitarbeiter bevorzugt gemeinsam eingesetzt werden möchte.                                |
| ``wunschFreiTage``       | ``List<DayOfWeek>`` | Liste der Wochentage, an denen der Mitarbeiter möglichst keinen Dienst erhalten möchte.                                        |
| ``ruheTime``             | ``Duration``        | Vorgesehene Ruhezeit zwischen zwei Diensten. Aktuell auf 11 Stunden festgelegt.                                                |
| ``maximumWorkingTime``   | ``Duration``        | Maximale Arbeitszeit innerhalb eines Tages. Aktuell auf 10 Stunden festgelegt.                                                 |

### Role im Planungssystem

``EmployeeDto`` ist ein ****Problemfakt**** des Planungssystems. Die Mitarbeiter selbst werden vom Solver nicht verändert.

Stattdessen entscheidet der Solver, welchem Mitarbeiter ein ``AssignmentDto`` zugeordnet wird.

Damit bildet ``EmployeeDto`` eine der zentralen Ressourcen der Dienstplanung und stellt
gleichzeitig verschiedene Informationen bereit, die von den Hard und Soft Constraints verwendet werden.

---
## 2. Station
Diese Klasse repräsentiert eine Station bzw. einen Einsatzbereich, in dem Mitarbeiter während eines Dienstes eingesetzt werden.

Eine Station definiert insbesondere, wie viele Mitarbeiter benötigt werden und welche Qualifikation für den Einsatz erforderlich ist.
#### Attribute
| **Variablen**                   | **Typ**     | **Beschreibung**                                                                |
|---------------------------------|-------------|---------------------------------------------------------------------------------|
| ``name``                        | ``String``  | Bezeichnung der Station                                                         |
| ``benoetigteAnzahlMitarbeiter`` | ``Integer`` | Anzahl der Mitarbeiter, die für die Station benötigt werden.                    |
| ``benoetigtQualifikation``      | ``String``  | Qualifikation, die ein Mitarbeiter für den Einsatz auf dieser Station benötigt. |

### Role in Planungssystem

``StationDto`` beschreibt eine feste Ressource also einen Einsatzort innerhalb des Planungssystems.

Die Station selbst wird durch den Solver nicht verändert. Sie stellt Informationen bereit, anhand derer geprüft wird:

1. Ob genügend Mitarbeiter zugeordnet wurden und
2. ob die zugeordneten Mitarbeiter über die erforderliche Qualifikation verfügen.

Damit wird ``StationDto`` insbesondere con Hard Constraints **Minimum Mitarbeiter** und **Qualifikation Conflict** verwendet.

---
## 3. Timeslot
Diese Klasse repräsentiert einen konkreten Zeitraum, in dem ein Dienst stattfindet. Ein Timeslot definiert dabei sowohl den Wochentag und die genaue
Uhrzeit als auch die Art des Dienstes.
#### Attribute
| **Variablen** | **Typ**       | **Beschreibung**                                               |
|---------------|---------------|----------------------------------------------------------------|
| ``dayOfWeek`` | ``DayOfWeek`` | Wochentag, an dem der Dienst stattfindet.                      |
| ``startTime`` | ``LocalTime`` | Beginn des Dienstes                                            |
| ``endTime``   | ``LocalTime`` | Ende des Dienstes                                              |
| ``type``      | ``Type``      | Art des Dienstes, beispielsweise Früh-, Spät- oder Nachtdienst |

### Role in Planungssystem

Ein ``TimeslotDto`` ist ein **Problemfakt** des Planungssystems. Der Timeslot wird während der Optimierung nicht 
verändert. Stattdessen wird ein bestehender Timeslot einem ``AssignmentDto`` zugeordnet.

Damit definiert der Timeslot, wan ein Assigment stattfindet und welche Art von Dienst durchgeführt wird.

Zusammen mit ``StationDto`` und ``EmployeeDto`` bildet der Timeslot einen wesentlichen Bestandteil eines ``AssignmentDto``.

---
## 4. Assignment
Dies repräsentiert eine konkrete Zuordnung eines Mitarbeiters zu einer Station und einem bestimmten Timeslot.

Eine Assignment ist eine Planning Entity. Der Solver verändert während der Optimierung die Zuordnung des Mitarbeiters, um einen
möglichst guten Dienstplan zu erzeugen.

#### Attribute
| **Varaiblen** | **Typ**      | **Beschreibung**                          |
|---------------|--------------|-------------------------------------------|
| ``employee``  | ``EmployeeDto`` | Mitarbeiter, der dem Dienst zuordnet wird |
| ``statio``    | ``StationDto``  | Station, auf der der Dienst stattfindet   |
| ``timeslot``  | ``TimeslotDto`` | Zeitraum und Art des Dienstes             |

**Role im Planungssystem**

Die ``AssignmentDto`` bildet damit die Verbindung zwischen den drei zentralen Domänenobjekten:

```
Assigment
  |-employee -> wird vom Solver geplant
  |-station -> fest vorgegeben
  |_timeslot -> fest vorgegeben
```
Die Constraints greifen auf diese Zuordnung zurück. Beispielsweise wird geprüft:
* ob der Zugewiesene Mitarbeiter die benötigte Qualifikation der Station besitzt,
* ob derselbe Mitarbeiter gleichzeitig mehreren Diensten zugeordnet ist,
* ob die tägliche Arbeitszeit eingehalten wird.

Damit ist ``AssignmentDto`` das zentrale Bindeglied zwischen den **Problem Facts** (``EmployeeDto``, ``StationDto``,
``TimeslotDto``) und der eigentlichen Optimierung.

---
## 5. Schedule
Die Klasse ``Schedule`` stellt die vollständige Planungslösung des Dienstplanungssystems dar. 
Sie ist mit ``@PlanningSolution`` annotiert und bildet damit das zentrale Objekt für den Timefold Solver.
Sie enthält sowohl die festen Eingangsdaten der Planung als auch die Planning Entities, deren Zuordnung vom Solver optimiert wird.
#### Aufbau

```
Schedule
|
|-- Assignment[]
|       |--Employee <- planning variable
|       |--Station
|       |__Timeslot
|
|--Employee[]
|--Station[]
|--Timeslot[]
|
|__HardSoftScore
```
#### Planning Entity Collection
``@PlanningEntityCollectionProperty``  
List\<Assignment> assigmentList = new ArrayList\<>(); 

``asigmnentList`` enthält alle ``AssignmentDto``-Objekte, die vom Solver geplant werden.
Durch ``@PlanningEntityCollectionProperty`` wird Timefold mitgeteilt, dass diese Objekte Planning Entities sind.

Da ``Assignment.employee`` als ``@PlanningVariable`` deklariert ist, kann der Solver die Mitarbeiterzuordnung
dieser Assignments während der Optimierung verändern.
#### Employee- Value Range
@valueRangeProvider  
@problemFactCollectionProperty  
List\<Employee> employees;

Die Liste ``employees`` enthält alle verfügbaren Mitarbeiter.  
``@problemFactCollectionProperty`` kennzeichnet die Mitarbeiter als feste Fakten der Planung. Die Mitarbeiter
selbst werden vom Solver nicht verändert.

Zusätzlich stellt ``@valueRangeProvider`` diese Mitarbeiter als mögliche Werte für die Planning Variable
``Assignment.employee`` bereit.

Dadurch kann der Solver beispielsweise:  
Assignment 1 → Employee A  
Assignment 2 → Employee B  
Assignment 3 → Employee C

verschiedene Mitarbeiterzuordnungen ausprobieren und anhand der Constraints bewerten.
#### Stationen
@problemFactCollectionProperty  
List\<Station> stations;

``stations`` enthält alle Stationen, die für die Planung zur Verfügung stehen. Die Stationen sind 
**Problem Facts** und werden während der optimierung nicht verändert. Die gelieferte Informationen werden
von den Constraints verwendet.
#### Timeslots
@problemFactCollectionProperty  
List\<Timeslot> timeslots;

``timeslots`` enthält alle verfügbaren Zeiträume (Dienste). Auch Timeslots sind feste **Problem Facts**.  
Dies werden von den Constraints verwendet, um zum beispiel Arbeitszeiten, Überschneidungen, Wochenenddienste
und Nachtdienste zu überprüfen.
#### Planning Score
@plannigScore  
private HardSoftScore score;

Der ``HardSoftScore`` bewertet die Qualität einer gefundenen Planung. Der Score besteht aus zwei Teilen:  
**Hard Score + Soft Score**.  
Der Solver versucht daher zunächst eine Lösung, ohne Hard_constraint-Verletzungen zu finden und optimiert 
anschließend die Soft-Constraint-Verletzungen.  
**Vor allem ``Schedule`` verbindet alle Bestandteile des Planungsmodells**.

