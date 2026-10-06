# Constraints
Wenn man ein Dienstplanungssystem bauen möchte, muss man unterscheiden zwischen ***Starke Constraints*** und ***Leichte Constraints***

## 1. Starke Constraints
Wenn ein Plan gegen einen starke constraint verstößt, ist dies ungültig oder nicht zulässig.
Für dies Projekt einige Constraints sind die Falle berücksichtigt, die im Arbeitsrecht geschrieben sind.
Diese Constraints können anpassen werden je nach Unternehmen zu überstimmen am bestens die Arbeitsbedingungen.
---
### - Mitarbeiterkonflikt
#### Geschäftsregel:
Ein Mitarbeiter kann nicht gleichzeitig auf zwei unterschiedliche Station eingeplant werden.
#### Umsetzung:
Ich verwende hier forEachUniquePair() Funktion, da ich zwei Assignments miteinander vergleichen muss.
Dann Joiners.equal(Assignment::getEmployee) kommt infrage, damit nur Assignments desselben Mitarbeiters vergleichen werden.
Mit filter() prüfe ich, ob beiden Timeslots am selben Tag liegen und sich zeitlich überschneiden.
Zum schluss prüfe ich, dass die beiden Assignments zu unterschiedlichen Stationen gehören.
Bei einer Verletzung wird ***HardSoftScore.ONE_HARD*** penalisiert. 
#### Beispiele:
Station A: Montag 08:00-16:00

Station B: Montag 12:00-20:00

Dies Assignment überschritten zwischen 12:00 und 16:00. Employee ist in zwei unterschiedliche Station während diese Zeitperiode dann die Constraints ist verletzt.

Aber so was verletzt nicht diese Constraint:

Station A: Montag 08:00-12:00

Station B: Montag 12:00-16:00

---
### - Qualifikationskonflikt
#### Geschäftsregel:
Eine erforderliche Qualifikation muss für eine Schicht vorhanden sein.
Das heißt bestimmte Stationen benötigen Mitarbeiter mit bestimmten Qualifikationen. Ein Mitarbeiter ohne die erforderliche Qualifikation darf deshalb nicht für diese Station eingeplant werden.
#### Umsetzung:
Diese Constraint betrachtet jeweils ein einzelnes Assignment.
***forEach(Assignment.class)*** Funktion ist hier ausreichend, da die Qualifikation des Mitarbeiters
direkt mit der benötigen Qualifikation der Station vergleichen wird.
Mit ***filter()*** wird geprüft, ob die Qualifikation voneinander abweichen.
Bei einer Abweichung wird eine ***Hard-Penality vergeben***.
#### Beispiele:
Mitarbeiter: Max

Qualifikation: pflegekraft

Station A

benötigte Qualifikation: pflegekraft

**keine Verletzung**.

###### **Aber**
Mitarbeiter: Max

Qualifikation: pflegekraft

Station A

benötigte Qualifikation: Arzt

**Hard Constraint verletzt**.

----

### - Mindestbesetzung einer Station
#### Geschäftsregel
Eine Station muss mindestens mit einer bestimmten Anzahl von 
Mitarbeiter besetzt sein.
#### Umsetzung
Die Assignments werden nach ****Station*** und ****Timeslot**** gruppiert.
Mit ****ContraintCollectors.count()**** wird anschließend gezählt,
wie viele Mitarbeiter dieser Station in diesem Timeslot zugeordnet sind.

Die Ergebnisse von dieser Anzahl ist den vergleich mit der ****Station****
benötigten Mitarbeiteranzahl verglichen.

Wenn weniger Mitarbeiter zugewiesen sind als benötigt,
wird eine ****Hard-Penality**** vergeben.

_Die Höhe der Penality hier entspricht dabei der Anzahl der fehlenden Mitarbeiter._
#### Beispiele
Station A

benötigten Mitarbeiter: 3

Es sind jedoch nur: 2 Mitarbeiter zugewiesen.

Damit fehlen: 1 Mitarbeiter

diese wird mit einer ****Hard-Penality**** bewertet.

----

### - Maximale tägliche Arbeitszeit
#### Geschäftsregel
Die maximale Arbeitszeit in einem Tag darf nicht überschritten werden.
#### Umsetzung
Die Assignments werden nach folgen Eigenschaften gruppiert:
****Mitarbeiter & Wochentag****
mit ****ConstraintCollectors.sumDuration()**** Funktion wird dit gesamte Arbeitsdauer
aller Assignments eines Mitarbeiters an diesem Wochentag berechnet.
Anschließend wird die berechnete Arbeitszeit mit der beim Mitarbeiter hinterlegten
maximalen Arbeitszeit verglichen.
Wenn die tatsächliche Arbeitszeit größer als die erlaubte maximale Arbeitszeit ist,
wird eine ****Hard-Penality**** vergeben.
Die Penality berücksichtigt dabei die Dauer der Überschreitung.
#### Beispiele
Maximale tägliche Arbeitszeit:

8 Stunden  
Mitarbeiter Tom:  
Arbeitstag: Dienstag  
Arbeitszeit:  
08:00-12:00 → 4 Stunden  
13:00-18:00 → 5 Stunden  
Gesamtarbeitszeit: 4 + 5 = 9 Stunden

Die maximale Arbeitszeit wird somit um eine Stunde überschritten.

Die Constraint wird daher verletzt mit Penality auf 1.

----
### - Mindest-Ruhezeit zwischen Einsätzen
### Geschäftsregel
Zwischen zwei Einsätzen desselben Mitarbeiters muss mindestens die konfigurierte
Ruhezeit liegen.
### Umsetzung
Für diese Constraint werden zwei Assignments desselben Mitarbeiters miteinander verglichen.
****forEachUniquePair()**** Funktion wird verwendet, da die Ruhezeit aus der Beziehung zwischen 
zwei Einsätzen entsteht.

Zunächst werden Assignments berücksichtigt, die an unterschiedlichen Wochentagen liegen.

Dann die tatsächliche Ruhezeit wird folgendermaßen berechnet:

Beginn des späteren Einsatzes - Ende des früheren Einsatzes = Tatsächliche Ruhezeit.

Anschließend wird die tatsächliche Ruhezeit mit der beim Mitarbeiter konfigurierten 
Mindest-Ruhezeit verglichen.

Ist die tatsächliche Ruhezeit kleiner als die erforderliche Ruhezeit, wird eine ****Hard-Penality*** vergeben.
### Beispiele
Montag: 20:00-22:00
Dienstag: 08:00-16:00

Die Ruhezeit beträgt: 22:00 -> 08:00 = 10 Stunden

Wenn für diesen Mitarbeiter eine Mindest-Ruhezeit von 11 Stunden konfiguriert ist, wird die ****Constraint verletzt****.

----
## 2. Soft Constraints
Hier reden wir über Wünschen oder Präferenzen von Mitarbeiter, die möglichst eingehalten werden, sollen
aber bei schwierigem Planungsproblem verletzt werden dürfen.
Hier sind einigen Beispiele, die implementieren sind. ****Dies kann angepasst werden****.

----
### - Nachtsdienst Präferenz
#### Geschäftsregel
Mitarbeiter möchte möglichst keine Nachtsdienste.
#### Umsetzung
Hier für jedes Assigment wird der Typ des Timeslots geprüft. Wenn Typ ****NACHTSCHICHT**** erkannt ist, wird eine ****Soft-Penality**** vergeben.

Die Constraint wird mit ****forEach(Assignment.class)**** auf jeden Assignment angewendet.
#### Beispiel
Mitarbeiter Jen möchte keine Nachtschicht:

Planning : Montag 22:00 - 06:00

1 soft-penality

****Nachtdienst bleibt trotzdem zulässig****.

---
### - Wochenende Präferenz
#### Geschäftsregel
Mitarbeitern möchten am wochenende frei haben.
#### Umsetzung
Die Constraint prüft den ****DayOfWeek**** des Timeslots. Ist der Tag ****SAMSTAG**** oder ****SONTAG***,
wird eine Soft-Penality vergeben.
#### Beispiel
Ein Assigment am:

Samstag: Uhrzeit egal

oder 

Sontag: Uhrzeit egal

erzeugt eine Soft-Penality.

---

### - Schicht Präferenz
#### Geschäftsregel
Je Mitarbeiter kann eine bevorzugte Schichtart angeben.Der Solver soll hier versuchen, den Mitarbeiter möglichst häufig
in seiner bevorzugten Schicht einzusetzen. Diese Schicht könne Früh, Spät, oder Nacht sein.
#### Umsetzung
Wenn ein Mitarbeiter eine Schicht Präferenz hat, dies ist in ****wunschSchicht**** gespeichert.
Der tatsächliche Schichttyp des Timeslots wird mit dieser Präferenz verglichen.
Stimmen beide Werte nicht überein, entsteht eine Soft-Penality.
#### Beispiel
Mitarbeiter Tim bevorzugt: Früh dienst wird aber für ****Spät*** eingeplant. Dafür entsteht eine ****Soft-Penality****.

---

### - Nachtsdienst hintereinander
#### Geschäftsregel
Ein Mitarbeiter soll möglichst nicht mehr als dre aufeinander Nachtsdienste übernehmen.
#### Umsetzung
Zunächst werden nur Nachtdienste betrachtet. Ergebnisse von diese filter werden mit ****toConsecutiveSequences()****
nach dem Wochentag gruppiert. Dadurch können zusammenhängende Serien von Nachtdienste erkannt werden.

Für jede Serie wird geprüft:

Länge > 3

Die Anzahl der überschüssigen Nachtdienste wird anschließend als Penality verwendet.

3 Nachtdienste → 0 Soft
4 Nachtdienste → 1 Soft
5 Nachtdienste → 2 Soft
6 Nachtdienste → 3 Soft

Damit wird nicht die gesamte Serir bestraft, sondern nur der Teil, der über der erlaubten Präferenz
von drei aufeinanderfolgenden Nachtdienste liegt.
#### Beispiel
Mitarbeiter jena arbeitet:

Montag: Nacht

Dienstag: Nacht

Mittwoch: Nacht

Donnerstag: Nacht

Die erste drei Nachtdienste sind akzeptiert. ****_Die vierte erzeugt 1 Soft-Penality_****

---
### - Wunschfreie Tage
#### Geschäftsregel
Mitarbeiter können bestimmte Wochentage als Wunschfrei angeben. Ein Assignment an solchen Tag soll möglichst vermeiden werden.
#### Umsetzung
Die Liste ****wunschFreitage**** des Mitarbeiters wird mit dem ****DayOfWeek**** des Timeslots verglichen.

Wenn der aktuelle Wochentag in der Liste enthalten ist, wird eine Soft-Penality vergeben.

Wochentag → in wunschFreitage enthalten? → ja → ONE_SOFT
#### Beispiel
Mitarbeiter Lisa hat:

wunschFreitage = [MITTWOCH, SONNTAG] und erhält trotzdem einen Dienst am einen diesen Tagen 
dafür entsteht ****1 Soft-Penality****

---
### - Mitarbeiter Präferenz
#### Geschäftsregel
Zwei Mitarbeiter würden möglichst gemeinsam arbeiten. Wenn zwei Mitarbeiter einander bevorzugen,
soll der Solver sie möglichst derselben Schicht zuordnen.
#### Umsetzung
Da zwei Assignment sich vergleichen muss, verwendet die Constraint ****forEachUniquePair()**** Funktion.
Zunächst wird sichergestellt, dass die beiden Assignments unterschiedlichen Mitarbeiter gehören.

Danach wird geprüft, ob Mitarbeiter A bevorzugt Mitarbeiter B ****UND**** Mitarbeiter B bevorzugt Mitarbeiter A

Nur bei einer gegenseitigen Präferenz wird die weitere Prüfung durchgeführt.

Anschließend wird geprüft, ob beide Assignments denselben Timeslot besitzen.
Wenn die bevorzugten Mitarbeiter unterschiedlichen Timeslots zugeordnet sind, entsteht eine ****Soft-Penality****.
#### Beispiel
Mitarbeiter Tom und Claire bevorzugen sich gegenseitig:

Tom -> Montag: Früh

Claire -> Montag: Spät

Da sie unterschiedliche Timeslots haben, entsteht ****1 Soft-Penality****.

---
### - Wochenende Fairness
#### Geschäftsregel
Wochendienste sollen möglichst gleichmäßig auf die Mitarbeiter verteilt werden.

Die Anzahl der Wochenenddienste jedes Mitarbeiters wird mit dem Durchschnitt aller Mitarbeiter verglichen.

Mitarbeiter mit einer Anzahl über dem Durchschnitt erhalten eine Soft-Penality.

****Für die aktuelle Implementierung wird angenommen, dass jeder Mitarbeiter mindestens einem Wochenenddienst übernimmt.****
****Mitarbeiter mit speziellen Wünschen, möglichst nicht am Wochenende zu arbeiten, können über die anderen Soft Constraints
berücksichtigt werden.****
#### Umsetzung
Zunächst werden nur Assignments an Samstagen und Sonntagen betrachtet. Die Assignments werden nach Mitarbeiter gruppiert:

Employee -> Anzahl Wochenenddienste

Anschließend wird mit ****ConstraintCollectors.average()**** der durchschnittliche Wert bestimmt.

Der individuelle Wert wird mit diesem Durchschnitt verglichen.
Nur Werte über dem Durchschnitt werden bestraft. Die Abweichung wird mit ****Math.ceil()**** aufgerundet.

count > average → count - average → Math.ceil() → Soft-Penality
#### Beispiel
Mitarbeiter Tom: 4 Wochendienste

Mitarbeiter Suzan: 2 Wochendienste

Mitarbeiter Carlos: 2 Wochendienste

Mitarbeiter Jen: 3 Wochendienste

Der Durchschnitt beträgt: (4 + 2 + 2 + 3)/ 4 = 2,75

Tom         Abweichung vom Durchschnitt:1,25         Penality: 2

Suzan       Abweichung vom Durchschnitt:Unter        Penality: 0

Carlos      Abweichung vom Durchschnitt:Unter        Penality: 0

Jen         Abweichung vom Durchschnitt:0,25         Penality: 1

Durch ****Math.ceil()**** erhält auch eine kleine Überschreitung des Durchschnitts eine Penality.

---
#### Alternative: Load Balancing
Timefold stellt mit ****loadBalance()**** einen speziellen Constraint Collector für Fairness- und
Lastverteilungsprobleme bereit. Dieser kann ebenfalls zur gleichmäßigen Verteilung von Wochenenddiensten
verwendet werden.

Für dieses Projekt wurde bewusst die eigene Durchschnittsberechnung mit ****HardSoftScore**** verwendet.
Dadurch bleibt der bereits im Projekt verwendete Score-Typ erhalten und es müssen
keine bestehenden Constraints auf ****HardSoftBigDecimalScore**** umgestellt werden.

****loadBalance()**** stellt daher eine mögliche Alternative dar, wird in der aktuellen Implementierung
jedoch nicht verwendet.